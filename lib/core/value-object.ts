import { AutoMapperSerializer, IAdapter, IResult, IValueObject, IVoSettings, UID } from "../types";
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
		if (this.validator.isString(props)) return this.validator.string(props as string).isEqual(other.props as string);
		if (this.validator.isDate(props)) return (props as Date).getTime() === (other.props as Date)?.getTime();
		if (this.validator.isArray(props) || typeof props === 'function') return JSON.stringify(props) === JSON.stringify(other.props);
		if (this.validator.isBoolean(props)) return props === other.props;
		if (this.validator.isID(props)) return (props as UID).value() === (other.props as UID)?.value();
		if (this.validator.isNumber(props) || typeof props === 'bigint') return this.validator.number(props as number).isEqualTo(other.props as number);
		if (this.validator.isUndefined(props) || this.validator.isNull(props)) return props === other.props;
		if (this.validator.isSymbol(props)) return (props as Symbol).description === (other.props as Symbol)?.description;
		const currentProps = Object.assign({}, {}, { ...this?.props });
		const providedProps = Object.assign({}, {}, { ...other?.props });
		delete currentProps?.['createdAt'];
		delete currentProps?.['updatedAt'];
		delete providedProps?.['createdAt'];
		delete providedProps?.['updatedAt'];
		return JSON.stringify(currentProps) === JSON.stringify(providedProps);
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
	toObject<T>(adapter?: IAdapter<this, T>)
		: T extends {}
		? T
		: ReadonlyDeep<AutoMapperSerializer<Props>> {
		if (adapter && typeof adapter?.build === 'function') return adapter.build(this).value() as any
		const serializedObject = this.autoMapper.valueObjectToObj(this) as ReadonlyDeep<AutoMapperSerializer<Props>>;
		const frozenObject = deepFreeze<any>(serializedObject);
		return frozenObject;
	}

	/**
	 * @description Method to validate prop value.
	 * @param props to validate
	 */
	public static isValidProps(props: any): boolean {
		return !this.validator.isUndefined(props) && !this.validator.isNull(props);
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
