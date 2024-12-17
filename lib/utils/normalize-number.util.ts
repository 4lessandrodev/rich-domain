import IsNaN from "./is-nan.util";

/**
 * @description Normalizes a value into a floating-point number (`float`). 
 * If the value is a string representation of a number, it parses it into a `float`. 
 * If the value is already a number, it returns the value as is. 
 * If the value is invalid (`NaN` or non-numeric), it returns `0`.
 * 
 * @param value The input value to normalize. Can be a string or a number.
 * 
 * @returns A floating-point number representation of the input, or `0` if the input is invalid.
 * 
 * @example
 * ```typescript
 * Float("123.45"); // Returns 123.45
 * Float(678.90); // Returns 678.9
 * Float("invalid"); // Returns 0
 * Float(NaN); // Returns 0
 * ```
 */
export const Float = (value: number): number => {
    if (typeof value === 'string' && !IsNaN(value)) return parseFloat(value);
    if (typeof value === 'number') return value;
    return 0;
}

export default Float;
