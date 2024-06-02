import { Adapter, AutoMapperSerializer, IAdapter, IResult, IValueObject, IVoSettings, UID } from "../types";
import { ReadonlyDeep } from "../types-util";
import { deepFreeze } from "../utils/deep-freeze.util";
import AutoMapper from "./auto-mapper";
import BaseGettersAndSetters from "./base-getters-and-setters";
import Result from "./result";

/**
 * @description ValueObject an attribute for entity and aggregate
 */
export class ValueObject<Props> extends BaseGettersAndSetters<Props> implements IValueObject<Props> {
	protected autoMapper: AutoMapper<Props>;
	constructor(props: Props, config?: IVoSettings) {
		super(props, config);
		this.autoMapper = new AutoMapper();
	}

	/** 
	 * @description Check if value object instance props is equal another provided instance props.
	 * @param createdAt is not considered on compare
	 * @param updatedAt is not considered on compare
	 * @returns true if props is equal and false if not.
	*/
	isEqual(other: this): boolean {
		const props = this.props;
		const otherProps = other?.props;

		const stringifyAndOmit = (obj: any): string => {
			if (!obj) return '';
			const { createdAt, updatedAt, ...cleanedProps } = obj;
			return JSON.stringify(cleanedProps);
		};

		if (this.validator.isString(props)) {
			return this.validator.string(props as string).isEqual(otherProps as string);
		}

		if (this.validator.isDate(props)) {
			return (props as Date).getTime() === (otherProps as Date)?.getTime();
		}

		if (this.validator.isArray(props) || this.validator.isFunction(props)) {
			return JSON.stringify(props) === JSON.stringify(otherProps);
		}

		if (this.validator.isBoolean(props)) {
			return props === otherProps;
		}

		if (this.validator.isID(props)) {
			return (props as UID).value() === (otherProps as UID)?.value();
		}

		if (this.validator.isNumber(props) || typeof props === 'bigint') {
			return this.validator.number(props as number).isEqualTo(otherProps as number);
		}

		if (this.validator.isUndefined(props) || this.validator.isNull(props)) {
			return props === otherProps;
		}

		if (this.validator.isSymbol(props)) {
			return (props as Symbol).description === (otherProps as Symbol)?.description;
		}

		return stringifyAndOmit(props) === stringifyAndOmit(otherProps);
	}

	/**
	 * @description Get an instance copy.
	 * @returns a new instance of value object.
	 */
	clone(props?: Props extends object ? Partial<Props> : never): this {
		const instance = Reflect.getPrototypeOf(this);
		if (typeof this.props === 'object' && !(this.props instanceof Date) && !(Array.isArray(this.props))) {
			const _props = props ? { ...this.props, ...props } : { ...this.props };
			const args = [_props, this.config];
			return Reflect.construct(instance!.constructor, args);
		}
		const args = [this.props, this.config];
		return Reflect.construct(instance!.constructor, args);
	}

	/**
	 * @description Get value from value object.
	 * @returns value as string, number or any type defined.
	 */
	toObject<T>(adapter?: Adapter<this, T> | IAdapter<this, T>)
		: T extends {}
		? T
		: ReadonlyDeep<AutoMapperSerializer<Props>> {
		if (adapter && typeof (adapter as Adapter<this, T>)?.adaptOne === 'function') {
			return (adapter as Adapter<this, T>).adaptOne(this) as any;
		}
		if (adapter && typeof (adapter as IAdapter<this, T>)?.build === 'function') {
			return (adapter as IAdapter<this, T>).build(this).value() as any;
		}
		const serializedObject = this.autoMapper.valueObjectToObj(this) as ReadonlyDeep<AutoMapperSerializer<Props>>;
		const frozenObject = deepFreeze<any>(serializedObject);
		return frozenObject;
	}

	/**
	 * @description Method to validate value.
	 * @param value to validate
	 * @returns boolean
	 */
	public static isValid(value: any): boolean {
		return this.isValidProps(value);
	};

	/**
	 * @description Method to validate prop value.
	 * @param props to validate
	 */
	public static isValidProps(props: any): boolean {
		return !this.validator.isUndefined(props) && !this.validator.isNull(props);
	};

	/**
	 * @description method to create a new instance
	 * @param value as props
	 * @returns instance of Value Object or throw an error.
	 */
	public static init(value: any): any {
		throw new Error('method not implemented: init', {
			cause: value
		});
	};

	public static create(props: any): IResult<any, any, any>;
	/**
	 * 
	 * @param props params as Props
	 * @returns instance of result with a new Value Object on state if success.
	 * @summary result state will be `null` case failure.
	 */
	public static create(props: {}): Result<any, any, any> {
		if (!this.isValidProps(props)) return Result.fail('Invalid props to create an instance of ' + this.name);
		return Result.Ok(new this(props));
	};
}

export default ValueObject;
