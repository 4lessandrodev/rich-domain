import { EventEmitter } from "events";
import { Event, EventManager, EventType } from "../types";
import validateContextEventName from "../utils/validate-context-event-name.util";

/**
 * @class ServerEventManager
 * @description A singleton class to manage server-side events. This class ensures that event listeners are properly managed and provides utilities for subscribing, dispatching, and removing events.
 * @implements {EventManager}
 */
export default class ServerEventManager implements EventManager {
    private events: EventType[]; // Stores the list of registered events and their handlers.
    private static _instance: ServerEventManager; // Singleton instance of the ServerEventManager.
    private readonly emitter: EventEmitter; // Node.js EventEmitter instance for event handling.

    /**
     * @private
     * @constructor
     * @throws {Error} If the runtime environment does not support EventEmitter or Node.js process.
     */
    private constructor() {
        this.events = [];
        if (typeof global?.process === 'undefined' || typeof EventEmitter === 'undefined') {
            throw new Error('ServerEventManager is not supported');
        }
        this.emitter = new EventEmitter({ captureRejections: true }); // Enable rejection capture for promise-based event handlers.
    }

    /**
     * @static
     * @method instance
     * @description Returns the singleton instance of the ServerEventManager. If it doesn't exist, it initializes a new instance.
     * @returns {ServerEventManager} The singleton instance.
     */
    static instance(): ServerEventManager {
        if (ServerEventManager._instance) return ServerEventManager._instance;
        ServerEventManager._instance = new ServerEventManager();
        return ServerEventManager._instance;
    }

    /**
     * @private
     * @method getEvent
     * @description Retrieves the event handler associated with a given event name.
     * @param {string} eventName The name of the event.
     * @returns {EventType | null} The event type if found, otherwise null.
     */
    private getEvent(eventName: string): EventType | null {
        const event = this.events.find((event): boolean => event.eventName === eventName);
        return event || null;
    }

    /**
     * @method subscribe
     * @description Subscribes a callback function to a specific event. If the event already exists, it won't be added again.
     * @param {string} eventName The name of the event.
     * @param {(event: Event) => void | Promise<void>} fn The callback function to handle the event.
     * @throws {Error} If the event name does not follow the context:event pattern.
     */
    subscribe(eventName: string, fn: (event: Event) => void | Promise<void>): void {
        validateContextEventName(eventName); // Validate event name format.
        if (this.exists(eventName)) return; // Avoid duplicate subscriptions.
        this.events.push({ eventName, callback: fn }); // Register the event.
        this.emitter.addListener(eventName, fn); // Add the listener to the EventEmitter.
    }

    /**
     * @method exists
     * @description Checks if an event with the given name is already registered.
     * @param {string} eventName The name of the event to check.
     * @returns {boolean} True if the event exists, false otherwise.
     */
    exists(eventName: string): boolean {
        const count = this.emitter.listenerCount(eventName); // Check if there are listeners for the event.
        const hasListener = count > 0;
        const hasLocal = !!this.events.find((evt): boolean => evt.eventName === eventName); // Check if it exists in the local list.
        return hasListener || hasLocal;
    }

    /**
     * @method removerEvent
     * @description Removes an event and its associated callback from the manager and EventEmitter.
     * @param {string} eventName The name of the event to remove.
     * @returns {boolean} True if the event was successfully removed, false otherwise.
     */
    removerEvent(eventName: string): boolean {
        const event = this.getEvent(eventName);
        if (!event) return false; // Event not found.
        this.events = this.events.filter((event): boolean => event.eventName !== eventName); // Remove from local list.
        this.emitter.removeListener(eventName, event.callback); // Remove the listener from EventEmitter.
        return true;
    }

    /**
     * @method dispatchEvent
     * @description Dispatches an event, optionally supporting wildcard patterns to emit multiple events.
     * @param {string} eventName The name of the event to dispatch. Supports wildcard patterns using `*`.
     * @param {...any[]} args Arguments to pass to the event handler.
     */
    dispatchEvent(eventName: string, ...args: any[]): void {
        validateContextEventName(eventName); // Validate event name format.

        if (eventName.includes('*')) {
            // Handle wildcard patterns in event names.
            const regex = new RegExp(eventName.replace('*', '.*'));
            let i = 0;
            while (this.events[i]) {
                const localEventName = this.events[i].eventName;
                const match = regex.test(localEventName); // Match event names using regex.
                if (match) {
                    this.emitter.emit(localEventName, { detail: args || [] }); // Emit matching events.
                }
                i++;
            }
            return;
        }

        this.emitter.emit(eventName, { detail: args || [] }); // Emit the event directly if no wildcard.
    }
}
