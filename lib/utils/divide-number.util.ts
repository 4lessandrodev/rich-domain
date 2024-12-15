import EnsureNumber from "./ensure-number";
import IsNaN from "./is-nan.util";
import Float from "./normalize-number.util";
import ToLong from "./to-long-number.util";
import ToPrecision from "./to-precision.util";

/**
 * @description Divides two numbers (`valueA` by `valueB`) with support for validation and normalization. 
 * Handles edge cases such as non-numeric inputs and applies a specified precision to the result.
 * 
 * @param valueA The dividend (numerator). Can be a number or a value convertible to a number.
 * @param valueB The divisor (denominator). Can be a number or a value convertible to a number.
 * @param precision The number of decimal places to apply to the result. Defaults to 5.
 * 
 * @returns The result of the division, normalized and adjusted to the specified precision. 
 * Returns `0` if either value is not a valid number.
 * 
 * @example
 * ```typescript
 * Divide(10, 2); // Returns 5
 * Divide(10, 3, 3); // Returns 3.333
 * Divide("10", "2"); // Returns 5 (handles string inputs)
 * Divide(NaN, 2); // Returns 0
 * ```
 */
export const Divide = (valueA: number, valueB: number, precision = 5): number => {
    const isValueOneNumber = typeof valueA === 'number';
    const isValueTwoNumber = typeof valueB === 'number';
    const isBothNumber = isValueOneNumber && isValueTwoNumber;

    if (!isBothNumber) {
        const isNaNValueA = IsNaN(valueA);
        const isNaNValueB = IsNaN(valueB);
        const isBothNaN = isNaNValueA && isNaNValueB;

        if (isBothNaN || isNaNValueA || isNaNValueB) return 0;

        const result = ToPrecision(Float((ToLong(Float(valueA)) / ToLong(Float(valueB)))), precision);
        return EnsureNumber(result);
    }

    const result = ToPrecision(Float((ToLong(valueA) / ToLong(valueB))), precision);
    return EnsureNumber(result);
}

export default Divide;
