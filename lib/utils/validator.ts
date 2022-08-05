import { Aggregate, Entity, ID, ValueObject } from "../core";

export class Validator {
	private static instance: Validator = null as unknown as Validator;
	private constructor() { }

	public static create(): Validator {
		if (!Validator.instance) {
			Validator.instance = new Validator();
		}
		return Validator.instance;
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
		const isNotArray = !Validator.instance.isArray(props);
		const isNotEntity = !Validator.instance.isEntity(props);
		const isNotAggregate = !Validator.instance.isAggregate(props);
		const isNotValueObject = !Validator.instance.isValueObject(props);
		const isNotId = !Validator.instance.isID(props);
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
		return !Validator.instance.isAggregate(props) && isEntity;
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
			isEqualTo: (value: number): boolean => Validator.instance.isNumber(target) && Validator.instance.isNumber(value) && target === value,
			isGreaterThan: (value: number): boolean => Validator.instance.isNumber(target) && Validator.instance.isNumber(value) && target > value,
			isLessThan: (value: number): boolean => Validator.instance.isNumber(target) && Validator.instance.isNumber(value) && target < value,
			isLessOrEqualTo: (value: number): boolean => Validator.instance.isNumber(target) &&
				Validator.instance.isNumber(value) && target <= value,
			isGreaterOrEqualTo: (value: number): boolean => Validator.instance.isNumber(target) &&
				Validator.instance.isNumber(value) && target >= value,
			isSafeInteger: (): boolean => Validator.instance.isNumber(target) &&
				target <= Number.MAX_SAFE_INTEGER && target >= Number.MIN_SAFE_INTEGER,
			isPositive: (): boolean => Validator.instance.isNumber(target) && target >= 0,
			isNegative: (): boolean => Validator.instance.isNumber(target) && target < 0,
			isPair: (): boolean => Validator.instance.isNumber(target) && target % 2 === 0,
			isInteger: (): boolean => Validator.instance.isNumber(target) && target - Math.trunc(target) === 0,
			isBetween: (min: number, max: number): boolean => Validator.instance.isNumber(target) && target < max && target > min
		}
	}
	string(target: string) {
		return {
			hasLengthGreaterThan: (length: number): boolean => Validator.instance.isString(target) && target.length > length,
			hasLengthGreaterOrEqualTo: (length: number): boolean => Validator.instance.isString(target) && target.length >= length,
			hasLengthLessThan: (length: number): boolean => Validator.instance.isString(target) && target.length < length,
			hasLengthLessOrEqualTo: (length: number): boolean => Validator.instance.isString(target) && target.length <= length,
			hasLengthEqualTo: (length: number): boolean => Validator.instance.isString(target) && target.length === length,
			hasLengthBetween: (min: number, max: number): boolean => Validator.instance.isString(target) &&
				target.length >= min && target.length <= max,
			includes: (value: string): boolean => Validator.instance.isString(target) && target.includes(value) || value.split('').map((char) => target.includes(char)).includes(true),
			isEmpty: (): boolean => (Validator.instance.isUndefined(target) ||
				Validator.instance.isNull(target)) ||
				(Validator.instance.isString(target) &&
					target.trim() === ''),
			match:(regex: RegExp): boolean => regex.test(target)
		}
	}
	date(target: Date) {
		return {
			isBeforeThan: (value: Date): boolean => (Validator.instance.isDate(target) &&
				Validator.instance.isDate(value)) && target.getTime() < value.getTime(),
			isBeforeOrEqualTo: (value: Date): boolean => (Validator.instance.isDate(target) &&
				Validator.instance.isDate(value)) && target.getTime() <= value.getTime(),
			isAfterNow: (): boolean => Validator.instance.isDate(target) && target.getTime() > Date.now(),
			isBeforeNow: (): boolean => Validator.instance.isDate(target) && target.getTime() < Date.now(),
			isBetween: (start: Date, end: Date): boolean => Validator.instance.isDate(target) &&
				target.getTime() > start.getTime() &&
				target.getTime() < end.getTime(),
			isWeekend: (): boolean => Validator.instance.isDate(target) && target.getDay() === 0 ||
				Validator.instance.isDate(target) && target.getDay() === 6,
			isAfterThan: (value: Date): boolean => (Validator.instance.isDate(target) &&
				Validator.instance.isDate(value)) && target.getTime() > value.getTime(),
			isAfterOrEqualTo: (value: Date): boolean => (Validator.instance.isDate(target) &&
				Validator.instance.isDate(value)) && target.getTime() >= value.getTime(),
		}
	}
}

export default Validator.create();
