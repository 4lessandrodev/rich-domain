/**
 * @description Utility object to detect the runtime environment. It provides methods to determine 
 * whether the current platform is Node.js or a browser environment.
 */
export const platform = {
    /**
     * @description Checks if the runtime environment is Node.js.
     * 
     * @param process The global `process` object, typically available in Node.js environments.
     * 
     * @returns `true` if the `process` object is defined, indicating a Node.js environment; otherwise, `false`.
     * 
     * @example
     * ```typescript
     * const isNode = platform.isNodeJs(global.process);
     * console.log(isNode); // true (if running in Node.js)
     * ```
     */
    isNodeJs: (process: any): boolean => typeof process !== 'undefined',

    /**
     * @description Checks if the runtime environment is a browser.
     * 
     * @param window The global `window` object, typically available in browser environments.
     * 
     * @returns `true` if the `window` object is defined, indicating a browser environment; otherwise, `false`.
     * 
     * @example
     * ```typescript
     * const isBrowser = platform.isBrowser(globalThis.window);
     * console.log(isBrowser); // true (if running in a browser)
     * ```
     */
    isBrowser: (window: any): boolean => typeof window !== 'undefined',
}

export default platform;
