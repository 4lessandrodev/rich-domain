import { Event, EventManager, EventType } from "../types";
import validateContextEventName from "../utils/validate-context-event-name.util";

/**
 * @description BrowserEventManager provides a global event management system
 * utilizing the browser's Window and Event mechanisms. It allows subscribing to
 * events that can be dispatched both synchronously and asynchronously, storing
 * event states in sessionStorage and ensuring persistence across page reloads.
 */
export default class BrowserEventManager implements EventManager {
  private events: EventType[];
  private static _instance: BrowserEventManager;

  /**
   * @description Creates an instance of BrowserEventManager.
   * Throws an error if the provided window object is not defined,
   * as this manager is intended for browser environments.
   * @param _window The browser's window object.
   * @private
   */
  private constructor(private readonly _window: Window & typeof globalThis) {
    this.events = [];
    if (typeof this._window === "undefined") {
      throw new Error(
        "BrowserEventManager is not supported in the current environment.",
      );
    }
  }

  /**
   * @description Returns a singleton instance of BrowserEventManager.
   * If an instance has already been created, it returns the existing one.
   * @param window The browser's window object.
   * @returns The singleton instance of BrowserEventManager.
   */
  static instance(window: Window & typeof globalThis): BrowserEventManager {
    if (BrowserEventManager._instance) return BrowserEventManager._instance;
    BrowserEventManager._instance = new BrowserEventManager(window);
    return BrowserEventManager._instance;
  }

  /**
   * @description Retrieves an event by name from the internal events list.
   * @param eventName The name of the event to retrieve.
   * @returns The matching EventType object if found, otherwise null.
   * @private
   */
  private getEvent(eventName: string): EventType | null {
    const event = this.events.find(
      (event): boolean => event.eventName === eventName,
    );
    return event ?? null;
  }

  /**
   * @description Subscribes a callback function to a given event.
   * Ensures that the event subscription is persisted in sessionStorage,
   * and cleans up the subscription when the browser unloads.
   * @param eventName The name of the event to subscribe to.
   * @param fn The callback function to execute when the event is dispatched.
   */
  subscribe(
    eventName: string,
    fn: (event: Event) => void | Promise<void>,
  ): void {
    validateContextEventName(eventName);
    if (this.exists(eventName)) return;
    this.events.push({ eventName, callback: fn });
    this._window.sessionStorage.setItem(
      "rich-domain-event:" + eventName,
      Date.now().toString(),
    );
    this._window.addEventListener(eventName, fn as unknown as () => {});
    this._window.addEventListener("beforeunload", (): void => {
      this._window.sessionStorage.removeItem("rich-domain-event:" + eventName);
    });
  }

  /**
   * @description Checks if the given event name is already subscribed and persisted.
   * @param eventName The name of the event.
   * @returns `true` if the event is subscribed or exists in sessionStorage; otherwise, `false`.
   */
  exists(eventName: string): boolean {
    const existsOnWindow = !!this._window.sessionStorage.getItem(
      "rich-domain-event:" + eventName,
    );
    const existsInternal = !!this.events.find(
      (evt): boolean => evt.eventName === eventName,
    );
    return existsOnWindow || existsInternal;
  }

  /**
   * @description Removes a subscribed event by name, cleaning up any related listeners and sessionStorage entries.
   * @param eventName The name of the event to remove.
   * @returns `true` if the event was found and removed successfully; otherwise, `false`.
   */
  removeEvent(eventName: string): boolean {
    this._window.sessionStorage.removeItem("rich-domain-event:" + eventName);
    const event = this.getEvent(eventName);
    if (!event) return false;
    this.events = this.events.filter(
      (ev): boolean => ev.eventName !== eventName,
    );
    this._window.removeEventListener(eventName, event.callback);
    return true;
  }

  /**
   * @description Dispatches a custom event with the given name and optional arguments.
   * Supports wildcard patterns by replacing `'*'` with `'.*'` to dispatch multiple matching events.
   * @param eventName The name of the event to dispatch. Can include a wildcard `'*'`.
   * @param args Additional arguments passed as the `detail` property of the dispatched event.
   */
  dispatchEvent(eventName: string, ...args: any[]): void {
    validateContextEventName(eventName);

    // Handle wildcard events
    if (eventName.includes("*")) {
      const regex = new RegExp(eventName.replace("*", ".*"));
      let i = 0;
      while (this.events[i]) {
        const localEventName = this.events[i].eventName;
        const match = regex.test(localEventName);
        if (match) {
          this._window.dispatchEvent(
            new this._window.CustomEvent(localEventName, {
              bubbles: true,
              detail: args || [],
            }),
          );
        }
        i++;
      }
      return;
    }

    // Dispatch a single event
    this._window.dispatchEvent(
      new this._window.CustomEvent(eventName, {
        bubbles: true,
        detail: args || [],
      }),
    );
  }
}
