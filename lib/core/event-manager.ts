export default abstract class EventManager {
    abstract addEvent(eventName: string, fn: (...args: any[]) => void | Promise<void>): void;
    abstract exists(eventName: string): boolean;
    abstract removerEvent(eventName: string): boolean;
    abstract dispatchEvent(eventName: string, ...args: any[]): void;
}
