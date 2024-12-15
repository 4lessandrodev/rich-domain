import EnsureNumber from "./ensure-number";
import IsNaN from "./is-nan.util";
import Float from "./normalize-number.util";
import ToDecimal from "./to-decimal-number.util";
import ToLong from "./to-long-number.util";
import ToPrecision from "./to-precision.util";

/**
 * @description Multiplies two numbers (`valueA` and `valueB`) with validation, normalization, 
 * and optional precision adjustment. Handles edge cases where the inputs are not valid numbers.
 * 
 * @param valueA The first value to multiply. Can be a number or a value convertible to a number.
 * @param valueB The second value to multiply. Can be a number or a value convertible to a number.
 * @param precision The number of decimal places to apply to the result. Defaults to 5.
 * 
 * @returns The result of the multiplication, normalized and adjusted to the specified precision.
 * Returns `0` if either value is not a valid number.
 * 
 * @example
 * ```typescript
 * Multiply(10, 2); // Returns 20
 * Multiply(10, 2.5, 2); // Returns 25.00
 * Multiply("10", "3"); // Returns 30 (handles string inputs)
 * Multiply(NaN, 2); // Returns 0
 * ```
 */
export const Multiply = (valueA: number, valueB: number, precision = 5): number => {
    const isValueOneNumber = typeof valueA === 'number';
    const isValueTwoNumber = typeof valueB === 'number';
    const isBothNumber = isValueOneNumber && isValueTwoNumber;

    if (!isBothNumber) {
        const isNaNValueA = IsNaN(valueA);
        const isNaNValueB = IsNaN(valueB);
        const isBothNaN = isNaNValueA && isNaNValueB;

        if (isBothNaN || isNaNValueA || isNaNValueB) return 0;

        const result = ToPrecision(ToDecimal(Float(ToDecimal(ToLong(Float(valueA)) * ToLong(Float(valueB))))), precision);
        return EnsureNumber(result);
    }

    const result = ToPrecision(ToDecimal(Float(ToDecimal(ToLong(valueA) * ToLong(valueB)))), precision);
    return EnsureNumber(result);
}

export default Multiply;
