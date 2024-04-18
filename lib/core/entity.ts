import { AutoMapperSerializer, EntityMapperPayload, EntityProps, IAdapter, IEntity, IResult, ISettings, UID } from "../types";
import { ReadonlyDeep } from "../types-util";
import { deepFreeze } from "../utils/deep-freeze.util";
import AutoMapper from "./auto-mapper";
import GettersAndSetters from "./getters-and-setters";
import ID from "./id";
import Result from "./result";

/**
 * @description Entity identified by an id
 */
export class Entity<Props extends EntityProps> extends GettersAndSetters<Props> implements IEntity<Props> {
	protected _id: UID<string>;
	protected autoMapper: AutoMapper<Props>;
	constructor(props: Props, config?: ISettings) {
		super(Object.assign({}, { createdAt: new Date(), updatedAt: new Date() }, { ...props }), 'Entity', config);
		const isID = this.validator.isID(props?.['id']);
		const isStringOrNumber = this.validator.isString(props?.['id']) || this.validator.isNumber(props?.['id']);
		this._id = isStringOrNumber ? ID.create(props?.['id']) : isID ? props?.['id'] : ID.create();
		this.autoMapper = new AutoMapper();
	}

	/** 
	 * @description Check if entity instance props is equal another provided instance props.
	 * @param createdAt is not considered on compare
	 * @param updatedAt is not considered on compare
	 * @returns true if props is equal and false if not.
	*/
	isEqual(other: this): boolean {
		const currentProps = Object.assign({}, {}, { ...this?.props });
		const providedProps = Object.assign({}, {}, { ...other?.props });
		delete currentProps?.['createdAt'];
		delete currentProps?.['updatedAt'];
		delete providedProps?.['createdAt'];
		delete providedProps?.['updatedAt'];
		const equalId = this.id.equal(other?.id);
		const serializedA = JSON.stringify(currentProps);
		const serializedB = JSON.stringify(providedProps);
		const equalSerialized = serializedA === serializedB;
		return equalId && equalSerialized;
	}

	/**
	 * @description Get value as object from entity.
	 * @returns object with properties.
	 */
	toObject<T>(adapter?: IAdapter<this, T>)
		: T extends {}
		? T & EntityMapperPayload
		: ReadonlyDeep<AutoMapperSerializer<Props> & EntityMapperPayload>  {
		if (adapter && typeof adapter?.build === 'function') return adapter.build(this).value() as any;

		const serializedObject = this.autoMapper.entityToObj(this) as ReadonlyDeep<AutoMapperSerializer<Props>>;
		const frozenObject = deepFreeze<any>(serializedObject);
		return frozenObject
	}

	/**
	 * @description Get id as ID instance
	 * @returns ID instance
	 */
	get id(): UID<string> {
		return this._id;
	}

	/**
	 * @description Get hash to identify the entity.
	 * @returns Entity hash as ID instance.
	 * @example 
	 * `[Entity@ClassName]:UUID`
	 * 
	 * @summary className is defined on constructor config param
	 */
	hashCode(): UID<string> {
		const name = Reflect.getPrototypeOf(this);
		return ID.create(`[Entity@${name?.constructor?.name}]:${this.id.value()}`);
	}

	/**
	 * @description Check if an entity is a new instance.
	 * @returns `true` if entity is a new instance generated and `false` if not.
	 * @summary new instance: not saved on database yet.
	 */
	isNew(): boolean {
		return this.id.isNew();
	}

	/**
	 * @description Get a new instanced based on current Entity.
	 * @summary if not provide an id a new one will be generated.
	 * @param props as optional Entity Props.
	 * @returns new Entity instance.
	 */
	clone(props?: Partial<Props>): this {
		const _props = props ? { ...this.props, ...props } : { ...this.props };
		const instance = Reflect.getPrototypeOf(this);
		const args = [_props, this.config];
		const entity = Reflect.construct(instance!.constructor, args);
		return entity
	}

	/**
	 * @description Method to validate props. This method is used to validate props on create a instance.
	 * @param props to validate
	 * @returns true if props is valid and false if not.
	 */
	public static isValidProps(props: any): boolean {
		return !this.validator.isUndefined(props) && !this.validator.isNull(props);
	};

	public static create(props: any): IResult<any, any, any>;
	/**
	 * 
	 * @param props params as Props
	 * @param id optional uuid as string in props. If not provided on props a new one will be generated.
	 * @returns instance of result with a new Entity on state if success.
	 * @summary result state will be `null` case failure.
	 */
	public static create(props: {}): Result<any, any, any> {
		if (!this.isValidProps(props)) return Result.fail('Invalid props to create an instance of ' + this.name);
		return Result.Ok(new this(props));
	};
}

export default Entity;
