import { ISettings, ICommand, IDomainID, IIterator, IResult, IResultExecute, IResultObject, ITeratorConfig, OBJ, EntityProps, EntityMapperPayload, IHistoryProps, IHistory, IPublicHistory } from "../index.types";
import { ValidateType } from '../utils/check-types';
/**
 * @description Iterator allows sequential traversal through a complex data structure without exposing its internal details.
 * Make any array an iterator using this class.
 */
export declare class Iterator<T> implements IIterator<T> {
    private currentIndex;
    private readonly items;
    private lastCommand;
    private readonly returnCurrentOnReversion;
    private readonly restartOnFinish;
    private constructor();
    /**
     * initialData?: Array<T>;
    returnCurrentOnReversion?: boolean;
    restartOnFinish?: boolean;
     */
    /**
     *
     * @param config Iterator setup as object.
     * @param config.initialData the initial state as Array<T> to turn iterable.
     * @param config.returnCurrentOnReversion this setting allows you to return the current element when you are iterating in one direction and decide to change the iteration to the other direction.
     * @param config.restartOnFinish this configuration turns the iteration into an infinite loop, as when reaching the last element, the iteration starts over from the first element.
     * @returns instance of Iterator.
     */
    static create<U>(config?: ITeratorConfig<U>): Iterator<U>;
    /**
     * @description This method check if has some elements after current position.
     * @returns boolean `true` if has next element and `false` if not.
     */
    hasNext(): boolean;
    /**
     * @description This method check if has some elements before current position.
     * @returns boolean `true` if has next element and `false` if not.
     */
    hasPrev(): boolean;
    /**
     * @description This method check if current data state is empty.
     * @returns boolean `true` if is empty and `false` if not.
     */
    isEmpty(): boolean;
    /**
     * @description This method get the element on current position. Alway start on first element.
     * @returns element on current position and update cursor to the next element.
     *
     * @access if param `config.restartOnFinish` is set to `true` and cursor is on last element the next one will be the first element on state, case value is set to `false` the next element will be `null`.
     */
    next(): T;
    /**
     * @description This method get the element on current position. Alway start on first element.
     * @returns element on current position and update cursor to the previous element.
     *
     * @access if param `config.restartOnFinish` is set to `true` and cursor is on first element the previous one will be the last element on state, case value is set to `false` the previous element will be `null`.
     */
    prev(): T;
    /**
     * @description Get element.
     * @returns the first element on state.
     */
    first(): T;
    /**
     * @description Get element.
     * @returns the last element on state.
     */
    last(): T;
    /**
     * @description Update cursor to the first element on state.
     * @returns instance of iterator.
     */
    toFirst(): Iterator<T>;
    /**
     * @description Update cursor to the last element on state.
     * @returns instance of iterator.
     */
    toLast(): Iterator<T>;
    /**
     * @description Delete state. Remove all elements on state
     * @returns instance of iterator.
     */
    clear(): Iterator<T>;
    /**
     * @description Add new element to state after last position.
     * @param data as element.
     * @returns instance of iterator.
     */
    addToEnd(data: T): Iterator<T>;
    /**
     * @description Add new element to state after last position.
     * @param data as element.
     * @returns instance of iterator.
     */
    add(data: T): Iterator<T>;
    /**
     * @description Add new element to state before first position.
     * @param data as element.
     * @returns instance of iterator.
     */
    addToStart(data: T): Iterator<T>;
    /**
     * @description Remove the last element from state.
     * @returns instance of iterator.
     */
    removeLast(): Iterator<T>;
    /**
     * @description remove the first element from state.
     * @returns instance of iterator.
     */
    removeFirst(): Iterator<T>;
    /**
     * @description Create a new instance of Iterator and keep current state.
     * @returns a new instance of Iterator with state.
     */
    clone(): IIterator<T>;
    /**
     * @description Get elements on state as array.
     * @returns array of items on state.
     */
    toArray(): Array<T>;
    /**
     * @description Count total of items on state.
     * @returns total of items on state.
     */
    total(): number;
}
/**
 * @summary The result is used to returns a operation result instead the own value.
 * @interface IResult<T, D, M>;
 * @classdesc on `T` refer to type of the value and `D` type of the error and `M` metaData type.
 * @default D is string.
 * @default M is empty object {}.
 */
export declare class Result<T, D = string, M = {}> implements IResult<T, D, M> {
    private readonly _isSuccess;
    private readonly _isFailure;
    private readonly _data;
    private readonly _error;
    private readonly _metaData;
    private constructor();
    /**
     * @description Create an instance of Result as success state with data and metadata to payload.
     * @param data as T to payload.
     * @param metaData as M to state.
     * @returns instance of Result.
     */
    static success<T, D, M>(data: T, metaData?: M): Result<T, D, M>;
    /**
     * @description Create an instance of Result as failure state with error and metadata to payload.
     * @param error as D to payload.
     * @param metaData as M to state.
     * @returns instance of Result.
     */
    static fail<T, D, M>(error: D, metaData?: M): Result<T, D, M>;
    /**
     * @description Create an instance of Iterator with array of Results on state.
     * @param results as array of Results
     * @returns instance of Iterator.
     */
    static iterate<A, B, M>(results?: Array<Result<A, B, M>>): IIterator<Result<A, B, M>>;
    /**
     * @description Check all results instances status. Returns the first failure or returns the first success one.
     * @param results arrays with results instance.
     * @returns instance of result.
     * @default returns failure if provide a empty array.
     */
    static combine<A, B, M>(results: Array<Result<A, B, M>>): Result<A, B, M>;
    /**
     * @description Execute any command on fail or success.
     * @param command instance of command that implements ICommand interface.
     * @returns Command result as payload.
     */
    execute<X, Y>(command: ICommand<X | void, Y>): IResultExecute<X, Y>;
    /**
     * @description Get the instance value.
     * @returns `data` T or `null` case result is failure.
     */
    value(): T;
    /**
     * @description Get the instance error.
     * @returns `error` D or `null` case result is success.
     */
    error(): D;
    /**
     * @description Check if result instance is failure.
     * @returns `true` case result instance failure or `false` case is success one.
     */
    isFailure(): boolean;
    /**
     * @description Check if result instance is success.
     * @returns `true` case result instance success or `false` case is failure one.
     */
    isSuccess(): boolean;
    /**
     * @description Get the instance metadata.
     * @returns `metadata` M or `{}` result in case of empty object has no metadata value.
     */
    metaData(): M;
    /**
     * @description Get result state as object.
     * @returns result state.
     * @example
     * {
     * 	isSuccess: boolean;
     * 	isFailure: boolean;
     * 	data: T | null;
     * 	error: D | null;
     * 	metaData: M | {};
     * }
     */
    toObject(): IResultObject<T, D, M>;
}
/**
 * @description defines getter and setter to all domain instances.
 */
export declare class GettersAndSetters<Props> {
    protected props: Props;
    protected readonly _MetaHistory: IHistory<Props>;
    protected config: ISettings;
    constructor(props: Props, config?: ISettings, history?: IHistory<Props>);
    /**
     * @description Create a snapshot as update action.
     * @returns void.
     * @see change
     * @see set
     */
    private snapshotSet;
    /**
     *
     * @param key the property key you want to get
     * @returns the value of property
     */
    get(key: keyof Props): Props[keyof Props];
    /**
     *
     * @param key the property you want to set.
     * @returns to function asking the value you want to set.
     */
    set<Key extends keyof Props>(key: Key): {
        /**
         *
         * @param value the value you want to apply.
         * @param validation function to validate the value before apply. The value will be applied only if to pass on validation.
         * @example
         * (value: PropValue) => boolean;
         * @returns instance of this.
         */
        to: (value: Props[Key], validation?: ((value: Props[Key]) => boolean) | undefined) => GettersAndSetters<Props>;
    };
    /**
     *
     * @param key the property you want to set.
     * @param value the value to apply to the key.
     * @param validation function to validate the value before apply. The value will be applied only if to pass.
     * @returns instance of own class.
     */
    change<Key extends keyof Props>(key: Key, value: Props[Key], validation?: (value: Props[Key]) => boolean): this;
}
/**
 * @description Identity to Entity and Aggregates
 * @method create
 * @param value as string
 */
export declare class ID<T = string> implements IDomainID<T> {
    private _value;
    private _isNew;
    private _createdAt;
    private readonly MAX_SIZE;
    private constructor();
    private setAsNew;
    /**
     * @description Update id value to a short value one. 16bytes.
     * @returns instance of ID with short value. 16bytes
     */
    toShort(): IDomainID<T>;
    /**
     * @description Get the id value.
     * @returns id value as string or number.
     */
    value(): T;
    /**
     * @description Check if id instance is a new one.
     * @returns `true` if id instance is new or `false` if not.
     * @example
     * ID.create("some-value") // this is not a new because on create you provided string value as param.
     *
     * @example
     * ID.create() // this is a new one because none args was provided.
     */
    isNew(): boolean;
    /**
     * @description Get created date
     * @returns date
     */
    createdAt(): Date;
    /**
     * @description Check if id instance is short. 16bytes
     * @returns `true` if id instance has short value and 'false` cause not.
     */
    isShortID(): boolean;
    /**
     * @description Compare value from instance and provided id.
     * @param id instance of ID
     * @returns `true` if provided id value and instance value has the same value and `false` if not.
     */
    equal(id: IDomainID<any>): boolean;
    /**
     * @description Deep comparative. Compare value and serialized instances.
     * @param id instance of ID
     * @returns `true` if provided id and instance is equal and `false` if not.
     */
    deepEqual(id: IDomainID<any>): boolean;
    /**
     * @description Create a clone from instance. This function does not change instance state.
     * @returns a cloned instance with the same properties and value.
     */
    cloneAsNew(): IDomainID<T>;
    /**
     * @description Create a clone from instance. This function does not change instance state.
     * @returns a cloned instance with the same value.
     */
    clone(): IDomainID<T>;
    /**
     * @description Create a short id. 16bytes.
     * @param id value as string optional.If you do not provide a value a new id value will be generated.
     * @returns instance of ID.
     */
    static createShort(id?: string): IDomainID<string>;
    /**
     * @description Create a short id.
     * @param id value as string optional.If you do not provide a value a new uuid value will be generated.
     * @returns instance of ID.
     */
    static create<T = string | number>(id?: T): IDomainID<T>;
}
/**
 * @description Entity identified by an id
 */
export declare class Entity<Props extends EntityProps> extends GettersAndSetters<Props> {
    protected props: Props & EntityProps;
    private _id;
    static validator: ValidateType;
    validator: ValidateType;
    private readonly autoMapper;
    constructor(props: Props, id?: string, config?: ISettings);
    /**
     * @description Get value as object from entity.
     * @returns object with properties.
     */
    toObject<T>(): T extends {} ? T & EntityMapperPayload : {
        [key in keyof Props]: any;
    } & EntityMapperPayload;
    /**
     * @description Get id as ID instance
     * @returns ID instance
     */
    get id(): IDomainID<string>;
    /**
     * @description Get hash to identify the entity.
     * @returns Entity hash as ID instance.
     * @example
     * `[Entity@ClassName]:UUID`
     *
     * @summary className is defined on constructor config param
     */
    hashCode(): IDomainID<string>;
    /**
     * @description Check if an entity is a new instance.
     * @returns `true` if entity is a new instance generated and `false` if not.
     * @summary new instance: not saved on database yet.
     */
    isNew(): boolean;
    /**
     * @description Get a new instanced based on current Entity.
     * @param id value to identify the new entity instance.
     * @summary if not provide an id a new one will be generated.
     * @returns new Entity instance.
     */
    clone(id?: string): IResult<Entity<Props>>;
    /**
     * @description Manage props state as history.
     * @returns IPublicHistory<Props>
     */
    history(): IPublicHistory<Props>;
    /**
     * @description Method to validate prop value.
     * @param value to validate
     */
    static isValidValue(value: any): boolean;
    /**
     *
     * @param props params as Props
     * @param id optional uuid as string, second arg. If not provided a new one will be generated.
     * @returns instance of result with a new Entity on state if success.
     * @summary result state will be `null` case failure.
     */
    static create(props: any, id?: string): IResult<Entity<any>, any, any>;
}
/**
 * @description Aggregate identified by an id
 */
export declare class Aggregate<Props extends EntityProps> extends Entity<Props> {
    constructor(props: Props, id?: string, config?: ISettings);
    /**
     * @description Get hash to identify the aggregate.
     * @returns Aggregate hash as ID instance.
     * @example
     * `[Aggregate@ClassName]:UUID`
     *
     * @summary className is defined on constructor config param
     */
    hashCode(): IDomainID<string>;
    /**
     *
     * @param props params as Props
     * @param id optional uuid as string, second arg. If not provided a new one will be generated.
     * @returns instance of result with a new Aggregate on state if success.
     * @summary result state will be `null` case failure.
     */
    static create(props: any, id?: string): IResult<Aggregate<any>, any, any>;
}
/**
 * @description ValueObject an attribute for entity and aggregate
 */
export declare class ValueObject<Props extends OBJ> extends GettersAndSetters<Props> {
    protected props: Props;
    static validator: ValidateType;
    validator: ValidateType;
    private readonly autoMapper;
    constructor(props: Props, config?: ISettings);
    history(): IPublicHistory<Props>;
    /**
     * @description Get an instance copy.
     * @returns a new instance of value object.
     */
    clone(): IResult<ValueObject<Props>>;
    /**
     * @description Get value from value object.
     * @returns value as string, number or any type defined.
     */
    toObject<T>(): T;
    /**
     * @description Method to validate prop value.
     * @param value to validate
     */
    static isValidValue(value: any): boolean;
    /**
     *
     * @param props params as Props
     * @returns instance of result with a new Value Object on state if success.
     * @summary result state will be `null` case failure.
     */
    static create(props: any): IResult<ValueObject<any>, any, any>;
}
/**
 * @description Auto Mapper transform a domain resource into object.
 */
export declare class AutoMapper<Props> {
    private validator;
    /**
     * @description Transform a value object into a simple value.
     * @param valueObject as instance.
     * @returns an object or a value object value.
     */
    valueObjectToObj(valueObject: ValueObject<Props>): {
        [key in keyof Props]: any;
    };
    /**
     * @description Transform a entity into a simple object.
     * @param entity instance.
     * @returns a simple object.
     */
    entityToObj(entity: Entity<Props>): {
        [key in keyof Props]: any;
    } & EntityMapperPayload;
}
/**
 * @description Manage state props as history.
 */
export declare class History<Props> implements IHistory<Props> {
    private readonly iterator;
    constructor(props?: IHistoryProps<Props>);
    /**
     *
     * @param token ID as token.
     * @returns true if token already exists for some prop state on history and false if not.
     */
    private tokenAlreadyExists;
    /**
     * @description Get all props on state as history.
     * @returns a list of props on state.
     */
    list(): IHistoryProps<Props>[];
    /**
     * @description Create a new snapshot from current state.
     * @param props to be pushed into history.
     * @returns props pushed.
     */
    snapshot(props: IHistoryProps<Props>): IHistoryProps<Props>;
    /**
     * @description Get previous props state and apply to instance.
     * @param token a value to identify the target state on history.
     * @returns previous state found or null if not found.
     */
    back(token?: ID<string>): IHistoryProps<Props> | null;
    /**
     * @description Get next props state and apply to instance.
     * @param token a value to identify the target state on history.
     * @returns next state found or null if not found.
     */
    forward(token?: ID<string>): IHistoryProps<Props> | null;
    /**
     * @description Get total of props on state as history.
     * @returns total of props on state.
     */
    count(): number;
}
