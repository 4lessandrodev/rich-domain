import EventManager from "./event-manager";

export type EventType = { eventName: string, callback: (...args: any[]) => void | Promise<void> };

export default class BrowserEventManager implements EventManager {
    private events: EventType[];
    private static _instance: BrowserEventManager;

    private constructor() {
        this.events = [];
        if (typeof document === 'undefined' || typeof window === 'undefined') {
            throw new Error('BrowserEventManager is not supported');
        }
    }

    static instance(): BrowserEventManager {
        if(BrowserEventManager._instance) return BrowserEventManager._instance;
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
        window.sessionStorage.setItem('rich-domain-event:'+ eventName, 'true');
        document.addEventListener(eventName, fn);
    }

    exists(eventName: string): boolean {
        const existsOnWindow = !!window.sessionStorage.getItem('rich-domain-event:'+eventName);
        const existsInternal = !!this.events.find((evt): boolean => evt.eventName === eventName);
        return existsOnWindow || existsInternal;
    }

    removerEvent(eventName: string): boolean {
        window.sessionStorage.removeItem('rich-domain-event:'+eventName);
        const event = this.getEvent(eventName);
        if (!event) return false;
        this.events = this.events.filter((event): boolean => event.eventName !== eventName);
        document.removeEventListener(event.eventName, event.callback);
        return true;
    }

    dispatchEvent(eventName: string, ...args: any[]): void {
        const exists = this.exists(eventName);
        if(!exists) return;
        document.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: args
        }));
    }
}
