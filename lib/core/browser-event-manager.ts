import { EventManager, EventType } from "../types";

export default class BrowserEventManager implements EventManager {
    private events: EventType[];
    private static _instance: BrowserEventManager;

    private constructor() {
        this.events = [];
        if (typeof globalThis?.window === 'undefined') {
            throw new Error('BrowserEventManager is not supported');
        }
    }

    static instance(): BrowserEventManager {
        if (BrowserEventManager._instance) return BrowserEventManager._instance;
        BrowserEventManager._instance = new BrowserEventManager();
        return BrowserEventManager._instance;
    }

    private getEvent(eventName: string): EventType | null {
        const event = this.events.find((event): boolean => event.eventName === eventName);
        if (event) return event;
        return null;
    }

    subscribe(eventName: string, fn: (...args: any[]) => void | Promise<void>): void {
        if (this.exists(eventName)) return;
        this.events.push({ eventName, callback: fn });
        globalThis.window.sessionStorage.setItem('rich-domain-event:' + eventName, Date.now().toString());
        globalThis.window.addEventListener(eventName, fn);
        globalThis.window.addEventListener('beforeunload', (): void => {
            globalThis.window.sessionStorage.removeItem('rich-domain-event:' + eventName);
        });
    }

    exists(eventName: string): boolean {
        const existsOnWindow = !!globalThis.window.sessionStorage.getItem('rich-domain-event:' + eventName);
        const existsInternal = !!this.events.find((evt): boolean => evt.eventName === eventName);
        return existsOnWindow || existsInternal;
    }

    removerEvent(eventName: string): boolean {
        window.sessionStorage.removeItem('rich-domain-event:' + eventName);
        const event = this.getEvent(eventName);
        if (!event) return false;
        this.events = this.events.filter((event): boolean => event.eventName !== eventName);
        globalThis.window.removeEventListener(event.eventName, event.callback);
        globalThis.window.sessionStorage.removeItem('rich-domain-event:'+ eventName);
        return true;
    }

    dispatchEvent(eventName: string, ...args: any[]): void {
        const exists = this.exists(eventName);
        if (!exists) return;
        globalThis.window.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: args
        }));
    }
}
