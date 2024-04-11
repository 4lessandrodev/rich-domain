import { EventEmitter } from "events";
import EventManager from "./event-manager";

export type EventType = { eventName: string, callback: (...args: any[]) => void | Promise<void> };

export default class ServerEventManager implements EventManager {
    private events: EventType[];
    private static _instance: ServerEventManager;
    private readonly emitter: EventEmitter;

    private constructor(options?: { captureRejections: boolean }) {
        this.events = [];
        if (typeof process === 'undefined' || typeof EventEmitter === 'undefined') {
            throw new Error('ServerEventManager is not supported');
        }
        this.emitter = new EventEmitter(options);
    }

    static instance(): ServerEventManager {
        if(ServerEventManager._instance) return ServerEventManager._instance;
        ServerEventManager._instance = new ServerEventManager();
        return ServerEventManager._instance;
    }

    private getEvent(eventName: string): EventType | null {
        const event = this.events.find((event) => event.eventName === eventName);
        if (event) return event;
        return null;
    }

    subscribe(eventName: string, fn: (...args: any[]) => void | Promise<void>) {
        if (this.exists(eventName)) return;
        this.events.push({ eventName, callback: fn });
        this.emitter.addListener(eventName, fn);
    }

    exists(eventName: string) {
        const count = this.emitter.listenerCount(eventName);
        const hasListener = count > 0;
        const hasLocal = !!this.events.find((evt) => evt.eventName === eventName);
        return hasListener || hasLocal;
    }

    removerEvent(eventName: string) {
        const event = this.getEvent(eventName);
        if (!event) return false;
        this.events = this.events.filter((event) => event.eventName !== eventName);
        this.emitter.removeListener(event.eventName, event.callback);
        return true;
    }

    dispatchEvent(eventName: string, ...args: any[]) {
        const exists = this.exists(eventName);
        if(!exists) return;
        this.emitter.emit(eventName, { detail: args });
    }
}
