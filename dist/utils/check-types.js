"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateType = void 0;
const core_1 = require("../core");
class ValidateType {
    constructor() { }
    static create() {
        if (!ValidateType.instance) {
            this.instance = new ValidateType();
        }
        return this.instance;
    }
    isArray(props) {
        return Array.isArray(props);
    }
    isString(props) {
        return typeof props === 'string';
    }
    isNumber(props) {
        return typeof props === 'number';
    }
    isDate(props) {
        return props instanceof Date;
    }
    isObject(props) {
        try {
            const isObj = typeof props === 'object';
            if (!isObj || props === null)
                return false;
            if (JSON.stringify(props) === JSON.stringify({}))
                return true;
            const hasKeys = Object.keys(props).length > 0;
            const isNotArray = !this.isArray(props);
            const isNotEntity = !this.isEntity(props);
            const isNotAggregate = !this.isAggregate(props);
            const isNotValueObject = !this.isValueObject(props);
            const isNotId = !this.isID(props);
            return hasKeys && isNotAggregate && isNotArray && isNotEntity && isNotValueObject && isNotId;
        }
        catch (error) {
            return false;
        }
    }
    isNull(props) {
        return props === null;
    }
    isUndefined(props) {
        return typeof props === 'undefined';
    }
    isBoolean(props) {
        return typeof props === 'boolean';
    }
    isFunction(props) {
        return typeof props === 'function';
    }
    isEntity(props) {
        const isEntity = props instanceof core_1.Entity;
        return !this.isAggregate(props) && isEntity;
    }
    isAggregate(props) {
        return props instanceof core_1.Aggregate;
    }
    isValueObject(props) {
        return props instanceof core_1.ValueObject;
    }
    isSymbol(props) {
        return typeof props === 'symbol';
    }
    isID(props) {
        return props instanceof core_1.ID;
    }
    number(target) {
        return {
            isEqualTo: (value) => target === value,
            isGreaterThan: (value) => value > target,
            isLessThan: (value) => value < target,
            isLessOrEqualTo: (value) => value <= target,
            isGreaterOrEqualTo: (value) => value >= target,
            isSafeInteger: () => target <= Number.MAX_SAFE_INTEGER && target >= Number.MIN_SAFE_INTEGER,
            isPositive: () => target >= 0,
            isNegative: () => target < 0,
            isPair: () => target % 2 === 0,
            isInteger: () => target - Math.trunc(target) === 0,
            isBetween: (min, max) => target < max && target > min
        };
    }
    string(target) {
        return {
            hasLengthGreaterThan: (length) => target.length > length,
            hasLengthGreaterOrEqualTo: (length) => target.length >= length,
            hasLengthLessThan: (length) => target.length < length,
            hasLengthLessOrEqualTo: (length) => target.length <= length,
            hasLengthEqualTo: (length) => target.length === length,
            hasLengthBetween: (min, max) => target.length >= min && target.length <= max,
            includes: (value) => target.includes(value) || value.split('').map((char) => target.includes(char)).includes(true),
            isEmpty: () => (target === null || target === void 0 ? void 0 : target.trim()) === '',
        };
    }
    date(target) {
        return {
            isBeforeThan: (value) => target.getTime() < value.getTime(),
            isBeforeOrEqualTo: (value) => target.getTime() <= value.getTime(),
            isAfterNow: () => target.getTime() > Date.now(),
            isBeforeNow: () => target.getTime() < Date.now(),
            isBetween: (start, end) => target.getTime() > start.getTime() &&
                target.getTime() < end.getTime(),
            isWeekend: () => target.getDay() === 0 || target.getDay() === 6,
            isAfterThan: (value) => target.getTime() > value.getTime(),
            isAfterOrEqualTo: (value) => target.getTime() >= value.getTime(),
        };
    }
}
exports.ValidateType = ValidateType;
