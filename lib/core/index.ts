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
	ITeratorConfig
} from "../index.types";
import { ValidateType } from '../utils/check-types';

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

	public static create<U>(config?: ITeratorConfig<U>): Iterator<U> {
		return new Iterator<U>(config);
	}

	hasNext(): boolean {
		if (this.isEmpty()) return false;
		return (this.currentIndex + 1) < this.items.length;
	}

	hasPrev(): boolean {
		if (this.isEmpty()) return false;
		return (this.currentIndex - 1) >= 0;
	}

	isEmpty(): boolean {
		return this.total() === 0;
	}

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

	first(): T {
		return this.items.at(0) as T;
	}

	last(): T {
		return this.items.at(-1) as T;
	}

	toFirst(): Iterator<T> {
		if (this.currentIndex === 0 || this.currentIndex === -1) {
			this.currentIndex = -1;
			return this;
		}
		this.currentIndex = 0;
		return this;
	}

	toLast(): Iterator<T> {
		if (this.currentIndex === this.total() - 1 || this.currentIndex === -1) {
			this.currentIndex = this.total();
			return this;
		}
		this.currentIndex = this.total() - 1;
		return this;
	}

	clear(): Iterator<T> {
		this.items.splice(0, this.total())
		this.currentIndex = -1;
		return this;
	}

	addToEnd(data: T): Iterator<T> {
		this.items.push(data);
		return this;
	}

	add(data: T): Iterator<T> {
		return this.addToEnd(data);
	}

	addToStart(data: T): Iterator<T> {
		this.currentIndex = -1;
		this.items.unshift(data);
		return this;
	}

	removeLast(): Iterator<T> {
		if (this.currentIndex >= this.total()) this.currentIndex -= 1;
		this.items.pop();
		return this;
	}

	removeFirst(): Iterator<T> {
		if (this.currentIndex > 0) this.currentIndex -= 1;
		this.items.shift();
		return this;
	}

	toArray(): Array<T> {
		return this.items;
	}

	total(): number {
		return this.items.length;
	}
}

/**
 * @summary The result is used to returns a operation result instead the own value.
 * @interface IResult<T, D>;
 * @classdesc on `T` refer to type of the value and `D` type of the error.
 */
export class Result<T, D = string, M = {}> implements IResult<T, D> {

	private readonly _isSuccess: boolean;
	private readonly _isFailure: boolean;
	private readonly _data: T | null;
	private readonly _error: D | null;
	private readonly _metaData: any;

	private constructor(isSuccess: boolean, data?: T, error?: D, metaData?: M) {
		this._isSuccess = isSuccess;
		this._isFailure = !isSuccess;
		this._data = data ?? null;
		this._error = error ?? null;
		this._metaData = metaData ?? {};
	}

	public static success<T, D, M>(data: T, metaData?: any): Result<T, D, M> {
		return new Result(true, data, null, metaData) as unknown as Result<T, D, M>;
	}

	public static fail<T, D, M>( error: D, metaData?: M): Result<T, D, M> {
		return new Result(false, null, error, metaData) as unknown as Result<T, D, M>;
	}

	public static iterate<A, B, M>(results?: Array<Result<A, B, M>>): IIterator<Result<A, B, M>> {
		return Iterator.create<Result<A, B, M>>({ initialData: results, returnCurrentOnReversion: true });
	}

	public static combine<A, B, M>(results: Array<Result<A, B, M>>): Result<A, B, M> {
		const iterator = this.iterate(results);
		if (iterator.isEmpty()) return Result.fail<A, B, M>('No results provided on combine param' as unknown as B);
		while (iterator.hasNext()) {
			const currentResult = iterator.next();
			if (currentResult.isFailure()) return currentResult;
		}
		return iterator.first();
	}

	execute<X, Y>(command: ICommand<X|void, Y>): IResultExecute<X, Y> {
		return {
			on: (option: IResultOptions): Y | undefined => {
				if (option === 'success' && this.isSuccess()) return command.execute();
				if (option === 'fail' && this.isFailure()) return command.execute();
			},
			withData: (data: X): IResultHook<Y> => {
				return {
					on: (option: IResultOptions): Y | undefined => {
						if (option === 'success' && this.isSuccess()) return command.execute(data);
						if (option === 'fail' && this.isFailure()) return command.execute(data);
					}
				}
			}
		};
	}

	value(): T {
		return this._data as T;
	}

	error(): D {
		return this._error as D;
	}

	isFailure(): boolean {
		return this._isFailure;
	}

	isSuccess(): boolean {
		return this._isSuccess;
	}

	metaData(): M {
		return this._metaData;
	}

	toObject<T, D, M>(): IResultObject<T, D, M> {
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

		this._value = short as unknown as T;;
		return this as unknown as IDomainID<T>;
	}

	get value(): T {
		return this._value;
	}

	get isNew(): boolean {
		return this._isNew;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	isShortID(): boolean {
		if (typeof this._value !== 'string') return false;
		return this._value.toString().length === this.MAX_SIZE;
	}

	equal(id: IDomainID<any>): boolean {
		if (typeof this._value === typeof id.value) 
			return this._value as any === id.value as any;
		return false;
	}
	
	deepEqual(id: IDomainID<any>): boolean {
		if (typeof this._value !== typeof id.value) return false;
		const A = JSON.stringify(this);
		const B = JSON.stringify(id);
		return A === B;
	}

	cloneAsNew(): IDomainID<T> {
		const newUUID = new ID<T>(this._value);
		newUUID.setAsNew();
		return newUUID as unknown as IDomainID<T>;
	}

	clone(): IDomainID<T> {
		return new ID(this._value) as unknown as IDomainID<T>;
	}

	public static createShort(id?: string): IDomainID<string> {
		const _id = new ID(id);
		if (typeof id === 'undefined') _id.setAsNew();
		_id.toShort();
		return _id;
	};

	public static create<T = string | number>(id?: T): IDomainID<T> {
		return new ID(id) as unknown as IDomainID<T>;
	}
}

export abstract class Entity<Props extends {}> extends GettersAndSetters<Props> {
	protected props: Props;
	private _id: IDomainID<string>;
	public static validator: ValidateType = ValidateType.create();
	public validator: ValidateType = ValidateType.create();

	constructor(props: Props, id?: string, config?: GetterAndSetterSettings) { 
		super(props, config);
		this.props = props;
		this._id = ID.create(id);
	}

	get id(): IDomainID<string> {
		return this._id;
	}

	hashCode(): IDomainID<string> {
		return ID.create(`[Entity@${this.config?.className??''}]:${this.id.value}`);
	}

	isNew(): boolean {
		return this.id.isNew;
	}

	public static create(props: {}, id?: string): IResult<Entity<any>, string> {
		return Result.fail('Static method [create] not implemented on entity ' + this.name);
	};
}

export abstract class Aggregate<Props extends {}> extends Entity<Props> {

	constructor(props: Props, id?: string, config?: GetterAndSetterSettings) { 
		super(props, id, config);
	}

	public hashCode(): IDomainID<string> {
		return ID.create(`[Aggregate@${this.config?.className??''}]:${this.id.value}`);
	}
	
	public static create(props: {}, id?: string): IResult<Aggregate<any>, string> {
		return Result.fail('Static method [create] not implemented on aggregate ' + this.name);
	};
}

export abstract class ValueObject<Props> extends GettersAndSetters<Props> {
	protected props: Props;
	public static validator: ValidateType = ValidateType.create();
	public validator: ValidateType = ValidateType.create();

	constructor(props: Props, config?: GetterAndSetterSettings) {
		super(props, config);
		this.props = props;
	}
	
	public static isValidValue(props: {}): boolean {
		throw new Error('Static method [isValidValue] not implemented on ' + this.name)
	};

	public static create(props: {}): IResult<ValueObject<any>, string> {
		return Result.fail('Static method [create] not implemented on aggregate ' + this.name);
	};
}
