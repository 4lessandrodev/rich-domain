import { Entity, ValueObject } from "./core";
import { BuiltIns, ReadonlyDeep } from "./types-util";

/**
 * @description Represents a generic event with a detail property for storing event-specific data.
 */
export type Event = { detail: any[] };

/**
 * @abstract
 * @description Abstract class defining the structure of an event manager. 
 * Used to manage the lifecycle of events such as subscription, dispatch, and removal.
 */
export abstract class EventManager {
	/**
	 * @description Subscribes a callback function to a specific event.
	 * @param eventName The name of the event to subscribe to.
	 * @param fn The callback function to execute when the event is triggered.
	 */
	abstract subscribe(eventName: string, fn: (event: Event) => void | Promise<void>): void;

	/**
	 * @description Checks if a specific event exists in the event manager.
	 * @param eventName The name of the event to check.
	 * @returns True if the event exists, false otherwise.
	 */
	abstract exists(eventName: string): boolean;

	/**
	 * @description Removes a specific event from the event manager.
	 * @param eventName The name of the event to remove.
	 * @returns True if the event was successfully removed, false otherwise.
	 */
	abstract removerEvent(eventName: string): boolean;

	/**
	 * @description Dispatches an event, triggering all associated callbacks.
	 * @param eventName The name of the event to dispatch.
	 * @param args Optional arguments to pass to the event handlers.
	 */
	abstract dispatchEvent(eventName: string, ...args: any[]): void;
}

/**
 * @description Defines the structure of an event, including its name and callback function.
 */
export type EventType = { 
	eventName: string; 
	callback: (...args: any[]) => void | Promise<void>; 
};

/**
 * @interface
 * @description Represents the result of an operation, encapsulating its state, value, error, and metadata.
 * @template T The type of the result's value.
 * @template D The type of the result's error (default: string).
 * @template M The type of the result's metadata (default: empty object).
 */
export interface _Result<T, D = string, M = {}> {
	/**
	 * @description Retrieves the value of the result. Returns null if the result represents a failure.
	 * @returns The result's value or null.
	 */
	value(): T;

	/**
	 * @description Retrieves the error of the result. Returns null if the result represents success.
	 * @returns The result's error or null.
	 */
	error(): D;

	/**
	 * @description Checks if the result represents a failure.
	 * @returns True if the result is a failure, false otherwise.
	 */
	isFail(): boolean;

	/**
	 * @description Checks if the result contains a null value.
	 * @returns True if the value is null, false otherwise.
	 */
	isNull(): boolean;

	/**
	 * @description Checks if the result represents success.
	 * @returns True if the result is a success, false otherwise.
	 */
	isOk(): boolean;

	/**
	 * @description Retrieves the metadata associated with the result.
	 * @returns The result's metadata.
	 */
	metaData(): M;

	/**
	 * @description Converts the result into an object representing its current state.
	 * @returns An object containing the result's value, error, and metadata.
	 */
	toObject(): ResultObject<T, D, M>;

	/**
	 * @description Executes a command based on the result's state (success or failure).
	 * @template X The input type for the command.
	 * @template Y The output type of the command.
	 * @param command The command to execute.
	 * @returns An object containing hooks for further execution.
	 */
	execute: <X, Y>(command: ICommand<X | void, Y>) => ResultExecute<X, Y>;
}

export type IResult<T, D = string, M = {}> = _Result<T, D, M>

/**
 * @typedef
 * @description Alias for `_Result`, used for convenience.
 */
export type Payload<T, D = string, M = {}> = _Result<T, D, M>;

/**
 * @description Represents the payload passed to an event handler.
 */
export type HandlerPayload<T> = { 
	aggregate: T; 
	eventName: string; 
};

/**
 * @interface
 * @description Represents a unique identifier (UID) with methods for manipulation and comparison.
 * @template T The type of the UID's value (default: string).
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
 * @interface
 * @description Configuration options for creating an iterator.
 * @template T The type of items in the iterator.
 */
export interface ITeratorConfig<T> {
	initialData?: Array<T>;
	returnCurrentOnReversion?: boolean;
	restartOnFinish?: boolean;
}

/**
 * @interface
 * @description Defines the operations supported by an iterator for managing sequential traversal of items.
 * @template T The type of items in the iterator.
 */
export interface _Iterator<T> {
	hasNext(): boolean;
	hasPrev(): boolean;
	next(): T;
	prev(): T;
	first(): T;
	last(): T;
	isEmpty(): boolean;
	toFirst(): _Iterator<T>;
	toLast(): _Iterator<T>;
	toArray(): Array<T>;
	clear(): _Iterator<T>;
	addToEnd(data: T): _Iterator<T>;
	add(data: T): _Iterator<T>;
	addToStart(data: T): _Iterator<T>;
	removeLast(): _Iterator<T>;
	removeFirst(): _Iterator<T>;
	total(): number;
	clone(): _Iterator<T>;
	removeItem(item: T): void;
}




/**
 * @description Represents the possible states of a result: success (`Ok`) or failure (`fail`).
 */
export type IResultOptions = 'fail' | 'Ok';

/** Alias for result options, allowing either `fail` or `Ok` states. */
export type ResultOptions = 'fail' | 'Ok';

/**
 * @interface
 * @description Represents a command that executes an operation with a specific input and output type.
 * @template A The input type of the command.
 * @template B The output type of the command.
 */
export interface ICommand<A, B> {
	execute(data: A): B;
}

/** Alias for `ICommand`, representing a command with input and output types. */
export interface Command<A, B> {
	execute(data: A): B;
}

/**
 * @description Represents a use case, which is a specific type of command that returns a promise.
 * @template T The input type of the use case.
 * @template D The output type of the promise.
 */
export type IUseCase<T, D> = ICommand<T, Promise<D>>;
export type UseCase<T, D> = Command<T, Promise<D>>;

/**
 * @interface
 * @description Represents a proxy for command execution, with optional hooks for pre- and post-processing.
 * @template T The input type for the command.
 * @template D The output type for the command.
 */
export interface _Proxy<T, D> {
	/** Determines if the command can execute with the provided data. */
	canExecute: <A extends T>(data: A) => Promise<boolean> | boolean;

	/** Optional hook for modifying data before execution. */
	beforeExecute?: <A extends T, B extends T>(data: A) => Promise<B>;

	/** The command to execute. */
	execute: ICommand<T, D>;

	/** Optional hook for modifying the result after execution. */
	afterExecute?: <A extends D, B extends D>(data: A) => Promise<B>;
}

/**
 * @interface
 * @description Configuration for value object settings.
 */
export interface _VoSettings {
	/** Disables getters if set to true. */
	disableGetters?: boolean;
}

/** Extends `_VoSettings` with additional options for setters. */
export interface Settings extends _VoSettings {
	/** Disables setters if set to true. */
	disableSetters?: boolean;
}

/**
 * @interface
 * @description Represents the state of a result, including its value, error, and metadata.
 * @template T The type of the result's value.
 * @template D The type of the result's error.
 * @template M The type of the result's metadata.
 */
export interface ResultObject<T, D, M> {
	isOk: boolean; // Indicates if the result is successful.
	isFail: boolean; // Indicates if the result is a failure.
	data: T | null; // The value of the result, or null if failed.
	error: D | null; // The error of the result, or null if successful.
	metaData: M; // Additional metadata associated with the result.
}

/**
 * @interface
 * @description Hook for handling specific result states during execution.
 * @template Y The type of the hook's output.
 */
export interface ResultHook<Y> {
	/**
	 * Executes a function based on the result state.
	 * @param option The result state to handle (`Ok` or `fail`).
	 * @returns The result of the function execution, if applicable.
	 */
	on(option: IResultOptions): Y | undefined;
}

/**
 * @interface
 * @description Extends `ResultHook` with support for data input.
 * @template X The input type for the hook.
 * @template Y The output type for the hook.
 */
export interface ResultExecute<X, Y> extends ResultHook<Y> {
	/** Provides data to the hook before executing. */
	withData(data: X): ResultHook<Y>;
}

/** Represents an empty object. */
export type OBJ = {};

/**
 * @description Represents the common properties for an entity.
 */
export type EntityProps = OBJ | { id?: string, createdAt?: Date, updatedAt?: Date };

/**
 * @description Defines the shape of data used for mapping an entity's properties.
 */
export interface EntityMapperPayload {
	id: string; // Unique identifier of the entity.
	createdAt: Date; // The creation timestamp of the entity.
	updatedAt: Date; // The last updated timestamp of the entity.
}

/**
 * @description Defines validation rules for an object's properties.
 * @template T The type of the object to validate.
 */
export type PropsValidation<T> = { 
	[P in keyof Required<T>]: (value: T[P]) => boolean 
};

/**
 * @interface
 * @description Represents an adapter that transforms one type to another.
 * @template F The input type.
 * @template T The output type.
 * @template E The error type (default: any).
 * @template M The metadata type (default: any).
 */
export interface _Adapter<F, T, E = any, M = any> {
	/** Builds the target type from the input type. */
	build(target: F): _Result<T | null, E, M>;
}

export type IAdapter<F, T, E = any, M = any> = _Adapter<F, T, E, M>;

/**
 * @interface
 * @description Represents a simpler adapter for transforming objects.
 * @template A The input type.
 * @template B The output type.
 */
export interface Adapter<A = any, B = any> {
	/** Adapts a single item. */
	adaptOne(item: A): B;

	/** Adapts multiple items (optional). */
	adaptMany?(items: Array<A>): Array<B>;
}

/**
 * @interface
 * @description Represents an entity with unique properties and lifecycle operations.
 * @template Props The type of the entity's properties.
 */
export interface _Entity<Props> {
	/** Converts the entity into an object, optionally using an adapter. */
	toObject<T>(adapter?: _Adapter<_Entity<Props>, any>): T extends {}
		? T & EntityMapperPayload
		: ReadonlyDeep<AutoMapperSerializer<Props>> & EntityMapperPayload;

	get id(): UID<string>; // The unique identifier of the entity.
	hashCode(): UID<string>; // Returns a hash code for the entity.
	isNew(): boolean; // Checks if the entity is newly created.
	clone(): _Entity<Props>; // Creates a clone of the entity.
}

/**
 * @interface
 * @description Represents a value object with cloning and transformation capabilities.
 * @template Props The type of the value object's properties.
 */
export interface _ValueObject<Props> {
	/** Clones the value object. */
	clone(): _ValueObject<Props>;

	/** Converts the value object into a serializable format, optionally using an adapter. */
	toObject<T>(adapter?: _Adapter<this, T>): T extends {} ? T : ReadonlyDeep<AutoMapperSerializer<Props>>;
}




/**
 * Interface for managing getters and setters for entity properties.
 * @template Props The type of the entity's properties.
 */
export interface _EntityGettersAndSetters<Props> {
	/**
	 * Sets a value for a specified property key.
	 * @param key The property key to set.
	 * @returns A setter function that applies the value and validates it.
	 */
	set<Key extends keyof Props>(key: Key): {
		to: (value: Props[Key], validation?: (value: Props[Key]) => boolean) => boolean;
	};

	/**
	 * Changes the value of a specified property key with optional validation.
	 * @param key The property key to change.
	 * @param value The new value to apply.
	 * @param validation An optional function to validate the value.
	 * @returns `true` if the value is successfully changed; otherwise `false`.
	 */
	change<Key extends keyof Props>(key: Key, value: Props[Key], validation?: (value: Props[Key]) => boolean): boolean;

	/**
	 * Retrieves the value of a specified property key.
	 * @param key The property key to retrieve.
	 * @returns The readonly value of the specified key.
	 */
	get<Key extends keyof Props>(key: Key): Readonly<Readonly<Props[Key]>>;

	/**
	 * Validates a value for a specific property key.
	 * @param value The value to validate.
	 * @param key The property key associated with the value.
	 * @returns `true` if the value is valid; otherwise `false`.
	 */
	validation<Key extends keyof Props>(value: Props[Key], key: Props extends object ? Key : never): boolean;
}

/**
 * Base interface for accessing raw properties or individual keys of an entity.
 * @template Props The type of the entity's properties.
 */
export interface _BaseGettersAndSetters<Props> {
	/**
	 * Retrieves the value of a specified property key.
	 * @param key The property key to retrieve.
	 * @returns The value of the specified key, or the raw object if `Props` is a built-in type.
	 */
	get<Key extends keyof Props>(
		key: Props extends BuiltIns ?
			'value' :
			Props extends Symbol ?
			'value' :
			Props extends any[] ?
			'value' :
			Key
	): Props extends BuiltIns ?
		Props :
		Props extends Symbol ?
		string :
		Props extends any[] ?
		Readonly<Props> :
		Props extends {} ?
		Readonly<Props[Key]> : Props;

	/**
	 * Retrieves the raw properties of the entity.
	 * @returns The raw properties of the entity.
	 */
	getRaw(): Props;
}

/**
 * Interface for aggregate root behavior, extending entity capabilities.
 * @template Props The type of the aggregate's properties.
 */
export interface _Aggregate<Props> {
	/**
	 * Converts the aggregate to a serializable object, optionally using an adapter.
	 * @param adapter An optional adapter for transforming the aggregate.
	 * @returns The serialized object with metadata.
	 */
	toObject<T>(adapter?: _Adapter<this, T>): T extends {}
		? T & EntityMapperPayload
		: ReadonlyDeep<AutoMapperSerializer<Props> & EntityMapperPayload>;

	/** The unique identifier of the aggregate. */
	get id(): UID<string>;

	/** Generates a hash code for the aggregate. */
	hashCode(): UID<string>;

	/** Checks if the aggregate is newly created. */
	isNew(): boolean;

	/** Creates a deep clone of the aggregate. */
	clone(): _Entity<Props>;

	/** Removes an event from the aggregate's event context. */
	deleteEvent(eventName: string): void;

	/** Provides access to the aggregate's event management context. */
	context(): EventManager;
}

/** Union type representing the parent name of an entity or value object. */
export type IParentName = 'ValueObject' | 'Entity';

type SerializerEntityReturnType<ThisEntity extends Entity<any>> = ReturnType<ThisEntity['getRaw']>
type SerializerValueObjectReturnType<ThisValueObject extends ValueObject<any>> = ReturnType<ThisValueObject['getRaw']>

/**
 * Serializes properties of entities and value objects into a nested structure.
 * @template Props The type of properties to serialize.
 */
export type AutoMapperSerializer<Props> = {
	[key in keyof Props]:
	Props[key] extends ValueObject<any>
	? AutoMapperSerializer<SerializerValueObjectReturnType<Props[key]>>
	: Props[key] extends Entity<any>
	? AutoMapperSerializer<SerializerEntityReturnType<Props[key]>> & EntityMapperPayload
	: Props[key] extends Array<any>
	? Array<
		AutoMapperSerializer<ReturnType<Props[key][0]['getRaw']>>
		& (
			Props[key][0] extends Entity<any>
			? EntityMapperPayload
			: {}
		)
	>
	: Props[key]
};

/**
 * Interface for automatic mapping of entities and value objects to objects.
 * @template Props The type of properties to map.
 */
export interface _AutoMapper<Props> {
	/** Maps a value object to a serializable object. */
	valueObjectToObj(valueObject: _ValueObject<Props>): AutoMapperSerializer<Props>;

	/** Maps an entity to a serializable object with metadata. */
	entityToObj(entity: _Entity<Props>): AutoMapperSerializer<Props> & EntityMapperPayload;
}

/**
 * Represents a data structure containing a class and its associated properties.
 */
export interface _ManyData {
	class: any;
	props: any;
}

/** Array of `_ManyData` objects, representing multiple domain instances. */
export type CreateManyDomain = Array<_ManyData>;

/**
 * Represents the result of creating multiple domain instances.
 */
export interface CreateManyResult {
	/** Iterator over the results of the creation process. */
	data: _Iterator<_Result<any, any, any>>;

	/** Combined result of the creation process. */
	result: _Result<any, any, any>;
}

/** Empty class type. */
export type IClass = {};

/** Supported time units for operations like incrementing or decrementing time. */
export type Unit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

/** Milliseconds in common time units. */
export const ONE_MINUTE = 60000;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;
export const ONE_MONTH = ONE_DAY * 30;
export const ONE_YEAR = ONE_DAY * 365;

/** Options for calculations, such as specifying precision. */
export type CalcOpt = { fractionDigits: number };

/**
 * Interface for metrics tracking event-related data.
 */
export interface EventMetrics {
	current: number; // The current number of active events.
	total: number; // The total number of events.
	dispatch: number; // The number of dispatched events.
}

/**
 * Interface representing the configuration of an event.
 * @template T The type associated with the event.
 */
export interface DEvent<T> {
	eventName: string; // The name of the event.
	handler: Handler<T>; // The function to handle the event.
	options: Options; // Additional configuration options.
}

/** Arguments passed to event handlers. */
export type HandlerArgs<T> = [T, [DEvent<T>, ...any[]]];

/** Represents an asynchronous event handler. */
export type PromiseHandler<T> = (...args: HandlerArgs<T>) => Promise<void>;

/** Represents a synchronous event handler. */
export type NormalHandler<T> = (...args: HandlerArgs<T>) => void;

/** Represents an event handler, either synchronous or asynchronous. */
export type Handler<T> = PromiseHandler<T> | NormalHandler<T>;

/**
 * Options for configuring an event.
 */
export interface Options {
	priority: number; // The priority of the event.
}

/**
 * Interface for metrics related to event management.
 */
export interface Metrics {
	totalEvents: () => number; // Returns the total number of registered events.
	totalDispatched: () => number; // Returns the total number of dispatched events.
}

/**
 * Parameters for configuring an event.
 */
export interface EventParams {
	eventName: string; // The name of the event.
	options?: Options; // Additional options for the event.
}

/**
 * Abstract class representing an event handler.
 * @template T - The type of the associated aggregate.
 */
export abstract class EventHandler<T> {
	constructor(public readonly params: EventParams) {
		if (typeof params?.eventName !== 'string') {
			throw new Error('params.eventName is required as string');
		}
		this.dispatch = this.dispatch.bind(this);
	}

	/**
	 * Dispatches the event to its handler.
	 * @param aggregate - The associated aggregate instance.
	 * @param args - Arguments for the event handler.
	 * @returns A promise or void, depending on the handler's implementation.
	 */
	abstract dispatch(aggregate: T, args: [DEvent<T>, any[]]): Promise<void> | void;

	/**
	 * Dispatches the event with additional handler arguments.
	 * @param args - Additional arguments for the handler.
	 * @returns A promise or void, depending on the handler's implementation.
	 */
	abstract dispatch(...args: HandlerArgs<T>): Promise<void> | void;
}
