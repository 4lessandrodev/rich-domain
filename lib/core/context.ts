import platform from "../utils/platform.util";
import BrowserEventManager from "./browser-event-manager";
import { EventManager } from "../types";
import ServerEventManager from "./server-event-manager";

/**
 * @description The Context class provides a platform-aware mechanism for 
 * retrieving a global event manager instance. Depending on the environment 
 * (Node.js or browser), it initializes and returns an appropriate event manager.
 */
export abstract class Context {
    private static eventManager: EventManager;

    /**
     * @description Retrieves the global event manager instance for the current platform. 
     * If one does not already exist, it is created based on the detected runtime environment.
     * - In Node.js environments, it uses `ServerEventManager`.
     * - In browser environments, it uses `BrowserEventManager`.
     * 
     * @throws Will throw an error if the platform cannot be determined.
     * @returns The platform-specific `EventManager` instance.
     */
    static events(): EventManager {
        if (Context.eventManager) return Context.eventManager;

        if (platform.isNodeJs(global?.process)) {
            Context.eventManager = ServerEventManager.instance();
        } else if (platform.isBrowser(globalThis?.window)) {
            Context.eventManager = BrowserEventManager.instance(globalThis.window);
        } else {
            throw new Error('Could not determine the platform to initialize the event manager.');
        }

        return Context.eventManager;
    }
}

export default Context;
