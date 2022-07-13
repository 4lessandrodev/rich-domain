import { Aggregate, Entity, ID, ValueObject } from "../core";

export class ValidateType {
	private static instance: ValidateType;
	private constructor() {}

	public static create(): ValidateType {
		if (!ValidateType.instance) {
			this.instance = new ValidateType();
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
		try {
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
				
		} catch (error) {
			return false;	
		}
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
			isEqualTo: (value: number): boolean => target === value,
			isGreaterThan: (value: number): boolean => value > target,
			isLessThan: (value: number): boolean => value < target,
			isLessOrEqualTo: (value: number): boolean => value <= target,
			isGreaterOrEqualTo: (value: number): boolean => value >= target,
			isSafeInteger: (): boolean => target <= Number.MAX_SAFE_INTEGER && target >= Number.MIN_SAFE_INTEGER,
			isPositive: (): boolean => target >= 0,
			isNegative: (): boolean => target < 0,
			isPair: (): boolean => target % 2 === 0,
			isInteger: (): boolean => target - Math.trunc(target) === 0,
		}
	}
	string(target: string) {
		return {
			hasLengthGreaterThan: (length: number): boolean => target.length > length,
			hasLengthGreaterOrEqualTo: (length: number): boolean => target.length >= length,
			hasLengthLessThan: (length: number): boolean => target.length < length,
			hasLengthLessOrEqualTo: (length: number): boolean => target.length <= length,
			hasLengthEqualTo: (length: number): boolean => target.length === length,
			hasLengthBetween: (min: number, max: number): boolean => target.length >= min && target.length <= max,
			includes: (value: string): boolean => target.includes(value) || value.split('').map((char) => target.includes(char)).includes(true),
			isEmpty: (): boolean => target?.trim() === '',
		}
	}
	date(target: Date) {
		return {
			isBeforeThan: (value: Date): boolean => target.getTime() < value.getTime(),
			isBeforeOrEqualTo: (value: Date): boolean => target.getTime() <= value.getTime(),
			isAfterNow:(): boolean => target.getTime() > Date.now(),
			isBeforeNow:(): boolean => target.getTime() < Date.now(),
			isBetween: (start: Date, end: Date): boolean => target.getTime() > start.getTime() &&
				target.getTime() < end.getTime(),
			isWeekend: (): boolean => target.getDay() === 0 || target.getDay() === 6,
			isAfterThan: (value: Date): boolean => target.getTime() > value.getTime(),
			isAfterOrEqualTo: (value: Date): boolean => target.getTime() >= value.getTime(),
		}
	}
}
