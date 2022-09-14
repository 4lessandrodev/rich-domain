import { UUID } from './crypto';
import { UID } from "../types";

/**
 * @description Identity to Entity and Aggregates
 * @method create
 * @param value as string
 */
export class ID<T = string> implements UID<T> {
	private _value: string;
	private _isNew: boolean;
	private _createdAt: Date;
	private readonly MAX_SIZE: number = 16;

	private constructor(id?: T) {
		this._createdAt = new Date();
		if (typeof id === 'undefined') {
			const uuid = UUID();
			this._value = uuid;
			this._isNew = true;
			return this;
		}
		const isString = typeof id === 'string';
		this._value = isString ? id as unknown as string : String(id);
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
	toShort(): UID<string> {
		let short = '';
		let longValue = this._value;

		if (longValue.length < this.MAX_SIZE) {
			longValue = UUID() + longValue;
		}

		longValue = longValue.toUpperCase().replace(/-/g, '');
		const chars = longValue.split('');

		while (short.length < this.MAX_SIZE) {
			const lastChar = chars.pop();
			short = lastChar + short;
		}
		this._createdAt = new Date();
		this._value = short;
		return this as unknown as UID<string>;
	}

	/**
	 * @description Get the id value.
	 * @returns id value as string or number.
	 */
	value(): string {
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
	isNew(): boolean {
		return this._isNew;
	}

	/**
	 * @description Get created date
	 * @returns date
	 */
	createdAt(): Date {
		return this._createdAt;
	}

	/**
	 * @description Check if id instance is short. 16bytes
	 * @returns `true` if id instance has short value and 'false` cause not.
	 */
	isShort(): boolean {
		return this._value.length === this.MAX_SIZE;
	}

	/**
	 * @description Compare value from instance and provided id.
	 * @param id instance of ID
	 * @returns `true` if provided id value and instance value has the same value and `false` if not.
	 */
	equal(id: UID<any>): boolean {
		return (typeof this._value === typeof id.value()) && (this._value as any === id.value());
	}

	/**
	 * @description Deep comparative. Compare value and serialized instances.
	 * @param id instance of ID
	 * @returns `true` if provided id and instance is equal and `false` if not.
	 */
	deepEqual(id: UID<any>): boolean {
		const A = JSON.stringify(this);
		const B = JSON.stringify(id);
		return A === B;
	}

	/**
	 * @description Create a clone from instance. This function does not change instance state.
	 * @returns a cloned instance with the same properties and value.
	 */
	cloneAsNew(): UID<string> {
		const newUUID = new ID<string>(this._value);
		newUUID.setAsNew();
		return newUUID;
	}
	/**
	 * @description Create a clone from instance. This function does not change instance state.
	 * @returns a cloned instance with the same value.
	 */
	clone(): UID<T> {
		return new ID(this._value) as unknown as UID<T>;
	}

	/**
	 * @description Create a short id. 16bytes.
	 * @param id value as string optional.If you do not provide a value a new id value will be generated.
	 * @returns instance of ID.
	 */
	public static short(id?: string | number): UID<string> {
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
	public static create<T = string | number>(id?: T): UID<string> {
		return new ID(id) as unknown as UID<string>;
	}
}

export default ID;
