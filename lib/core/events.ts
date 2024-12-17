import { Metrics, DEvent, Options, Handler, PromiseHandler } from "../types";

/**
 * @description TsEvents manages a collection of events for a given aggregate. 
 * It allows adding, removing, and dispatching events, as well as retrieving event-related metrics.
 */
export class TsEvents<T> {
  private _metrics: Metrics;
  private _events: DEvent<T>[];
  private totalDispatched: number;

  /**
   * @description Creates an instance of TsEvents associated with a given aggregate.
   * @param aggregate The aggregate instance to which these events belong.
   */
  constructor(private readonly aggregate: T) {
    this._events = [];
    this.totalDispatched = 0;
    this._metrics = {
      totalDispatched: (): number => this.totalDispatched,
      totalEvents: (): number => this._events.length,
    };
  }

  /**
   * @description Provides metrics related to the currently managed events, such as the total number of 
   * dispatched events and the total number of events pending.
   * @returns {Metrics} An object containing functions to retrieve event metrics.
   */
  get metrics(): Metrics {
    return this._metrics;
  }

  /**
   * @description Determines a priority value based on the number of currently stored events.
   * If there is one or zero events, the priority is set to 2. Otherwise, it equals the total number of events.
   * @returns The computed priority value.
   * @private
   */
  private getPriority(): number {
    const totalEvents = this._events.length;
    if (totalEvents <= 1) return 2;
    return totalEvents;
  }

  /**
   * @description Dispatches a single event by its name. If the event is found, it is executed and then removed.
   * If the event does not exist, this method does nothing.
   * @param eventName The name of the event to dispatch.
   * @param args Additional arguments to pass to the event's handler function.
   * @returns A void or Promise<void> depending on whether the event handler returns a promise.
   */
  dispatchEvent(eventName: string, ...args: any[]): void | Promise<void> {
    const _event = this._events.find(
      (evt): boolean => evt.eventName === eventName,
    );
    if (!_event) return;
    this.totalDispatched = this.totalDispatched + 1;
    _event.handler(this.aggregate, [_event, ...args]);
    this.removeEvent(eventName);
  }

  /**
   * @description Returns default options for an event if none are provided. 
   * This typically sets the event priority based on the current number of events.
   * @returns The default event options.
   * @private
   */
  private getDefaultOptions(): Options {
    const priority = this.getPriority();
    return {
      priority,
    };
  }

  /**
   * @description Adds a new event to the manager. If an event with the same name already exists,
   * the old event is removed before adding the new one.
   * @param eventName The name of the event to add.
   * @param handler The function to handle the event when dispatched.
   * @param options Optional configuration for the event, such as priority.
   * 
   * @throws Will throw an error if `eventName` is invalid (not a string or too short) or if `handler` is not a function.
   */
  addEvent(eventName: string, handler: Handler<T>, options?: Options): void {
    const defaultOptions = this.getDefaultOptions();
    const opt = options ? options : defaultOptions;
    this.validateEventName(eventName);
    this.validateHandler(handler, eventName);
    this.removeEvent(eventName);
    this._events.push({ eventName, handler, options: opt });
  }

  /**
   * @description Validates that the handler is a function. If not, it throws an error.
   * @param handler The event handler to validate.
   * @param eventName The name of the event associated with this handler.
   * @private
   */
  private validateHandler(handler: Handler<T>, eventName: string): void {
    if (typeof handler !== "function") {
      const message = `addEvent: handler for ${eventName} is not a function`;
      throw new Error(message);
    }
  }

  /**
   * @description Validates the event name. It must be a string and have at least 3 characters.
   * @param eventName The event name to validate.
   * @throws Will throw an error if the event name is invalid.
   * @private
   */
  private validateEventName(eventName: string): void {
    if (typeof eventName !== "string" || String(eventName).length < 3) {
      const message = `addEvent: invalid event name ${eventName}`;
      throw new Error(message);
    }
  }

  /**
   * @description Removes all currently registered events.
   */
  clearEvents(): void {
    this._events = [];
  }

  /**
   * @description Removes a specific event by its name.
   * @param eventName The name of the event to remove.
   */
  removeEvent(eventName: string): void {
    this._events = this._events.filter(
      (event): boolean => event.eventName !== eventName,
    );
  }

  /**
   * @description Dispatches all currently stored events in order of their priority (lowest priority number first).
   * Once dispatched, events are removed from the collection.
   * @returns A Promise that resolves once all promise-based event handlers have been completed.
   * In case of errors during promise resolution, they are logged to the console.
   */
  async dispatchEvents(): Promise<void> {
    const promisesEvents: PromiseHandler<T>[] = [];
    const sorted = this._events.sort(
      (a, b): number => a.options.priority - b.options.priority,
    );

    sorted.forEach((_event): void => {
      this.totalDispatched = this.totalDispatched + 1;
      const fn = _event.handler(this.aggregate, [_event]);
      if (fn instanceof Promise) {
        promisesEvents.push(fn as unknown as PromiseHandler<T>);
      }
    });

    await Promise.all(promisesEvents).catch(console.error);
    this.clearEvents();
  }
}

export default TsEvents;
