/**
 * @summary The result is used to returns a operation result instead the own value.
 * @interface IResult<T, D, M>;
 * @classdesc on `T` refer to type of the value and `D` type of the error and `M` metaData type.
 * @default D is string.
 * @default M is empty object {}.
 * 
 * @method `value()` get result value. return null if result is failure.
 * @method `error()` get result error. returns null if result is success.
 * @method `isFail()` check is result is failure
 * @method `isOk()` check if result is success
 * @method `metaData()` get result metadata
 * @method `toObject()` get an object with result state
 * @method `execute()` execute a hook as command on fail or on success
 */
export interface IResult<T, D = string, M = {}> {
	value(): T;
	error(): D;
	isFail(): boolean;
	isOk(): boolean;
	metaData(): M;
	toObject(): IResultObject<T, D, M>;
	execute: <X, Y>(command: ICommand<X | void, Y>) => IResultExecute<X, Y>;
}

/**
 * @summary The result is used to returns a operation result instead the own value.
 * @interface IResult<T, D, M>;
 * @classdesc on `T` refer to type of the value and `D` type of the error and `M` metaData type.
 * @default D is string.
 * @default M is empty object {}.
 * 
 * @method `value()` get result value. return null if result is failure.
 * @method `error()` get result error. returns null if result is success.
 * @method `isFail()` check is result is failure
 * @method `isOk()` check if result is success
 * @method `metaData()` get result metadata
 * @method `toObject()` get an object with result state
 * @method `execute()` execute a hook as command on fail or on success
 */
export type Payload<T, D = string, M = {}> = IResult<T, D, M>;
export type HandlerPayload<T> = { aggregate: T, eventName: string };

/**
 * 
 */
export interface UID<T = string> {
	toShort(): UID<string>;
	value(): string;
	isNew(): boolean;
	createdAt(): Date;
	isShort(): boolean;
	equal(id: UID<string>): boolean;
	isEqual(id: UID<string>): boolean;
	deepEqual(id: UID<string>): boolean;
	cloneAsNew(): UID<string>;
	clone(): UID<T>;
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
export type IResultOptions = 'fail' | 'Ok';

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
	canExecute: <A extends T>(data: A) => Promise<boolean> | boolean;
	beforeExecute?: <A extends T, B extends T>(data: A) => Promise<B>;
	execute: ICommand<T, D>;
	afterExecute?: <A extends D, B extends D>(data: A) => Promise<B>;
}

export interface ISettings {
	disableGetters?: boolean;
	disableSetters?: boolean;
}

export interface IResultObject<T, D, M> {
	isOk: boolean;
	isFail: boolean;
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

export type OBJ = {};

export type EntityProps = OBJ | { id?: string, createdAt?: Date, updatedAt?: Date };

export interface EntityMapperPayload {
	id: string,
	createdAt: Date,
	updatedAt: Date
};

export interface IHistoryProps<Props> {
	props: Props;
	action: 'create' | 'update';
	token?: UID<string>;
	ocurredAt?: Date;
}

export interface IHistory<Props> {
	snapshot(props: IHistoryProps<Props>): IHistoryProps<Props>;
	back(token?: UID<string>): IHistoryProps<Props>;
	forward(token?: UID<string>): IHistoryProps<Props>;
	count(): number;
	list(): Array<IHistoryProps<Props>>;
}

export interface IEntityHistory<Props> {
	back(token?: UID<string>): IHistoryProps<Props> | null;
	forward(token?: UID<string>): IHistoryProps<Props> | null;
	count(): number;
	list(): Array<IHistoryProps<Props>>;
}

export interface IPublicHistory<Props> {
	snapshot(token?: UID<string>): IHistoryProps<Props>;
	back(token?: UID<string>): IHistoryProps<Props>;
	forward(token?: UID<string>): IHistoryProps<Props>;
	count(): number;
	list(): Array<IHistoryProps<Props>>;
}

export type IPropsValidation<T> = { [P in keyof Required<T>]: (value: T[P]) => boolean };

export interface IAdapter<F, T, E = any, M = any> {
	build(target: F): IResult<T, E, M>;
}

export interface IEntity<Props> {
	toObject<T>(adapter?: IAdapter<IEntity<Props>, any>): T extends {} ? T & EntityMapperPayload : { [key in keyof Props]: any } & EntityMapperPayload;
	get id(): UID<string>;
	hashCode(): UID<string>;
	isNew(): boolean;
	clone(): IEntity<Props>;
}

export interface IValueObject<Props> {
	clone(): IValueObject<Props>;
	toObject<T>(adapter?: IAdapter<this, T>): T;
}

export interface IGettersAndSetters<Props> {
	validation<Key extends keyof Props>(value: Props[Key], key: Key): boolean;
	get<Key extends keyof Props>(key: Key): Props[Key];
	set<Key extends keyof Props>(key: Key): {
		to: (value: Props[Key], validation?: (value: Props[Key]) => boolean) => boolean;
	};
	change<Key extends keyof Props>(key: Key, value: Props[Key], validation?: (value: Props[Key]) => boolean): boolean;
}

export interface IAggregate<Props> {
	toObject<T>(adapter?: IAdapter<this, T>): T extends {} ? T & EntityMapperPayload : { [key in keyof Props]: any } & EntityMapperPayload;
	get id(): UID<string>;
	hashCode(): UID<string>;
	isNew(): boolean;
	clone(): IEntity<Props>;
	deleteEvent(eventName: string): void;
}

export type IParentName = 'ValueObject' | 'Entity';


export interface IAutoMapper<Props> {
	valueObjectToObj(valueObject: IValueObject<Props>): { [key in keyof Props]: any };
	entityToObj(entity: IEntity<Props>): { [key in keyof Props]: any } & EntityMapperPayload;
}

export interface IManyData {
	class: any;
	props: OBJ;
}

export type ICreateManyDomain = Array<IManyData>;

export interface ICreateManyResult {
	data: IIterator<IResult<any, any, any>>;
	result: IResult<any, any, any>;
}

export type IClass = {};

export type Unit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export const ONE_MINUTE = 60000;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;
export const ONE_MONTH = ONE_DAY * 30;
export const ONE_YEAR = ONE_DAY * 365;

export type CalcOpt = { fractionDigits: number };

export interface EventMetrics {
	current: number;
	total: number;
	dispatch: number;
}

/**
 * Interface representing an event.
 */
export interface DEvent<T> {
	eventName: string;
	handler: Handler<T>;
	options: Options;
}

export type HandlerArgs<T> = [T, [DEvent<T>, ...any[]]]

/**
 * Represents a promise-based event handler.
 */
export type PromiseHandler<T> = (...args: HandlerArgs<T>) => Promise<void>;

/**
 * Represents a normal event handler.
 */
export type NormalHandler<T> = (...args: HandlerArgs<T>) => void;

/**
 * Represents an event handler, which can be either a promise-based handler or a normal handler.
 */
export type Handler<T> = PromiseHandler<T> | NormalHandler<T>;

/**
 * Interface representing options for an event.
 */
export interface Options {
	priority: number;
}

/**
 * Interface representing metrics related to events.
 * @interface Metrics
 */
export interface Metrics {
	/**
	 * A function that returns the total number of events.
	 * @returns {number} The total number of events.
	 */
	totalEvents: () => number;

	/**
	 * A function that returns the total number of dispatched events.
	 * @returns {number} The total number of dispatched events.
	 */
	totalDispatched: () => number;
}

/**
 * Parameters for defining an event.
 */
export interface EventParams {
    /**
     * The name of the event.
     */
    eventName: string;
    /**
     * Additional options for the event.
     */
    options?: Options;
}


/**
 * Abstract class representing an event handler.
 * @template T - The type of aggregate this event handler is associated with.
 */
export abstract class EventHandler<T> {
    /**
     * Creates an instance of EventHandler.
     * @param {EventParams} params - Parameters for the event handler.
     * @throws {Error} If params.eventName is not provided as a string.
     */
    constructor(public readonly params: EventParams) {
        if (typeof params?.eventName !== 'string') {
            throw new Error('params.eventName is required as string');
        }
		this.dispatch = this.dispatch.bind(this);
    }

    /**
     * Dispatches the event with the provided arguments.
     * @abstract
     * @param {T} aggregate - The aggregate associated with the event.
     * @param {[DEvent<T>, any[]]} args - Arguments for the event dispatch.
     * @returns {Promise<void> | void} A Promise if the event dispatch is asynchronous, otherwise void.
     */
    abstract dispatch(aggregate: T, args: [DEvent<T>, any[]]): Promise<void> | void;

    /**
     * Dispatches the event with the provided arguments.
     * @abstract
     * @param {...HandlerArgs<T>} args - Arguments for the event dispatch.
     * @returns {Promise<void> | void} A Promise if the event dispatch is asynchronous, otherwise void.
     */
    abstract dispatch(...args: HandlerArgs<T>): Promise<void> | void;
}
