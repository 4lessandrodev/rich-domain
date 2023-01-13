import { IAdapter, IResult, ISettings, IValueObject } from "../types";
import AutoMapper from "./auto-mapper";
import GettersAndSetters from "./getters-and-setters";
import Result from "./result";

/**
 * @description ValueObject an attribute for entity and aggregate
 */
export class ValueObject<Props> extends GettersAndSetters<Props> implements IValueObject<Props> {
	protected autoMapper: AutoMapper<Props>;
	constructor(props: Props, config?: ISettings) {
		super(props, 'ValueObject', config);
		this.autoMapper = new AutoMapper();
	}

	/** 
	 * @description Check if value object instance props is equal another provided instance props.
	 * @param createdAt is not considered on comparation
	 * @param updatedAt is not considered on comparation
	 * @returns true if props is equal and false if not.
	*/
	isEqual(other: ValueObject<Props>): boolean {
		const currentProps = Object.assign({}, {}, { ...this.props});
		const providedProps = Object.assign({}, {}, { ...other.props});
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
	clone(): IResult<ValueObject<Props>> {
		const instance = Reflect.getPrototypeOf(this);
		if (!instance) return Result.fail('Could not get value object instance');
		const args = [this.props, this.config];
		const obj = Reflect.construct(instance.constructor, args);
		if (obj instanceof ValueObject) return Result.Ok(obj);
		return Result.fail('Could not create instance of value object');
	}

	/**
	 * @description Get value from value object.
	 * @returns value as string, number or any type defined.
	 */
	toObject<T>(adapter? :IAdapter<this, T>): T {
		if (adapter && typeof adapter?.build === 'function') return adapter.build(this).value();
		return this.autoMapper.valueObjectToObj(this) as unknown as T;
	}

	/** 
	 * @description use immutable value object.
	 * @deprecated do not use `set` function to change `value-object` state. 
	 * @access create a new instance instead
	 * @method `set` function will be removed for `value-objects` in future version.
	 */
	set<Key extends keyof Props>(key: Key): { 
		to: (value: Props[Key], validation?: ((value: Props[Key]) => boolean) | undefined) => GettersAndSetters<Props>; 
	} {
		return super.set(key);
	}

	/** 
	 * @description use immutable value object.
	 * @deprecated do not use change function to modify `value-object` state.
	 * @access create a new instance instead
	 * @method `change` function will be removed for `value-objects` in future version.
	 */
	change<Key extends keyof Props>(key: Key, value: Props[Key], validation?: ((value: Props[Key]) => boolean) | undefined): this {
		return super.change(key, value, validation);
	}

	/**
	 * @description Method to validate prop value.
	 * @param props to validate
	 */
	public static isValidProps(props: any): boolean {
		return !this.validator.isUndefined(props) && !this.validator.isNull(props);
	};

	/**
	 * 
	 * @param props params as Props
	 * @returns instance of result with a new Value Object on state if success.
	 * @summary result state will be `null` case failure.
	 */
	public static create(props: any): IResult<ValueObject<any>, any, any> {
		if (!this.isValidProps(props)) return Result.fail('Invalid props to create an instance of ' + this.name);
		return Result.Ok(new this(props));
	};
}

export default ValueObject;
