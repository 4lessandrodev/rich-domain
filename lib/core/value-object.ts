import { AutoMapperSerializer, IAdapter, IResult, IValueObject, IVoSettings } from "../types";
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
		const currentProps = Object.assign({}, {}, { ...this?.props});
		const providedProps = Object.assign({}, {}, { ...other?.props});
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
	clone(props?: Partial<Props>): ValueObject<Props> {
		const _props = props ? { ...this.props, ...props } : { ...this.props };
		const instance = Reflect.getPrototypeOf(this);
		const args = [_props, this.config];
		const obj = Reflect.construct(instance!.constructor, args);
		return obj;
	}

	/**
	 * @description Get value from value object.
	 * @returns value as string, number or any type defined.
	 */
	toObject<T>(adapter? :IAdapter<this, T>)
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
