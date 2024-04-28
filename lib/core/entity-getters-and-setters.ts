import { ICreateManyDomain, IEntityGettersAndSetters, IParentName, ISettings } from "../types";
import util, { Utils } from "../utils/util";
import validator, { Validator } from "../utils/validator";
import createManyDomainInstances from "./create-many-domain-instance";
import ID from "./id";

/**
 * @description defines getter and setter to all domain instances.
 */
export class GettersAndSetters<Props> implements IEntityGettersAndSetters<Props> {
    protected validator: Validator = validator;
    protected static validator: Validator = validator;
    protected util: Utils = util;
    protected static util: Utils = util;
    protected parentName: IParentName = 'ValueObject';

    protected config: ISettings = { disableGetters: false, disableSetters: false };

    constructor(protected props: Props, parentName: IParentName, config?: ISettings) {
        GettersAndSetters.validator = validator;
        GettersAndSetters.util = util;
        this.validator = validator;
        this.util = util;
        this.config.disableGetters = !!config?.disableGetters;
        this.config.disableSetters = !!config?.disableSetters;
        this.parentName = parentName;
    }

    /**
     * @description Create many domain instances
     * @param data Array of options
     * @returns data and result.
     * @summary result: final result of validating each instance
     * @summary data: all created instances as iterator of Result.
     * @callback Class you can use this function to create the args and define types to Props.
     * 
     * @example
     * 
     * const { result, data } = ValueObject.createMany([
     *   Class<AgeProps>(Age, props),
     *   Class<NameProps>(Name, props),
     *   Class<PriceProps>(Price, props)
     * ]);
     * 
     * result.isOk() // true
     * 
     * const age = data.next() as IResult<Age>;
     * const name = data.next() as IResult<Name>;
     * const price = data.next() as IResult<Price>;
     * 
     * age.value().get('value') // 21
     * 
     */
    public static createMany(data: ICreateManyDomain) {
        return createManyDomainInstances(data);
    }

    /**
     * @description Validation used to `set` and `change` methods to validate value before set it.
     * @param _key prop key type
     * @param _value prop value type
     * @returns true if value is valid and false if is invalid.
     * 
     * 
     * @example
     * interface Props { 
     *		value: string;
     *		age: number;
     *	};
     *	
     *	class StringVo extends ValueObject<Props>{
     *		private constructor(props: Props) { super(props) }
     *	
     *		validation<Key extends keyof Props>(value: Props[Key], key: Key): boolean {
     *
     *			const options: IPropsValidation<Props> = {
     *				value: (value: string) => value.length < 15,
     *				age: (value: number) => value > 0
     *			} 
     *	
     *			return options[key](value);
     *		};
     *	
     *		public static create(props: Props): IResult<ValueObject<Props>, string> {
     *			return Result.Ok(new StringVo(props));
     *		}
     *	}
     */
    validation(_value: any, _key?: any): boolean;

    /**
     * @description Validation used to `set` and `change` methods to validate value before set it.
     * @param _key prop key type
     * @param _value prop value type
     * @returns true if value is valid and false if is invalid.
     * 
     * 
     * @example
     * interface Props { 
     *		value: string;
     *		age: number;
     *	};
     *	
     *	class StringVo extends ValueObject<Props>{
     *		private constructor(props: Props) { super(props) }
     *	
     *		validation<Key extends keyof Props>(value: Props[Key], key: Key): boolean {
     *
     *			const options: IPropsValidation<Props> = {
     *				value: (value: string) => value.length < 15,
     *				age: (value: number) => value > 0
     *			} 
     *	
     *			return options[key](value);
     *		};
     *	
     *		public static create(props: Props): IResult<ValueObject<Props>, string> {
     *			return Result.Ok(new StringVo(props));
     *		}
     *	}
     */
    validation(_value: any, _key: any): boolean;

    /**
     * @description Validation used to `set` and `change` methods to validate value before set it.
     * @param _key prop key type
     * @param _value prop value type
     * @returns true if value is valid and false if is invalid.
     * 
     * 
     * @example
     * interface Props { 
     *		value: string;
     *		age: number;
     *	};
     *	
     *	class StringVo extends ValueObject<Props>{
     *		private constructor(props: Props) { super(props) }
     *	
     *		validation<Key extends keyof Props>(value: Props[Key], key: Key): boolean {
     *
     *			const options: IPropsValidation<Props> = {
     *				value: (value: string) => value.length < 15,
     *				age: (value: number) => value > 0
     *			} 
     *	
     *			return options[key](value);
     *		};
     *	
     *		public static create(props: Props): IResult<ValueObject<Props>, string> {
     *			return Result.Ok(new StringVo(props));
     *		}
     *	}
     */
    validation<Key extends keyof Props>(_value: Props[Key], _key: Key): boolean { return true };


    /**
     * 
     * @param key the property you want to set.
     * @returns to function asking the value you want to set.
     */
    set<Key extends keyof Props>(key: Key) {
        return {
            /**
             * @description The value is only applied if pass on validation.
             * @param value the value you want to apply.
             * @param validation function to validate the value before apply. The value will be applied only if to pass on validation.
             * @example 
             * (value: PropValue) => boolean;
             * @returns returns "true" if the value has changed and returns "false" if the value has not changed.
             */
            to: (value: Props[Key], validation?: (value: Props[Key]) => boolean): boolean => {
                const instance = Reflect.getPrototypeOf(this);
                if (this.config.disableSetters) {
                    throw new Error(`Trying to set value: "${value}" for key: "${String(key)}" but, %c the setters are deactivated on ${instance?.constructor.name}`);
                };
                if (typeof validation === 'function') {
                    if (!validation(value)) {
                        throw new Error(`Trying to set value: "${value}" for key: "${String(key)}" but validation fails on ${instance?.constructor.name}`);
                    };
                }

                const canUpdate = this.validation(value, key);
                if (!canUpdate) {
                    throw new Error(`Trying to set value: "${value}" for key: "${String(key)}" but validation fails on ${instance?.constructor.name}`);
                }

                if (key === 'id' && this.parentName === 'Entity') {
                    if (this.validator.isString(value) || this.validator.isNumber(value)) {
                        this['_id'] = ID.create(value);
                        this['props']['id'] = this['_id'].value();
                        if (this.parentName === 'Entity') {
                            this['props'] = Object.assign({}, { ...this['props'] }, { updatedAt: new Date() });
                        }
                        return true;
                    }
                    if (this.validator.isID(value)) {
                        this['_id'] = value as unknown as ID<string>;
                        this['props']['id'] = this['_id'].value();
                        if (this.parentName === 'Entity') {
                            this['props'] = Object.assign({}, { ...this['props'] }, { updatedAt: new Date() });
                        }
                        return true;
                    }
                }
                this.props[key] = value;
                if (this.parentName === 'Entity') {
                    this['props'] = Object.assign({}, { ...this['props'] }, { updatedAt: new Date() });
                }
                return true;
            }
        }
    }
    /**
     * 
     * @param key the property you want to set.
     * @param value the value to apply to the key.
     * @param validation function to validate the value before apply. The value will be applied only if to pass.
     * @returns returns "true" if the value has changed and returns "false" if the value has not changed.
     */
    change<Key extends keyof Props>(key: Key, value: Props[Key], validation?: (value: Props[Key]) => boolean): boolean {
        const instance = Reflect.getPrototypeOf(this);
        if (this.config.disableSetters) {
            throw new Error(`Trying to set value: "${value}" for key: "${String(key)}" but the setters are deactivated on ${instance?.constructor.name}`);
        };

        if (typeof validation === 'function') {
            if (!validation(value)) {
                throw new Error(`Trying to set value: "${value}" for key: "${String(key)}" but validation fails on ${instance?.constructor.name}`);
            };
        }
        const canUpdate = this.validation(value, key);
        if (!canUpdate) {
            throw new Error(`Trying to set value: "${value}" for key: "${String(key)}" but validation fails on ${instance?.constructor.name}`);
        }
        if (key === 'id' && this.parentName === 'Entity') {
            if (this.validator.isString(value) || this.validator.isNumber(value)) {
                this['_id'] = ID.create(value);
                this['props']['id'] = this['_id'].value();
                if (this.parentName === 'Entity') {
                    this['props'] = Object.assign({}, { ...this['props'] }, { updatedAt: new Date() });
                }
                return true;
            }
            if (this.validator.isID(value)) {
                this['_id'] = value as unknown as ID<string>;
                this['props']['id'] = this['_id'].value();
                if (this.parentName === 'Entity') {
                    this['props'] = Object.assign({}, { ...this['props'] }, { updatedAt: new Date() });
                }
                return true;
            }
        }
        this.props[key] = value;
        if (this.parentName === 'Entity') {
            this['props'] = Object.assign({}, { ...this['props'] }, { updatedAt: new Date() });
        }
        return true;
    }

    /**
     * 
     * @param key the property key you want to get
     * @returns the value of property
     */
    get<Key extends keyof Props>(key: Key): Readonly<Props[Key]> {
        if (this.config.disableGetters) {
            const instance = Reflect.getPrototypeOf(this);
            throw new Error(`Trying to get key: "${String(key)}" but the getters are deactivated on ${instance?.constructor.name}`);
        };
        if (typeof this.props === 'object') {
            return this.props?.[key as Key] ?? null as any;
        }
        return this.props as any;
    }

    getRaw(): Readonly<Props> {
        return Object.freeze(this.props);
    }
}

export default GettersAndSetters;
