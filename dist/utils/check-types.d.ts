export declare class ValidateType {
    private static instance;
    private constructor();
    static create(): ValidateType;
    isArray(props: any): boolean;
    isString(props: any): boolean;
    isNumber(props: any): boolean;
    isDate(props: any): boolean;
    isObject(props: any): boolean;
    isNull(props: any): boolean;
    isUndefined(props: any): boolean;
    isBoolean(props: any): boolean;
    isFunction(props: any): boolean;
    isEntity(props: any): boolean;
    isAggregate(props: any): boolean;
    isValueObject(props: any): boolean;
    isSymbol(props: any): boolean;
    isID(props: any): boolean;
    number(target: number): {
        isEqualTo: (value: number) => boolean;
        isGreaterThan: (value: number) => boolean;
        isLessThan: (value: number) => boolean;
        isLessOrEqualTo: (value: number) => boolean;
        isGreaterOrEqualTo: (value: number) => boolean;
        isSafeInteger: () => boolean;
        isPositive: () => boolean;
        isNegative: () => boolean;
        isPair: () => boolean;
        isInteger: () => boolean;
        isBetween: (min: number, max: number) => boolean;
    };
    string(target: string): {
        hasLengthGreaterThan: (length: number) => boolean;
        hasLengthGreaterOrEqualTo: (length: number) => boolean;
        hasLengthLessThan: (length: number) => boolean;
        hasLengthLessOrEqualTo: (length: number) => boolean;
        hasLengthEqualTo: (length: number) => boolean;
        hasLengthBetween: (min: number, max: number) => boolean;
        includes: (value: string) => boolean;
        isEmpty: () => boolean;
    };
    date(target: Date): {
        isBeforeThan: (value: Date) => boolean;
        isBeforeOrEqualTo: (value: Date) => boolean;
        isAfterNow: () => boolean;
        isBeforeNow: () => boolean;
        isBetween: (start: Date, end: Date) => boolean;
        isWeekend: () => boolean;
        isAfterThan: (value: Date) => boolean;
        isAfterOrEqualTo: (value: Date) => boolean;
    };
}
