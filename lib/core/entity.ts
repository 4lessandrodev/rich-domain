import { Adapter, AutoMapperSerializer, EntityMapperPayload, EntityProps, _Adapter, _Entity, _Result, Settings, UID } from "../types";
import { ReadonlyDeep } from "../types-util";
import { deepFreeze } from "../utils/deep-freeze.util";
import AutoMapper from "./auto-mapper";
import GettersAndSetters from "./entity-getters-and-setters";
import ID from "./id";
import Result from "./result";

/**
 * @description Represents a domain entity identified by a unique identifier (ID). 
 * Extends basic entity functionalities, ensuring the presence of `createdAt` and `updatedAt` timestamps and providing 
 * utility methods such as equality checks, object transformations, and instance creation.
 */
export class Entity<Props extends EntityProps> extends GettersAndSetters<Props> implements _Entity<Props> {
	protected _id: UID<string>;
	protected autoMapper: AutoMapper<Props>;
	constructor(props: Props, config?: Settings) {
		super(Object.assign({}, { createdAt: new Date(), updatedAt: new Date() }, { ...props }), 'Entity', config);
		if (typeof props !== 'object' || (props instanceof Date) || Array.isArray(props)) {
			throw new Error(`Props must be an 'object' for entities, but received: '${typeof props}' as props on Class '${this.constructor.name}'`);
		};
		const isID = this.validator.isID(props?.['id']);
		const isStringOrNumber = this.validator.isString(props?.['id']) || this.validator.isNumber(props?.['id']);
		this._id = isStringOrNumber ? ID.create(props?.['id']) : isID ? props?.['id'] : ID.create();
		this.autoMapper = new AutoMapper();
	}

	/** 
	 * @description Determines if the current entity has the same properties (except `createdAt` and `updatedAt`) and the same ID as another entity.
	 * @param other The entity instance to compare against.
	 * @returns `true` if both entities have identical properties and IDs; otherwise, `false`.
	 */
	isEqual(other: this): boolean {
		const currentProps = { ...this?.props, id: null };
		const providedProps = { ...other?.props, id: null };
	
		delete currentProps?.['createdAt'];
		delete currentProps?.['updatedAt'];
		delete providedProps?.['createdAt'];
		delete providedProps?.['updatedAt'];
	
		const equalId = this.id.isEqual(other?.id);

		const serializedA = JSON.stringify(currentProps);
		const serializedB = JSON.stringify(providedProps);
		const equalSerialized = serializedA === serializedB;
	
		return equalId && equalSerialized;
	}

	/**
	 * @description Converts the current entity instance into a plain object representation.
	 * @param adapter An optional adapter or builder that transforms the entity into another object format.
	 * @returns If an adapter is provided, returns the adapted object. Otherwise, returns a deeply frozen object 
	 * representing the entity properties along with entity metadata (`AutoMapperSerializer<Props> & EntityMapperPayload`).
	 */
	toObject<T>(adapter?: Adapter<this, T> | _Adapter<this, T>)
		: T extends {}
		? T & EntityMapperPayload
		: ReadonlyDeep<AutoMapperSerializer<Props> & EntityMapperPayload> {
		if(adapter && typeof (adapter as Adapter<this, T>)?.adaptOne === 'function') {
			return (adapter as Adapter<this, T>).adaptOne(this) as any;
		}
		if (adapter && typeof (adapter as _Adapter<this, T>)?.build === 'function') {
			return (adapter as _Adapter<this, T>).build(this).value() as any;
		}
		const serializedObject = this.autoMapper.entityToObj(this) as ReadonlyDeep<AutoMapperSerializer<Props>>;
		const frozenObject = deepFreeze<any>(serializedObject);
		return frozenObject
	}

	/**
	 * @description Retrieves the unique identifier (ID) of the entity.
	 * @returns An instance of `UID<string>` representing the entity's ID.
	 */
	get id(): UID<string> {
		return this._id;
	}

	/**
	 * @description Generates a "hash code" like identifier for the entity, combining its class name and ID.
	 * @summary The format is `[Entity@ClassName]:UUID`. The ClassName is derived from the entity's prototype. 
	 * This helps uniquely identify the entity instance in logs or debugging.
	 * @returns A `UID<string>` representing the hash code of the entity.
	 */
	hashCode(): UID<string> {
		const name = Reflect.getPrototypeOf(this);
		return ID.create(`[Entity@${name?.constructor?.name}]:${this.id.value()}`);
	}

	/**
	 * @description Checks if the entity is newly created and not yet persisted or saved externally (e.g., to a database).
	 * @returns `true` if the entity is considered new (ID marked as new); otherwise, `false`.
	 */
	isNew(): boolean {
		return this.id.isNew();
	}

	/**
	 * @description Creates a new entity instance based on the current entity. 
	 * Allows overriding some properties. If no `id` is provided in the new props, a new one will be generated.
	 * @param props Optional partial properties to override when creating the new entity instance.
	 * @returns A new instance of the entity with updated properties.
	 */
	clone(props?: Props extends object ? Partial<Props> : never): this {
		const instance = Reflect.getPrototypeOf(this);
		const _props = props ? { ...this.props, ...props } : { ...this.props };
		const args = [_props, this.config];
		return Reflect.construct(instance!.constructor, args);
	}

	/**
	 * @description Validates if a given value is suitable for creating or representing an entity.
	 * @param value The value to validate.
	 * @returns `true` if the value is considered valid for the entity; otherwise, `false`.
	 */
	public static isValid(value: any): boolean {
		return this.isValidProps(value);
	};

	/**
	 * @description Validates the provided properties to check if they can be used to create a valid entity instance.
	 * @param props The properties object to validate.
	 * @returns `true` if the props are valid; `false` otherwise.
	 */
	public static isValidProps(props: any): boolean {
		return !this.validator.isUndefined(props) && !this.validator.isNull(props);
	};

	/**
	 * @description Initializes a new entity instance from the given properties.
	 * @summary This method should be implemented in subclasses. By default, it throws an error.
	 * @param props The properties to initialize the entity.
	 * @returns The newly created entity instance or throws an error if not implemented.
	 * @throws An error indicating the method is not implemented.
	 */
	public static init(props: any): any {
		throw new Error('method not implemented: init', {
			cause: props
		});
	};

	public static create(props: any): Result<any, any, any>;
	/**
	 * @description Creates a new entity instance wrapped inside a `Result` object.
	 * @param props The properties to create the entity with. Must be valid properties.
	 * @param id (Optional) A UUID to assign to the entity. If not provided, a new one will be generated.
	 * @returns A `Result` instance containing the new entity if successfully created; otherwise, a failure `Result`.
	 * @summary If the properties are invalid, the result will be a failure with `null` state.
	 */
	public static create(props: {}): Result<any, any, any> {
		if (!this.isValidProps(props)) return Result.fail('Invalid props to create an instance of ' + this.name);
		return Result.Ok(new this(props));
	};
}

export default Entity;
