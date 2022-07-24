import { Aggregate, Entity, ID, ValueObject } from "../core";

export class Validator {
	private static instance: Validator;
	private constructor() { }

	public static create(): Validator {
		if (!Validator.instance) {
			this.instance = new Validator();
		}
		return this.instance;
	}

	isArray(props: any): boolean {
		return Array.isArray(props);
	}
	isString(props: any): boolean {
		return typeof props === 'string';
	}
	isNumber(props: any): boolean {
		return typeof props === 'number';
	}
	isDate(props: any): boolean {
		return props instanceof Date;
	}
	isObject(props: any): boolean {
		const isObj = typeof props === 'object';
		if (!isObj || props === null) return false;
		if (JSON.stringify(props) === JSON.stringify({})) return true;
		const hasKeys = Object.keys(props).length > 0;
		const isNotArray = !this.isArray(props);
		const isNotEntity = !this.isEntity(props);
		const isNotAggregate = !this.isAggregate(props);
		const isNotValueObject = !this.isValueObject(props);
		const isNotId = !this.isID(props);
		return hasKeys && isNotAggregate && isNotArray && isNotEntity && isNotValueObject && isNotId;
	}
	isNull(props: any): boolean {
		return props === null;
	}
	isUndefined(props: any): boolean {
		return typeof props === 'undefined';
	}
	isBoolean(props: any): boolean {
		return typeof props === 'boolean';
	}
	isFunction(props: any): boolean {
		return typeof props === 'function';
	}
	isEntity(props: any): boolean {
		const isEntity = props instanceof Entity;
		return !this.isAggregate(props) && isEntity;
	}
	isAggregate(props: any): boolean {
		return props instanceof Aggregate;
	}
	isValueObject(props: any): boolean {
		return props instanceof ValueObject;
	}
	isSymbol(props: any): boolean {
		return typeof props === 'symbol';
	}
	isID(props: any): boolean {
		return props instanceof ID;
	}
	number(target: number) {
		return {
			isEqualTo: (value: number): boolean => this.isNumber(target) && this.isNumber(value) && target === value,
			isGreaterThan: (value: number): boolean => this.isNumber(target) && this.isNumber(value) && target > value,
			isLessThan: (value: number): boolean => this.isNumber(target) && this.isNumber(value) && target < value,
			isLessOrEqualTo: (value: number): boolean => this.isNumber(target) &&
				this.isNumber(value) && target <= value,
			isGreaterOrEqualTo: (value: number): boolean => this.isNumber(target) &&
				this.isNumber(value) && target >= value,
			isSafeInteger: (): boolean => this.isNumber(target) &&
				target <= Number.MAX_SAFE_INTEGER && target >= Number.MIN_SAFE_INTEGER,
			isPositive: (): boolean => this.isNumber(target) && target >= 0,
			isNegative: (): boolean => this.isNumber(target) && target < 0,
			isPair: (): boolean => this.isNumber(target) && target % 2 === 0,
			isInteger: (): boolean => this.isNumber(target) && target - Math.trunc(target) === 0,
			isBetween: (min: number, max: number): boolean => this.isNumber(target) && target < max && target > min
		}
	}
	string(target: string) {
		return {
			hasLengthGreaterThan: (length: number): boolean => this.isString(target) && target.length > length,
			hasLengthGreaterOrEqualTo: (length: number): boolean => this.isString(target) && target.length >= length,
			hasLengthLessThan: (length: number): boolean => this.isString(target) && target.length < length,
			hasLengthLessOrEqualTo: (length: number): boolean => this.isString(target) && target.length <= length,
			hasLengthEqualTo: (length: number): boolean => this.isString(target) && target.length === length,
			hasLengthBetween: (min: number, max: number): boolean => this.isString(target) &&
				target.length >= min && target.length <= max,
			includes: (value: string): boolean => this.isString(target) && target.includes(value) || value.split('').map((char) => target.includes(char)).includes(true),
			isEmpty: (): boolean => (this.isUndefined(target) ||
				this.isNull(target)) ||
				(this.isString(target) &&
					target.trim() === ''),
			match:(regex: RegExp): boolean => regex.test(target)
		}
	}
	date(target: Date) {
		return {
			isBeforeThan: (value: Date): boolean => (this.isDate(target) &&
				this.isDate(value)) && target.getTime() < value.getTime(),
			isBeforeOrEqualTo: (value: Date): boolean => (this.isDate(target) &&
				this.isDate(value)) && target.getTime() <= value.getTime(),
			isAfterNow: (): boolean => this.isDate(target) && target.getTime() > Date.now(),
			isBeforeNow: (): boolean => this.isDate(target) && target.getTime() < Date.now(),
			isBetween: (start: Date, end: Date): boolean => this.isDate(target) &&
				target.getTime() > start.getTime() &&
				target.getTime() < end.getTime(),
			isWeekend: (): boolean => this.isDate(target) && target.getDay() === 0 ||
				this.isDate(target) && target.getDay() === 6,
			isAfterThan: (value: Date): boolean => (this.isDate(target) &&
				this.isDate(value)) && target.getTime() > value.getTime(),
			isAfterOrEqualTo: (value: Date): boolean => (this.isDate(target) &&
				this.isDate(value)) && target.getTime() >= value.getTime(),
		}
	}
}
