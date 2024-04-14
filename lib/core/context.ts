import platform from "../utils/platform.util";
import BrowserEventManager from "./browser-event-manager";
import { EventManager } from "../types";
import ServerEventManager from "./server-event-manager";

export abstract class Context {
    private static eventManager: EventManager;
    static events(): EventManager {
        if (Context.eventManager) return Context.eventManager;
        if (platform.isNodeJs(global?.process)) {
            Context.eventManager = ServerEventManager.instance();
        } else if (platform.isBrowser(globalThis?.window)) {
            Context.eventManager = BrowserEventManager.instance(globalThis.window);
        } else {
            throw new Error('Could not define platform');
        }
        return Context.eventManager;
    }
}

export default Context;
