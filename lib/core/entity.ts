import { EntityMapperPayload, EntityProps, IAdapter, IEntity, IResult, ISettings, UID } from "../types";
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
	 * @description Get value as object from entity.
	 * @returns object with properties.
	 */
	toObject<T>(adapter?: IAdapter<this, T>): T extends {} ? T & EntityMapperPayload : { [key in keyof Props]: any } & EntityMapperPayload {
		if (adapter && typeof adapter?.build === 'function') return adapter.build(this).value() as any;
		return this.autoMapper.entityToObj(this) as any;
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
	 * @returns new Entity instance.
	 */
	clone(): IResult<Entity<Props>> {
		const instance = Reflect.getPrototypeOf(this);
		if (!instance) return Result.fail('Could not get entity instance');
		const args = [this.props, this.config];
		const entity = Reflect.construct(instance.constructor, args);
		if (entity instanceof Entity) return Result.OK(entity);
		return Result.fail('Could not create instance of entity');
	}


	/**
	 * @description Method to validate props. This method is used to validate props on create a instance.
	 * @param props to validate
	 * @returns true if props is valid and false if not.
	 */
	public static isValidProps(props: any): boolean {
		return !this.validator.isUndefined(props) && !this.validator.isNull(props);
	};

	/**
	 * 
	 * @param props params as Props
	 * @param id optional uuid as string in props. If not provided on props a new one will be generated.
	 * @returns instance of result with a new Entity on state if success.
	 * @summary result state will be `null` case failure.
	 */
	public static create(props: any): IResult<Entity<any>, any, any> {
		if(!this.isValidProps(props)) return Result.fail('Invalid props to create an instance of ' + this.name);
		return Result.OK(new this(props));
	};
}

export default Entity;
