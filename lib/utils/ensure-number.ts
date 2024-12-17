import IsNaN from "./is-nan.util";

/**
 * @description Ensures the input is a valid number. If the input is `NaN` or `Infinity`, it returns `0`.
 * 
 * @param value The number to validate.
 * 
 * @returns The original number if it is valid, or `0` if the input is `NaN` or `Infinity`.
 * 
 * @example
 * ```typescript
 * EnsureNumber(42); // Returns 42
 * EnsureNumber(NaN); // Returns 0
 * EnsureNumber(Infinity); // Returns 0
 * ```
 */
export const EnsureNumber = (value: number): number => {
    if(IsNaN(value) || value === Infinity) return 0;
    return value;
}

export default EnsureNumber;
