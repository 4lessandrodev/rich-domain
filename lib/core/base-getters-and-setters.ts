import { ICreateManyDomain, IBaseGettersAndSetters, ISettings, UID } from "../types";
import util, { Utils } from "../utils/util";
import validator, { Validator } from "../utils/validator";
import createManyDomainInstances from "./create-many-domain-instance";

/**
 * @description defines getter and setter to all domain instances.
 */
export class BaseGettersAndSetters<Props> implements IBaseGettersAndSetters<Props> {
    protected validator: Validator = validator;
    protected static validator: Validator = validator;
    protected util: Utils = util;
    protected static util: Utils = util;

    protected config: ISettings = { disableGetters: false, disableSetters: false };

    constructor(protected props: Props, config?: ISettings) {
        BaseGettersAndSetters.validator = validator;
        BaseGettersAndSetters.util = util;
        this.validator = validator;
        this.util = util;
        this.config.disableGetters = !!config?.disableGetters;
        this.config.disableSetters = !!config?.disableSetters;
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
     * @param key the property key you want to get
     * @returns the value of property
     */
    get<Key extends keyof Props>(key: Props extends object ? (Props extends { [k in Key]: Date } ? Key : 'value') : 'value'): Readonly<Props extends { [k in keyof Props]: Props[k] } ? Readonly<Props[Key]> : Readonly<Props>> {
        if (this.config.disableGetters) {
            const instance = Reflect.getPrototypeOf(this);
            throw new Error(`Trying to get key: "${String(key)}" but the getters are deactivated on ${instance?.constructor.name}`);
        };
        if (this.validator.isDate(this.props) || this.validator.isArray(this.props)) {
            return this.props as any;
        }
        if (key === 'value') {
            const isSimpleValue = this.validator.isBoolean(this.props) ||
                this.validator.isNumber(this.props) ||
                this.validator.isString(this.props)

            if (isSimpleValue) return this.props as any;

            const isID = this.validator.isID(this.props);

            if (isID) return (this.props as unknown as UID)?.value() as any;
        }
        return this.props?.[key as Key] ?? null as any;
    }

    getRaw(): Readonly<Props> {
        if (typeof this.props !== 'object' || !Array.isArray(this.props)) {
            return this.props;
        }
        return Object.freeze(this.props);
    }

}

export default BaseGettersAndSetters;
