
import BrowserEventManager from '../../lib/core/browser-event-manager'

describe('BrowserEventManager', () => {
    var sessionStorage = new Map<string, string>();
    var globalThis = {
        window: {
            sessionStorage: {
                getItem: (key: string) => sessionStorage.get(key) ?? null,
                setItem: (key: string, value: string) => sessionStorage.set(key, value),
                removeItem: (key: string) => sessionStorage.delete(key),
                clear: () => sessionStorage.clear()
            },
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn()
        }
    } as const;

    beforeEach(() => {
        sessionStorage.clear();
    });

    describe('instance', () => {
        
        it('should throw if window is not defined', () => {
            const init = () => BrowserEventManager.instance(undefined as unknown as Window);
            expect(init).toThrow();
        });

        it('should return an instance of BrowserEventManager', () => {
            const instance = BrowserEventManager.instance(globalThis.window as any);
            expect(instance).toBeInstanceOf(BrowserEventManager);
        });

        it('should return the same instance on subsequent calls', () => {
            const instance1 = BrowserEventManager.instance(globalThis.window as any);
            const instance2 = BrowserEventManager.instance(globalThis.window as any);
            expect(instance1).toBe(instance2);
        });
    });

    describe('subscribe', () => {
        it('should subscribe to an event', () => {
            const instance = BrowserEventManager.instance(globalThis.window as any);
            const unload = jest.spyOn(globalThis.window, 'addEventListener');
            const eventName = 'context2:testEvent';
            const callback = jest.fn();
            instance.subscribe(eventName, callback);

            expect(unload).toHaveBeenCalledTimes(2);
            expect(unload).toHaveBeenLastCalledWith('beforeunload', expect.any(Function));

            expect(globalThis.window.sessionStorage.getItem(`rich-domain-event:${eventName}`)).toBeTruthy();
            expect(instance.exists(eventName)).toBeTruthy();
        });
    });

    describe('removerEvent', () => {
        it('should remove a subscribed event', () => {
            const instance = BrowserEventManager.instance(globalThis.window as any);
            const eventName = 'context:testEvent';
            const callback = jest.fn();
            instance.subscribe(eventName, callback);
            expect(instance.exists(eventName)).toBeTruthy();
            instance.removerEvent(eventName);
            expect(globalThis.window.sessionStorage.getItem(`rich-domain-event:${eventName}`)).toBeFalsy();
            expect(instance.exists(eventName)).toBeFalsy();
        });
    });

    describe('dispatchEvent', () => {
        it('should dispatch an event', () => {
            const instance = BrowserEventManager.instance(globalThis.window as any);
            const eventName = 'context:testEvent';

            const dispatchSpy = jest.spyOn(globalThis.window, 'dispatchEvent');

            instance.subscribe(eventName, () => { });
            instance.dispatchEvent(eventName, { name: 'Jane' });

            expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
                type: 'context:testEvent',
                detail: [{ name: 'Jane' }]
            }));
        });
    });

    it('should dispatch an event with wildcard (*)', () => {
        const instance = BrowserEventManager.instance(globalThis.window as any);
        const eventName1 = 'user:signup';
        const eventName2 = 'user:send-email';
        const eventName3 = 'user:signin';
        const eventName4 = 'account:signin';
        const eventNameWildcard = 'user:*';

        const dispatchSpy = jest.spyOn(globalThis.window, 'dispatchEvent');

        instance.subscribe(eventName1, () => {});
        instance.subscribe(eventName2, () => {});
        instance.subscribe(eventName3, () => {});
        instance.subscribe(eventName4, () => {});

        expect(dispatchSpy).toHaveBeenCalledTimes(0);

        instance.dispatchEvent(eventNameWildcard, { name: 'Jane' });

        expect(dispatchSpy).toHaveBeenCalledTimes(3);
        expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
            type: eventName1,
            detail: [{ name: 'Jane' }]
        }));

        expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
            type: eventName2,
            detail: [{ name: 'Jane' }]
        }));

        expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
            type: eventName3,
            detail: [{ name: 'Jane' }]
        }));

        expect(dispatchSpy).not.toHaveBeenCalledWith(expect.objectContaining({
            type: eventName4,
            detail: [{ name: 'Jane' }]
        }));
    });

    it('should remove event', () => {
        sessionStorage.clear();
        const instance = BrowserEventManager.instance(globalThis.window as any);
        expect(instance).toBeInstanceOf(BrowserEventManager);
        instance.subscribe('test:event', () => {});
        expect(sessionStorage.size).toBe(1);
        
        const removed = instance.removerEvent('test:event');
        expect(removed).toBeTruthy();

        expect(sessionStorage.size).toBe(0);
    });

    it('should do not remove event', () => {
        sessionStorage.clear();
        const instance = BrowserEventManager.instance(globalThis.window as any);
        expect(instance).toBeInstanceOf(BrowserEventManager);
        instance.subscribe('test:event', () => {});
        expect(sessionStorage.size).toBe(1);
        
        const removed = instance.removerEvent('invalid:event');
        expect(removed).toBeFalsy();

        expect(sessionStorage.size).toBe(1);
    });

});
