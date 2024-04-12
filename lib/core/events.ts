import { Metrics, DEvent, Options, Handler, PromiseHandler } from "../types";

export class TsEvents<T> {
  private _metrics: Metrics;
  private _events: DEvent<T>[];
  private totalDispatched: number;

  /**
   * Creates an instance of Events for aggregate.
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
   * Getter method for accessing metrics related to events.
   * @returns {Metrics} Metrics related to events.
   */
  get metrics(): Metrics {
    return this._metrics;
  }

  /**
   * Gets the priority based on the number of events.
   * @returns The priority value.
   */
  private getPriority(): number {
    const totalEvents = this._events.length;
    if (totalEvents <= 1) return 2;
    return totalEvents;
  }

  /**
   * Gets the default options.
   * @returns The default options.
   */
  private getDefaultOptions(): Options {
    const priority = this.getPriority();
    return {
      priority,
    };
  }

  /**
   * Adds a new event.
   * @param eventName - The name of the event.
   * @param handler - The event handler function.
   * @param options - The options for the event.
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
   * Validates the event handler.
   * @param handler - The event handler function.
   * @param eventName - The name of the event.
   */
  private validateHandler(handler: Handler<T>, eventName: string): void {
    if (typeof handler !== "function") {
      const message = `addEvent: handler for ${eventName} is not a function`;
      throw new Error(message);
    }
  }

  /**
   * Validates the event name.
   * @param eventName - The name of the event.
   */
  private validateEventName(eventName: string): void {
    if (typeof eventName !== "string" || String(eventName).length < 3) {
      const message = `addEvent: invalid event name ${eventName}`;
      throw new Error(message);
    }
  }

  /**
   * Clears all events.
   */
  clearEvents(): void {
    this._events = [];
  }

  /**
   * Removes an event by name.
   * @param eventName - The name of the event to remove.
   */
  removeEvent(eventName: string): void {
    this._events = this._events.filter(
      (event): boolean => event.eventName !== eventName,
    );
  }

  /**
   * Dispatches an event.
   * @param eventName - The name of the event to dispatch.
   * @param args - Any param user wants provide as argument.
   * @returns The result of the event handler function.
   */
  dispatchEvent(eventName: string, ...args: any[]): void | Promise<void> {
    const _event = this._events.find(
      (evt): boolean => evt.eventName === eventName,
    );
    if (!_event) {
      const message = `dispatchEvent: ${eventName} event not found`;
      return console.error(message);
    }
    this.totalDispatched = this.totalDispatched + 1;
    _event.handler(this.aggregate, [_event, ...args]);
    this.removeEvent(eventName);
  }

  /**
   * Dispatches all events.
   * @returns A promise that resolves when all promise-based events are completed.
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
