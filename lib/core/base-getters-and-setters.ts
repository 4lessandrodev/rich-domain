import { CreateManyDomain, _BaseGettersAndSetters, Settings, UID, _VoSettings } from "../types";
import { BuiltIns } from "../types-util";
import util, { Utils } from "../utils/util";
import validator, { Validator } from "../utils/validator";
import createManyDomainInstances from "./create-many-domain-instance";

/**
 * @description The BaseGettersAndSetters class provides foundational getter and setter functionality 
 * for domain objects. It offers optional configuration to disable getters, which can be useful 
 * in scenarios where direct property access needs to be restricted. Additionally, it provides a utility 
 * method for creating multiple domain instances at once (`createMany`).
 */
export class BaseGettersAndSetters<Props> implements _BaseGettersAndSetters<Props> {
    protected validator: Validator = validator;
    protected static validator: Validator = validator;
    protected util: Utils = util;
    protected static util: Utils = util;

    protected config: Settings = { disableGetters: false, disableSetters: false };

    constructor(protected props: Props, config?: _VoSettings) {
        BaseGettersAndSetters.validator = validator;
        BaseGettersAndSetters.util = util;
        this.validator = validator;
        this.util = util;
        this.config.disableGetters = !!config?.disableGetters;
    }

    /**
     * @description Creates multiple domain instances from the given array of domain construction instructions.
     * Each element in the array should specify a class constructor and the props needed to create that instance.
     * @param data An array of options that specify how to create each domain instance.
     * @returns An object containing:
     *  - `result`: A combined result indicating overall success or failure of creating all instances.
     *  - `data`: An iterator over the individual creation results for each domain instance.
     * 
     * @summary `createMany` simplifies the batch creation of various domain instances, allowing you to validate 
     * each one and handle them collectively or individually.
     * 
     * @example
     * ```typescript
     * const { result, data } = ValueObject.createMany([
     *   Class<AgeProps>(Age, props),
     *   Class<NameProps>(Name, props),
     *   Class<PriceProps>(Price, props)
     * ]);
     * 
     * if (result.isOk()) {
     *   const age = data.next().value;
     *   const name = data.next().value;
     *   const price = data.next().value;
     * 
     *   console.log(age.value().get('value')); // e.g. 21
     * } else {
     *   console.error("Failed to create some domain instances.");
     * }
     * ```
     */
    public static createMany(data: CreateManyDomain) {
        return createManyDomainInstances(data);
    }

    /**
     * @description Retrieves the value of a specific property key from the domain object's properties.
     * If `disableGetters` is true, attempting to get a property will throw an error.
     * 
     * @param key The property key to retrieve. For simple value objects (like strings, numbers, etc.), 
     * you can use the `'value'` key to get the raw value.
     * 
     * @returns The value of the specified property. For complex objects, returns a read-only view of the property.
     * For simple value objects (e.g., primitives, symbols, arrays, dates), returns the direct value.
     * 
     * @throws Will throw an error if getters are disabled.
     */
    get<Key extends keyof Props>(
        key: Props extends BuiltIns ?
            'value' :
            Props extends Symbol ?
            'value' :
            Props extends any[] ?
            'value' :
            Key
    ): Props extends BuiltIns ?
        Props :
        Props extends Symbol ?
        string :
        Props extends any[] ?
        Readonly<Props> :
        Props extends {} ?
        Readonly<Props[Key]> : Props {
        if (this.config.disableGetters) {
            const instance = Reflect.getPrototypeOf(this);
            throw new Error(`Attempted to get key "${String(key)}" but getters are disabled on ${instance?.constructor.name}.`);
        }

        // For certain simple value props (Date, Array), return directly
        if (this.validator.isDate(this.props) || this.validator.isArray(this.props)) {
            return this.props as any;
        }

        // If the requested key is 'value', return the simplest possible representation
        if (key === 'value') {
            const isSimpleValue = this.validator.isBoolean(this.props) ||
                this.validator.isNumber(this.props) ||
                this.validator.isString(this.props);

            if (this.validator.isSymbol(this.props)) {
                return (this.props as Symbol).description as any;
            }

            if (isSimpleValue) return this.props as any;

            const isID = this.validator.isID(this.props);
            if (isID) return (this.props as unknown as UID)?.value() as any;
        }

        // For complex objects, retrieve the property if it exists, or null if not found
        return this.props?.[key as Key] ?? null as any;
    }

    /**
     * @description Returns the raw properties of the domain object. 
     * If the properties are an object or array, a frozen (immutable) version is returned.
     * 
     * @returns A read-only version of the domain properties. For objects and arrays, returns a frozen copy.
     */
    getRaw(): Readonly<Props> {
        if (typeof this.props !== 'object' || !Array.isArray(this.props) || this.props instanceof Date) {
            return this.props;
        }
        return Object.freeze(this.props);
    }
}

export default BaseGettersAndSetters;
