import { Event, EventManager, EventType } from "../types";
import validateContextEventName from "../utils/validate-context-event-name.util";

export default class BrowserEventManager implements EventManager {
    private events: EventType[];
    private static _instance: BrowserEventManager;

    private constructor(private readonly _window: Window & typeof globalThis) {
        this.events = [];
        if (typeof this._window === 'undefined') {
            throw new Error('BrowserEventManager is not supported');
        }
    }

    static instance(window: Window & typeof globalThis): BrowserEventManager {
        if (BrowserEventManager._instance) return BrowserEventManager._instance;
        BrowserEventManager._instance = new BrowserEventManager(window);
        return BrowserEventManager._instance;
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
        this._window.sessionStorage.setItem('rich-domain-event:' + eventName, Date.now().toString());
        this._window.addEventListener(eventName, fn as unknown as () => {});
        this._window.addEventListener('beforeunload', (): void => {
            this._window.sessionStorage.removeItem('rich-domain-event:' + eventName);
        });
    }

    exists(eventName: string): boolean {
        const existsOnWindow = !!this._window.sessionStorage.getItem('rich-domain-event:' + eventName);
        const existsInternal = !!this.events.find((evt): boolean => evt.eventName === eventName);
        return existsOnWindow || existsInternal;
    }

    removerEvent(eventName: string): boolean {
        this._window.sessionStorage.removeItem('rich-domain-event:' + eventName);
        const event = this.getEvent(eventName);
        if (!event) return false;
        this.events = this.events.filter((event): boolean => event.eventName !== eventName);
        this._window.removeEventListener(eventName, event.callback);
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
                    this._window.dispatchEvent(new this._window.CustomEvent(localEventName, {
                        bubbles: true,
                        detail: args || []
                    }));
                }
                i++;
            }
            return;
        }

        this._window.dispatchEvent(new this._window.CustomEvent(eventName, {
            bubbles: true,
            detail: args || []
        }));
    }
}
