import { CreateManyDomain, _EntityGettersAndSetters, IParentName, Settings } from "../types";
import util, { Utils } from "../utils/util";
import validator, { Validator } from "../utils/validator";
import createManyDomainInstances from "./create-many-domain-instance";
import ID from "./id";

/**
 * @description GettersAndSetters provides a foundational mechanism for retrieving and updating properties
 * of domain objects (like Entities or Value Objects). It enables property validation and gives control 
 * over whether getters or setters are active. When integrated with Entities or Value Objects, this class 
 * ensures that changes to domain properties follow defined validation rules.
 */
export class GettersAndSetters<Props> implements _EntityGettersAndSetters<Props> {
    protected validator: Validator = validator;
    protected static validator: Validator = validator;
    protected util: Utils = util;
    protected static util: Utils = util;
    protected parentName: IParentName = 'ValueObject';

    protected config: Settings = { disableGetters: false, disableSetters: false };

    constructor(protected props: Props, parentName: IParentName, config?: Settings) {
        GettersAndSetters.validator = validator;
        GettersAndSetters.util = util;
        this.validator = validator;
        this.util = util;
        this.config.disableGetters = !!config?.disableGetters;
        this.config.disableSetters = !!config?.disableSetters;
        this.parentName = parentName;
    }

    /**
     * @description Creates multiple domain instances at once.
     * 
     * @param data An array of options that includes class constructors and properties.
     * @returns An object containing:
     *  - `result`: A combined result indicating overall success or failure.
     *  - `data`: An iterator of Result objects, each for an attempted instance creation.
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
     *   const ageResult = data.next().value;
     *   const nameResult = data.next().value;
     *   const priceResult = data.next().value;
     *   
     *   console.log(ageResult.value().get('value')); // e.g. 21
     * }
     * ```
     */
    public static createMany(data: CreateManyDomain) {
        return createManyDomainInstances(data);
    }

    /**
     * @description Validates the value before setting or changing a property.
     * Subclasses can override this method to implement custom validation rules.
     * 
     * @param _value The property value to validate.
     * @param _key The property key.
     * @returns `true` if the value is considered valid; `false` otherwise.
     * 
     * @example
     * ```typescript
     * interface Props { 
     *   value: string;
     *   age: number;
     * }
     * 
     * class StringVo extends ValueObject<Props> {
     *   private constructor(props: Props) { super(props) }
     *   
     *   validation<Key extends keyof Props>(value: Props[Key], key: Key): boolean {
     *     const options = {
     *       value: (val: string) => val.length < 15,
     *       age:   (val: number) => val > 0
     *     }
     *     return options[key](value);
     *   }
     * 
     *   public static create(props: Props): IResult<ValueObject<Props>, string> {
     *     return Result.Ok(new StringVo(props));
     *   }
     * }
     * ```
     */
    validation(_value: any, _key?: any): boolean;
    validation(_value: any, _key: any): boolean;
    validation<Key extends keyof Props>(_value: Props[Key], _key: Key): boolean { 
        return true; 
    }

    /**
     * @description Sets a property value after validating it. Returns a chained method 
     * (`to`) that accepts the new value and an optional validation function.
     * 
     * @param key The property key to set.
     * @returns An object with a `to` function to finalize the property assignment.
     * 
     * @example
     * ```typescript
     * entity.set('age').to(30, (age) => age > 0);
     * ```
     */
    set<Key extends keyof Props>(key: Key) {
        return {
            /**
             * @description Assigns the provided value to the specified property if it passes both
             * the optional provided validation function and the class's `validation` method.
             * 
             * @param value The value to assign to the property.
             * @param validation An optional validation function that returns `true` if the value is valid.
             * @returns `true` if the value was successfully assigned, otherwise throws an error.
             * 
             * @example
             * ```typescript
             * entity.set('name').to('Alice', (value) => value.length > 0);
             * ```
             */
            to: (value: Props[Key], validation?: (value: Props[Key]) => boolean): boolean => {
                const instance = Reflect.getPrototypeOf(this);

                if (this.config.disableSetters) {
                    throw new Error(`Attempted to set value "${value}" for key "${String(key)}" but setters are disabled on ${instance?.constructor.name}.`);
                }

                if (typeof validation === 'function' && !validation(value)) {
                    throw new Error(`Validation failed for value "${value}" on key "${String(key)}" in ${instance?.constructor.name}.`);
                }

                if (!this.validation(value, key)) {
                    throw new Error(`Validation failed for value "${value}" on key "${String(key)}" in ${instance?.constructor.name}.`);
                }

                // Special handling for ID on Entities
                if (key === 'id' && this.parentName === 'Entity') {
                    if (this.validator.isString(value) || this.validator.isNumber(value)) {
                        this['_id'] = ID.create(value);
                        this['props']['id'] = this['_id'].value();
                        if (this.parentName === 'Entity') {
                            this['props'] = { ...this['props'], updatedAt: new Date() };
                        }
                        return true;
                    }
                    if (this.validator.isID(value)) {
                        this['_id'] = value as unknown as ID<string>;
                        this['props']['id'] = this['_id'].value();
                        if (this.parentName === 'Entity') {
                            this['props'] = { ...this['props'], updatedAt: new Date() };
                        }
                        return true;
                    }
                }

                this.props[key] = value;
                if (this.parentName === 'Entity') {
                    this['props'] = { ...this['props'], updatedAt: new Date() };
                }
                return true;
            }
        }
    }

    /**
     * @description Changes the value of a specified property directly (without the chained approach).
     * Validates the value using both the provided validation function (if any) and the class's `validation` method.
     * 
     * @param key The property key to change.
     * @param value The new value for the property.
     * @param validation An optional validation function that returns `true` if the value is valid.
     * @returns `true` if the value was successfully changed, otherwise throws an error.
     * 
     * @example
     * ```typescript
     * entity.change('age', 25, (age) => age > 0);
     * ```
     */
    change<Key extends keyof Props>(key: Key, value: Props[Key], validation?: (value: Props[Key]) => boolean): boolean {
        const instance = Reflect.getPrototypeOf(this);

        if (this.config.disableSetters) {
            throw new Error(`Attempted to set value "${value}" for key "${String(key)}" but setters are disabled on ${instance?.constructor.name}.`);
        }

        if (typeof validation === 'function' && !validation(value)) {
            throw new Error(`Validation failed for value "${value}" on key "${String(key)}" in ${instance?.constructor.name}.`);
        }

        if (!this.validation(value, key)) {
            throw new Error(`Validation failed for value "${value}" on key "${String(key)}" in ${instance?.constructor.name}.`);
        }

        // Special handling for ID on Entities
        if (key === 'id' && this.parentName === 'Entity') {
            if (this.validator.isString(value) || this.validator.isNumber(value)) {
                this['_id'] = ID.create(value);
                this['props']['id'] = this['_id'].value();
                if (this.parentName === 'Entity') {
                    this['props'] = { ...this['props'], updatedAt: new Date() };
                }
                return true;
            }
            if (this.validator.isID(value)) {
                this['_id'] = value as unknown as ID<string>;
                this['props']['id'] = this['_id'].value();
                if (this.parentName === 'Entity') {
                    this['props'] = { ...this['props'], updatedAt: new Date() };
                }
                return true;
            }
        }

        this.props[key] = value;
        if (this.parentName === 'Entity') {
            this['props'] = { ...this['props'], updatedAt: new Date() };
        }
        return true;
    }

    /**
     * @description Retrieves the value of a specified property.
     * 
     * @param key The property key to retrieve.
     * @returns The property's value as a read-only value.
     * 
     * @throws Will throw an error if getters are disabled.
     * 
     * @example
     * ```typescript
     * const age = entity.get('age');
     * console.log(age); // e.g. 30
     * ```
     */
    get<Key extends keyof Props>(key: Key): Readonly<Props[Key]> {
        if (this.config.disableGetters) {
            const instance = Reflect.getPrototypeOf(this);
            throw new Error(`Attempted to get key "${String(key)}" but getters are disabled on ${instance?.constructor.name}.`);
        }
        if (typeof this.props === 'object') {
            return this.props?.[key] ?? null as any;
        }
        return this.props as any;
    }

    /**
     * @description Returns the raw (immutable) properties object of the domain instance.
     * 
     * @returns A frozen, read-only view of the properties.
     * 
     * @example
     * ```typescript
     * const raw = entity.getRaw();
     * console.log(raw); // returns a frozen object with all properties
     * ```
     */
    getRaw(): Readonly<Props> {
        return Object.freeze(this.props);
    }
}

export default GettersAndSetters;
