import EnsureNumber from "./ensure-number";
import IsNaN from "./is-nan.util";
import Float from "./normalize-number.util";
import ToDecimal from "./to-decimal-number.util";
import ToLong from "./to-long-number.util";
import ToPrecision from "./to-precision.util";

/**
 * @description Subtracts one number (`valueB`) from another (`valueA`) with optional precision adjustment. 
 * Handles edge cases where inputs are not valid numbers by normalizing the values or returning defaults.
 * 
 * @param valueA The first value (minuend). Can be a number or a value convertible to a number.
 * @param valueB The second value (subtrahend). Can be a number or a value convertible to a number.
 * @param precision The number of decimal places to apply to the result. Defaults to 5.
 * 
 * @returns The result of the subtraction, normalized and adjusted to the specified precision. 
 * Returns `0` if both inputs are `NaN`. If one of the inputs is invalid, the valid input is returned 
 * (or negated if the second value is `NaN`).
 * 
 * @example
 * ```typescript
 * Subtract(10, 2); // Returns 8
 * Subtract(10, "3.5", 2); // Returns 6.50
 * Subtract(NaN, 5); // Returns -5
 * Subtract(10, NaN); // Returns 10
 * Subtract(NaN, NaN); // Returns 0
 * ```
 */
export const Subtract = (valueA: number, valueB: number, precision = 5): number => {
    const isValueOneNumber = typeof valueA === 'number';
    const isValueTwoNumber = typeof valueB === 'number';
    const isBothNumber = isValueOneNumber && isValueTwoNumber;

    if (!isBothNumber) {
        const isNaNValueA = IsNaN(valueA);
        const isNaNValueB = IsNaN(valueB);
        const isBothNaN = isNaNValueA && isNaNValueB;

        if (isBothNaN) return 0;
        if (isNaNValueA) return Float(valueB) * -1;
        if (isNaNValueB) return Float(valueA);

        const result = ToPrecision(Float(ToDecimal(ToLong(Float(valueA)) - ToLong(Float(valueB)))), precision);
        return EnsureNumber(result);
    }

    const result = ToPrecision(Float(ToDecimal(ToLong(valueA) - ToLong(valueB))), precision);
    return EnsureNumber(result);
}

export default Subtract;
