const { stringify: $stringify } = JSON;
const { keys } = Object;

const Primitive = String;   // Could also be Number
const primitive = 'string'; // Could also be 'number'

const ignore = {};
const object = 'object';

const noop = (_, value) => value;

/**
 * @description Revives an object from a parsed structure, restoring references and nested objects.
 * 
 * @param input The input object containing references to the original structure.
 * @param parsed A set-like object to track parsed elements, avoiding circular references.
 * @param output The output object where the revived structure is stored.
 * @param $ A function to handle value transformation during revival.
 * 
 * @returns The revived object with restored references.
 */
const revive = (
    input: { [x: string]: any; },
    parsed: { has: (arg0: any) => any; add: (arg0: any) => void; },
    output: { [x: string]: any; },
    $: { call: (arg0: any, arg1: string, arg2: any) => any; }
) => {
    const lazy: any[] = [];
    for (let ke = keys(output), { length } = ke, y = 0; y < length; y++) {
        const k = ke[y];
        const value = output[k];
        if (value instanceof Primitive) {
            const tmp = input[value as string];
            if (typeof tmp === object && !parsed.has(tmp)) {
                parsed.add(tmp);
                output[k] = ignore;
                lazy.push({ k, a: [input, parsed, tmp, $] });
            } else {
                output[k] = $.call(output, k, tmp);
            }
        } else if (output[k] !== ignore) {
            output[k] = $.call(output, k, value);
        }
    }
    for (let { length } = lazy, i = 0; i < length; i++) {
        const { k, a } = lazy[i];
        output[k] = $.call(output, k, revive.apply(null, a));
    }
    return output;
};

/**
 * @description Adds a value to a known set and returns its index as a stringified primitive.
 * 
 * @param known A Map of known values and their indexes.
 * @param input The array of input values to which the new value is added.
 * @param value The value to add to the known set.
 * 
 * @returns The index of the value in the input array as a string.
 */
const set = (known: Map<any, string>, input: any[], value: any): string => {
    const index = Primitive(input.push(value) - 1);
    known.set(value, index);
    return index;
};

/**
 * @description Converts a JavaScript value into a specialized flatted string. This method serializes 
 * complex objects, including circular references, into a flat structure.
 * 
 * @param value The JavaScript value to be stringified.
 * 
 * @returns A flatted string representation of the value.
 * 
 * @example
 * ```typescript
 * const obj = { a: 1 };
 * obj.self = obj;
 * const result = stringify(obj);
 * console.log(result); // Outputs a flatted string representing the object with circular references.
 * ```
 * 
 * @note This method is not intended for general serialization and should not be used for long-term storage.
 * @todo Test implementation with various scenarios, including deeply nested and circular structures.
 */
export const stringify = (value: any): string => {
    const $ = noop;
    const known = new Map();
    const input = [];
    const output: string[] = [];
    let i = +set(known, input, $.call({ '': value }, '', value));
    let firstRun = !i;
    while (i < input.length) {
        firstRun = true;
        output[i] = $stringify(input[i++], replace);
    }
    return '[' + output.join(',') + ']';

    /**
     * @description Handles the replacement logic for the `JSON.stringify` process, managing references and known values.
     * 
     * @param this The context object.
     * @param key The key of the current property being stringified.
     * @param value The value of the current property being stringified.
     * 
     * @returns The processed value for the current property.
     */
    function replace(this: any, key: any, value: any) {
        if (firstRun) {
            firstRun = !firstRun;
            return value;
        }
        const after = $.call(this, key, value);
        switch (typeof after) {
            case object:
                if (after === null) return after;
            case primitive:
                return known.get(after) || set(known, input, after);
        }
        return after;
    }
};
