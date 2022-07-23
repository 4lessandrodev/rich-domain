/**
 * @summary The result is used to returns a operation result instead the own value.
 * @interface IResult<T, D, M>;
 * @classdesc on `T` refer to type of the value and `D` type of the error and `M` metaData type.
 * @default D is string.
 * @default M is empty object {}.
 * 
 * @method `value()` get result value. return null if result is failure.
 * @method `error()` get result error. returns null if result is success.
 * @method `isFailure()` check is result is failure
 * @method `isSuccess()` check if result is success
 * @method `metaData()` get result metadata
 * @method `toObject()` get an object with result state
 * @method `execute()` execute a hook as command on fail or on success
 */
export interface IResult<T, D = string, M = {}> {
	value(): T;
	error(): D;
	isFailure(): boolean;
	isSuccess(): boolean;
	metaData(): M;
	toObject(): IResultObject<T, D, M>;
	execute:<X, Y>(command: ICommand<X|void, Y>)=>IResultExecute<X, Y>;
}

/**
 * 
 */
export interface IDomainID<T = string> {

	toShort(): IDomainID<string>;

	value(): string;

	isNew(): boolean;

	createdAt(): Date;

	isShortID(): boolean;

	equal(id: IDomainID<string>): boolean;
	
	deepEqual(id: IDomainID<string>): boolean;

	cloneAsNew(): IDomainID<string>;

	clone(): IDomainID<T>;
}

/**
 * 
 */
export interface ITeratorConfig<T> {
	initialData?: Array<T>;
	returnCurrentOnReversion?: boolean;
	restartOnFinish?: boolean;
}

/**
 * 
 */
export interface IIterator<T> {
	hasNext(): boolean;

	hasPrev(): boolean;

	next(): T;

	prev(): T;

	first(): T;

	last(): T;

	isEmpty(): boolean;

	toFirst(): IIterator<T>;

	toLast(): IIterator<T>;

	toArray(): Array<T>;

	clear(): IIterator<T>;

	addToEnd(data: T): IIterator<T>;

	add(data: T): IIterator<T>;

	addToStart(data: T): IIterator<T>;

	removeLast(): IIterator<T>;

	removeFirst(): IIterator<T>;

	total(): number;

	clone(): IIterator<T>;

	removeItem(item: T): void;
}

/**
 * 
 */
export type IResultOptions = 'fail' | 'success';

/**
 * 
 */
export interface ICommand<A, B> {
	execute(data: A): B;
}

/**
 * 
 */
export type IUseCase<T, D> = ICommand<T, Promise<D>>;

export interface IProxy<T, D> {
	canExecute:<A extends T>(data: A) => Promise<boolean> | boolean;
	beforeExecute?:<A extends T, B extends T>(data: A) => Promise<B>;
	execute: ICommand<T, D>;
	afterExecute?:<A extends D, B extends D>(data: A) => Promise<B>;
}

export interface ISettings {
	deactivateGetters?: boolean;
	deactivateSetters?: boolean;
}

export interface IResultObject<T, D, M> {
	isSuccess: boolean;
	isFailure: boolean;
	data: T | null;
	error: D | null;
	metaData: M;
}

export interface IResultHook<Y> {
	on(option: IResultOptions): Y | undefined;
}

export interface IResultExecute<X, Y> extends IResultHook<Y> {
	withData(data: X): IResultHook<Y>;
}

export type OBJ = { };

export type EntityProps = OBJ | { createdAt?: Date, updatedAt?: Date };

export interface EntityMapperPayload {
	id: string,
	createdAt: Date,
	updatedAt: Date
};

export interface IHistoryProps<Props> {
	props: Props;
	action: 'create' | 'update';
	token?: IDomainID<string>;
	ocurredAt?: Date;
}

export interface IHistory<Props> {
	snapshot(props: IHistoryProps<Props>): IHistoryProps<Props>;
	back(token?: IDomainID<string>): IHistoryProps<Props>;
	forward(token?: IDomainID<string>): IHistoryProps<Props>;
	count(): number;
	list(): Array<IHistoryProps<Props>>;
}

export interface IEntityHistory<Props> {
	back(token?: IDomainID<string>): IHistoryProps<Props> | null;
	forward(token?: IDomainID<string>): IHistoryProps<Props> | null;
	count(): number;
	list(): Array<IHistoryProps<Props>>;
}

export interface IPublicHistory<Props> {
	snapshot(token?: IDomainID<string>): IHistoryProps<Props>;
	back(token?: IDomainID<string>): IHistoryProps<Props>;
	forward(token?: IDomainID<string>): IHistoryProps<Props>;
	count(): number;
	list(): Array<IHistoryProps<Props>>;
}

export type IPropsValidation<T> = { [P in keyof Required<T>]: (value: T[P]) => boolean };

/**
 * @description Domain Events Params
 * @param aggregate the entity to add the event.
 * @param createdAt the current date time the event was created.
 * @param callback the event handler to be executed on dispatch.
 */
export interface IDomainEvent<T> {
	aggregate: T;
	createdAt: Date;
	callback: IHandle<T>;
}

/**
 * @description Define a handler to be executed on dispatch an event.
 * @var eventName is optional value as string or undefine.
 * @method dispatch is the method to be executed on dispatch the event.
 */
export interface IHandle<T> {
	/**
	 * @description eventName is optional value. Default is className
	 */
	eventName?: string;
	dispatch(event: IDomainEvent<T>): Promise<void> | void;
}

/**
 * @description Options to dispatch some event.
 * @param eventName is the value defined on handler. Default is the class name.
 * @param id is the ID to identify the aggregate on state.
 */
export interface IDispatchOptions {
	eventName: string;
	id: IDomainID<string>;
}

/**
 * @description Event options
 */
export interface IEvent<G> {
	event: IDomainEvent<G>;
	replace?: boolean;
}

export type IReplaceOptions = 'REPLACE_DUPLICATED' | 'UPDATE' | 'KEEP';

export interface IAdapter<F, T>{
	build(target: F): IResult<T>;
}
