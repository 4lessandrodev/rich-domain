import { randomUUID } from 'crypto';
import {
	GetterAndSetterSettings,
	ICommand,
	IDomainID,
	IIterator,
	IResult,
	IResultExecute,
	IResultHook,
	IResultObject,
	IResultOptions,
	ITeratorConfig,
	OBJ
} from "../index.types";
import { ValidateType } from '../utils/check-types';

/**
 * @description Iterator allows sequential traversal through a complex data structure without exposing its internal details.
 * Make any array an iterator using this class.
 */
export class Iterator<T> implements IIterator<T> {
	private currentIndex: number;
	private readonly items: Array<T>;
	private lastCommand: 'next' | 'prev' | 'none';
	private readonly returnCurrentOnReversion: boolean;
	private readonly restartOnFinish: boolean;

	private constructor(config?: ITeratorConfig<T>) {
		this.currentIndex = -1;
		this.items = config?.initialData ?? [];
		this.lastCommand = 'none';
		this.returnCurrentOnReversion = !!config?.returnCurrentOnReversion ?? false;
		this.restartOnFinish = !!config?.restartOnFinish ?? false;
	}

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
	public static create<U>(config?: ITeratorConfig<U>): Iterator<U> {
		return new Iterator<U>(config);
	}

	/**
	 * @description This method check if has some elements after current position.
	 * @returns boolean `true` if has next element and `false` if not.
	 */
	hasNext(): boolean {
		if (this.isEmpty()) return false;
		return (this.currentIndex + 1) < this.items.length;
	}
	/**
	 * @description This method check if has some elements before current position.
	 * @returns boolean `true` if has next element and `false` if not.
	 */
	hasPrev(): boolean {
		if (this.isEmpty()) return false;
		return (this.currentIndex - 1) >= 0;
	}
	/**
	 * @description This method check if current data state is empty.
	 * @returns boolean `true` if is empty and `false` if not.
	 */
	isEmpty(): boolean {
		return this.total() === 0;
	}

	/**
	 * @description This method get the element on current position. Alway start on first element.
	 * @returns element on current position and update cursor to the next element.
	 * 
	 * @access if param `config.restartOnFinish` is set to `true` and cursor is on last element the next one will be the first element on state, case value is set to `false` the next element will be `null`.
	 */
	next(): T {
		if (this.hasNext()) {
			if (this.lastCommand === 'prev' && this.currentIndex === 0) {
				this.lastCommand = 'next';
				return this.items[this.currentIndex];
			}
			const next = (this.currentIndex + 1);
			this.currentIndex = next;
			this.lastCommand = this.returnCurrentOnReversion ? 'next' : 'none';
			return this.items[next];
		};
		if (!this.restartOnFinish) return null as unknown as T;
		this.toFirst();
		return this.first();
	}
	/**
	 * @description This method get the element on current position. Alway start on first element.
	 * @returns element on current position and update cursor to the previous element.
	 * 
	 * @access if param `config.restartOnFinish` is set to `true` and cursor is on first element the previous one will be the last element on state, case value is set to `false` the previous element will be `null`.
	 */
	prev(): T {
		if (this.hasPrev()) {
			if (this.lastCommand === 'next' && this.currentIndex === this.total() - 1) {
				this.lastCommand = 'prev';
				return this.items[this.currentIndex];
			}
			const prev = (this.currentIndex - 1);
			this.currentIndex = prev;
			this.lastCommand = this.returnCurrentOnReversion ? 'prev' : 'none';
			return this.items[prev];
		};
		if (!this.restartOnFinish) return null as unknown as T;
		this.toLast();
		return this.last();
	}

	/**
	 * @description Get element.
	 * @returns the first element on state.
	 */
	first(): T {
		return this.items.at(0) as T;
	}

	/**
	 * @description Get element.
	 * @returns the last element on state.
	 */
	last(): T {
		return this.items.at(-1) as T;
	}

	/**
	 * @description Update cursor to the first element on state.
	 * @returns instance of iterator.
	 */
	toFirst(): Iterator<T> {
		if (this.currentIndex === 0 || this.currentIndex === -1) {
			this.currentIndex = -1;
			return this;
		}
		this.currentIndex = 0;
		return this;
	}

	/**
	 * @description Update cursor to the last element on state.
	 * @returns instance of iterator.
	 */
	toLast(): Iterator<T> {
		if (this.currentIndex === this.total() - 1 || this.currentIndex === -1) {
			this.currentIndex = this.total();
			return this;
		}
		this.currentIndex = this.total() - 1;
		return this;
	}

	/**
	 * @description Delete state. Remove all elements on state 
	 * @returns instance of iterator.
	 */
	clear(): Iterator<T> {
		this.items.splice(0, this.total())
		this.currentIndex = -1;
		return this;
	}

	/**
	 * @description Add new element to state after last position.
	 * @param data as element.
	 * @returns instance of iterator.
	 */
	addToEnd(data: T): Iterator<T> {
		this.items.push(data);
		return this;
	}

	/**
	 * @description Add new element to state after last position.
	 * @param data as element.
	 * @returns instance of iterator.
	 */
	add(data: T): Iterator<T> {
		return this.addToEnd(data);
	}

	/**
	 * @description Add new element to state before first position.
	 * @param data as element.
	 * @returns instance of iterator.
	 */
	addToStart(data: T): Iterator<T> {
		this.currentIndex = -1;
		this.items.unshift(data);
		return this;
	}

	/**
	 * @description Remove the last element from state.
	 * @returns instance of iterator.
	 */
	removeLast(): Iterator<T> {
		if (this.currentIndex >= this.total()) this.currentIndex -= 1;
		this.items.pop();
		return this;
	}

	/**
	 * @description remove the first element from state.
	 * @returns instance of iterator.
	 */
	removeFirst(): Iterator<T> {
		if (this.currentIndex > 0) this.currentIndex -= 1;
		this.items.shift();
		return this;
	}

	/**
	 * @description Get elements on state as array.
	 * @returns array of items on state.
	 */
	toArray(): Array<T> {
		return this.items;
	}

	/**
	 * @description Count total of items on state.
	 * @returns total of items on state.
	 */
	total(): number {
		return this.items.length;
	}
}

/**
 * @summary The result is used to returns a operation result instead the own value.
 * @interface IResult<T, D, M>;
 * @classdesc on `T` refer to type of the value and `D` type of the error and `M` metaData type.
 * @default D is string.
 * @default M is empty object {}.
 */
export class Result<T, D = string, M = {}> implements IResult<T, D, M> {

	private readonly _isSuccess: boolean;
	private readonly _isFailure: boolean;
	private readonly _data: T | null;
	private readonly _error: D | null;
	private readonly _metaData: M;

	private constructor(isSuccess: boolean, data?: T, error?: D, metaData?: M) {
		this._isSuccess = isSuccess;
		this._isFailure = !isSuccess;
		this._data = data ?? null;
		this._error = error ?? null;
		this._metaData = metaData ?? {} as M;
	}

	/**
	 * @description Create an instance of Result as success state with data and metadata to payload.
	 * @param data as T to payload.
	 * @param metaData as M to state.
	 * @returns instance of Result.
	 */
	public static success<T, D, M>(data: T, metaData?: M): Result<T, D, M> {
		return new Result(true, data, null, metaData) as unknown as Result<T, D, M>;
	}
	/**
	 * @description Create an instance of Result as failure state with error and metadata to payload.
	 * @param error as D to payload.
	 * @param metaData as M to state.
	 * @returns instance of Result.
	 */
	public static fail<T, D, M>( error: D, metaData?: M): Result<T, D, M> {
		return new Result(false, null, error, metaData) as unknown as Result<T, D, M>;
	}
	/**
	 * @description Create an instance of Iterator with array of Results on state.
	 * @param results as array of Results
	 * @returns instance of Iterator.
	 */
	public static iterate<A, B, M>(results?: Array<Result<A, B, M>>): IIterator<Result<A, B, M>> {
		return Iterator.create<Result<A, B, M>>({ initialData: results, returnCurrentOnReversion: true });
	}

	/**
	 * @description Check all results instances status. Returns the first failure or returns the first success one.
	 * @param results arrays with results instance.
	 * @returns instance of result.
	 * @default returns failure if provide a empty array.
	 */
	public static combine<A, B, M>(results: Array<Result<A, B, M>>): Result<A, B, M> {
		const iterator = this.iterate(results);
		if (iterator.isEmpty()) return Result.fail<A, B, M>('No results provided on combine param' as unknown as B);
		while (iterator.hasNext()) {
			const currentResult = iterator.next();
			if (currentResult.isFailure()) return currentResult;
		}
		return iterator.first();
	}

	/**
	 * @description Execute any command on fail or success.
	 * @param command instance of command that implements ICommand interface.
	 * @returns Command result as payload.
	 */
	execute<X, Y>(command: ICommand<X|void, Y>): IResultExecute<X, Y> {
		return {
			/**
			 * @description Use this option the command does not require arguments.
			 * @param option `success` or `fail`
			 * @returns command payload or undefined.
			 */
			on: (option: IResultOptions): Y | undefined => {
				if (option === 'success' && this.isSuccess()) return command.execute();
				if (option === 'fail' && this.isFailure()) return command.execute();
			},
			/**
			 * @description Use this option the command require arguments.
			 * @param data the same type your command require.
			 * @returns on function.
			 */
			withData: (data: X): IResultHook<Y> => {
				return {
					/**
					 * @description Use this option the command does not require arguments.
					 * @param option `success` or `fail`
					 * @returns command payload or undefined.
					 */
					on: (option: IResultOptions): Y | undefined => {
						if (option === 'success' && this.isSuccess()) return command.execute(data);
						if (option === 'fail' && this.isFailure()) return command.execute(data);
					}
				}
			}
		};
	}

	/**
	 * @description Get the instance value.
	 * @returns `data` T or `null` case result is failure.
	 */
	value(): T {
		return this._data as T;
	}
	/**
	 * @description Get the instance error.
	 * @returns `error` D or `null` case result is success.
	 */
	error(): D {
		return this._error as D;
	}

	/**
	 * @description Check if result instance is failure.
	 * @returns `true` case result instance failure or `false` case is success one.
	 */
	isFailure(): boolean {
		return this._isFailure;
	}

	/**
	 * @description Check if result instance is success.
	 * @returns `true` case result instance success or `false` case is failure one.
	 */
	isSuccess(): boolean {
		return this._isSuccess;
	}

	/**
	 * @description Get the instance metadata.
	 * @returns `metadata` M or `{}` result in case of empty object has no metadata value.
	 */
	metaData(): M {
		return this._metaData;
	}

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
	toObject(): IResultObject<T, D, M> {
		return {
			isSuccess: this._isSuccess,
			isFailure: this._isFailure,
			data: this._data as T | null,
			error: this._error as D | null,
			metaData: this._metaData as M
		}
	}
}

export class GettersAndSetters<Props> {
	protected props: Props;
	protected config: GetterAndSetterSettings;

	constructor(props: Props, config?: GetterAndSetterSettings) {
		this.props = props;
		this.config = config ?? {
			deactivateGetters: false,
			deactivateSetters: false,
			className: ''
		}
	}

	protected getter(key: keyof Props) {
		return this.props[key];
	}

	/**
	 * 
	 * @param key the property key you want to get
	 * @returns the value of property
	 */
	get(key: keyof Props) {
		if (this.config?.deactivateGetters) return null as unknown as Props[keyof Props];
		return this.props[key];
	}

	/**
	 * 
	 * @param key the property you want to set.
	 * @returns toValue function asking the value you want to set.
	 */
	set<Key extends keyof Props>(key: Key) {
		return {
			/**
			 * 
			 * @param value the value you want to apply.
			 * @param validation function to validate the value before apply. The value will be applied only if to pass on validation.
			 * @example 
			 * (value: PropValue) => boolean;
			 * @returns instance of this.
			 */
			toValue: (value: Props[Key], validation?: (value: Props[Key]) => boolean) => {
				if (this.config?.deactivateSetters) return this;
				if (typeof validation === 'function') {
					if (!validation(value)) return this;
				}
				this.props[key] = value;
				return this;
			}
		}
	}
	/**
	 * 
	 * @param key the property you want to set.
	 * @param value the value to apply to the key.
	 * @param validation function to validate the value before apply. The value will be applied only if to pass.
	 * @returns instance of own class.
	 */
	updateTo<Key extends keyof Props>(key: Key, value: Props[Key], validation?: (value: Props[Key]) => boolean) {
		if (this.config?.deactivateSetters) return this;
		if (typeof validation === 'function') {
			if (!validation(value)) return this;
		}
		this.props[key] = value;
		return this;
	}
}

export class ID<T = string> implements IDomainID<T> {
	private _value: T;
	private _isNew: boolean;
	private _createdAt: Date;
	private readonly MAX_SIZE: number = 16;

	private constructor(id?: T) {
		this._createdAt = new Date();
		if (typeof id === 'undefined') {
			const uuid = randomUUID();
			this._value = uuid as unknown as T;
			this._isNew = true;
			return this;
		}
		this._value = id as unknown as T;;
		this._isNew = false;
		return this;
	};

	private setAsNew(): void {
		this._isNew = true;
	}

	/**
	 * @description Update id value to a short value one. 16bytes.
	 * @returns instance of ID with short value. 16bytes
	 */
	toShort():IDomainID<T> {
		let short = '';
		let longValue = this._value as unknown as string;
		
		if (longValue.length < this.MAX_SIZE) {
			longValue = randomUUID() + longValue;
		}

		longValue = longValue.toUpperCase().replace(/-/g, '');
		const chars = longValue.split('');

		while (short.length < this.MAX_SIZE) {
			const lastChar = chars.pop();
			short = lastChar + short;
		}
		this._createdAt = new Date();
		this._value = short as unknown as T;
		return this as unknown as IDomainID<T>;
	}

	/**
	 * @description Get the id value.
	 * @returns id value as string or number.
	 */
	get value(): T {
		return this._value;
	}

	/**
	 * @description Check if id instance is a new one.
	 * @returns `true` if id instance is new or `false` if not.
	 * @example 
	 * ID.create("some-value") // this is not a new because on create you provided string value as param.
	 * 
	 * @example 
	 * ID.create() // this is a new one because none args was provided.
	 */
	get isNew(): boolean {
		return this._isNew;
	}

	/**
	 * @description Get created date
	 * @returns date
	 */
	get createdAt(): Date {
		return this._createdAt;
	}

	/**
	 * @description Check if id instance is short. 16bytes
	 * @returns `true` if id instance has short value and 'false` cause not.
	 */
	isShortID(): boolean {
		if (typeof this._value !== 'string') return false;
		return this._value.toString().length === this.MAX_SIZE;
	}

	/**
	 * @description Compare value from instance and provided id.
	 * @param id instance of ID
	 * @returns `true` if provided id value and instance value has the same value and `false` if not.
	 */
	equal(id: IDomainID<any>): boolean {
		if (typeof this._value === typeof id.value) 
			return this._value as any === id.value as any;
		return false;
	}
	
	/**
	 * @description Deep comparative. Compare value and serialized instances.
	 * @param id instance of ID
	 * @returns `true` if provided id and instance is equal and `false` if not.
	 */
	deepEqual(id: IDomainID<any>): boolean {
		if (typeof this._value !== typeof id.value) return false;
		const A = JSON.stringify(this);
		const B = JSON.stringify(id);
		return A === B;
	}

	/**
	 * @description Create a clone from instance. This function does not change instance state.
	 * @returns a cloned instance with the same properties and value.
	 */
	cloneAsNew(): IDomainID<T> {
		const newUUID = new ID<T>(this._value);
		newUUID.setAsNew();
		return newUUID as unknown as IDomainID<T>;
	}
	/**
	 * @description Create a clone from instance. This function does not change instance state.
	 * @returns a cloned instance with the same value.
	 */
	clone(): IDomainID<T> {
		return new ID(this._value) as unknown as IDomainID<T>;
	}

	/**
	 * @description Create a short id. 16bytes.
	 * @param id value as string optional.If you do not provide a value a new id value will be generated.
	 * @returns instance of ID.
	 */
	public static createShort(id?: string): IDomainID<string> {
		const _id = new ID(id);
		if (typeof id === 'undefined') _id.setAsNew();
		_id.toShort();
		return _id;
	};

	/**
	 * @description Create a short id.
	 * @param id value as string optional.If you do not provide a value a new uuid value will be generated.
	 * @returns instance of ID.
	 */
	public static create<T = string | number>(id?: T): IDomainID<T> {
		return new ID(id) as unknown as IDomainID<T>;
	}
}

/**
 * @description Entity identified by an id
 */
export class Entity<Props extends {}> extends GettersAndSetters<Props> {
	protected props: Props;
	private _id: IDomainID<string>;
	public static validator: ValidateType = ValidateType.create();
	public validator: ValidateType = ValidateType.create();

	constructor(props: Props, id?: string, config?: GetterAndSetterSettings) { 
		super(props, config);
		this.props = props;
		this._id = ID.create(id);
	}

	/**
	 * @description Get id as ID instance
	 * @returns ID instance
	 */
	get id(): IDomainID<string> {
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
	hashCode(): IDomainID<string> {
		return ID.create(`[Entity@${this.config?.className??''}]:${this.id.value}`);
	}

	/**
	 * @description Check if an entity is a new instance.
	 * @returns `true` if entity is a new instance generated and `false` if not.
	 * @summary new instance: not saved on database yet.
	 */
	isNew(): boolean {
		return this.id.isNew;
	}

	/**
	 * @description Method to validate prop value.
	 * @param value to validate
	 */
	public static isValidValue(value: any): boolean {
		return !this.validator.isUndefined(value) && !this.validator.isNull(value);
	};

	/**
	 * 
	 * @param props params as Props
	 * @param id optional uuid as string, second arg. If not provided a new one will be generated.
	 * @returns instance of result with a new Entity on state if success.
	 * @summary result state will be `null` case failure.
	 */
	public static create(props: any, id?: string): IResult<Entity<any>, any, any> {
		if(!this.isValidValue(props)) return Result.fail('Props are required to create an instance of ' + this.name);
		return Result.success(new this(props, id));
	};
}

/**
 * @description Aggregate identified by an id
 */
export class Aggregate<Props extends OBJ> extends Entity<Props> {

	constructor(props: Props, id?: string, config?: GetterAndSetterSettings) { 
		super(props, id, config);
	}

	/**
	 * @description Get hash to identify the aggregate.
	 * @returns Aggregate hash as ID instance.
	 * @example 
	 * `[Aggregate@ClassName]:UUID`
	 * 
	 * @summary className is defined on constructor config param
	 */
	public hashCode(): IDomainID<string> {
		return ID.create(`[Aggregate@${this.config?.className??''}]:${this.id.value}`);
	}
	
	/**
	 * 
	 * @param props params as Props
	 * @param id optional uuid as string, second arg. If not provided a new one will be generated.
	 * @returns instance of result with a new Aggregate on state if success.
	 * @summary result state will be `null` case failure.
	 */
	public static create(props: any, id?: string): IResult<Aggregate<any>, any, any> {
		if(!this.isValidValue(props)) return Result.fail('Props are required to create an instance of ' + this.name);
		return Result.success(new this(props, id));
	};
}

/**
 * @description ValueObject an attribute for entity and aggregate
 */
export class ValueObject<Props extends OBJ> extends GettersAndSetters<Props> {
	protected props: Props;
	public static validator: ValidateType = ValidateType.create();
	public validator: ValidateType = ValidateType.create();

	constructor(props: Props, config?: GetterAndSetterSettings) {
		super(props, config);
		this.props = props;
	}
	
	/**
	 * @description Method to validate prop value.
	 * @param value to validate
	 */
	public static isValidValue(value: any): boolean {
		return !this.validator.isUndefined(value) && !this.validator.isNull(value);
	};

	/**
	 * 
	 * @param props params as Props
	 * @returns instance of result with a new Value Object on state if success.
	 * @summary result state will be `null` case failure.
	 */
	public static create(props: any): IResult<ValueObject<any>, any, any> {
		if (!this.isValidValue(props)) return Result.fail('Props are required to create an instance of ' + this.name);
		return Result.success(new this(props));
	};
}
