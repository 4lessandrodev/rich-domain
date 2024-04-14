import { EventEmitter } from "events";
import { Event, EventManager, EventType } from "../types";
import validateContextEventName from "../utils/validate-context-event-name.util";
export default class ServerEventManager implements EventManager {
    private events: EventType[];
    private static _instance: ServerEventManager;
    private readonly emitter: EventEmitter;

    private constructor() {
        this.events = [];
        if (typeof global?.process === 'undefined' || typeof EventEmitter === 'undefined') {
            throw new Error('ServerEventManager is not supported');
        }
        this.emitter = new EventEmitter({ captureRejections: true });
    }

    static instance(): ServerEventManager {
        if (ServerEventManager._instance) return ServerEventManager._instance;
        ServerEventManager._instance = new ServerEventManager();
        return ServerEventManager._instance;
    }

    private getEvent(eventName: string): EventType | null {
        const event = this.events.find((event): boolean => event.eventName === eventName);
        if (event) return event;
        return null;
    }

    subscribe(eventName: string, fn: (event: Event) => void | Promise<void>): void {
        validateContextEventName(eventName);
        if (this.exists(eventName)) return;
        this.events.push({ eventName, callback: fn });
        this.emitter.addListener(eventName, fn);
    }

    exists(eventName: string): boolean {
        const count = this.emitter.listenerCount(eventName);
        const hasListener = count > 0;
        const hasLocal = !!this.events.find((evt): boolean => evt.eventName === eventName);
        return hasListener || hasLocal;
    }

    removerEvent(eventName: string): boolean {
        const event = this.getEvent(eventName);
        if (!event) return false;
        this.events = this.events.filter((event): boolean => event.eventName !== eventName);
        this.emitter.removeListener(eventName, event.callback);
        return true;
    }

    dispatchEvent(eventName: string, ...args: any[]): void {
        validateContextEventName(eventName);
        if (eventName.includes('*')) {
            const regex = new RegExp(eventName.replace('*', '.*'));
            let i = 0;
            while (this.events[i]) {
                const localEventName = this.events[i].eventName;
                const match = regex.test(localEventName);
                if (match) {
                    this.emitter.emit(localEventName, args);
                }
                i++;
            }
            return;
        }
        this.emitter.emit(eventName, { detail: args || [] });
    }
}
