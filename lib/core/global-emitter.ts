import { EventEmitter } from "node:events";

/** NOT COMPATIBLE WITH BROWSER - @todo FIX THAT */
export abstract class Context {
    private static _instance: EventEmitter;
    static instance(): EventEmitter {
        if(Context._instance) return Context._instance;
        Context._instance = new EventEmitter({ captureRejections: true });
        return Context._instance;
    }
}

export default Context;