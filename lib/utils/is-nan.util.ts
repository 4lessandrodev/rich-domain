/**
 * @description Checks if the provided value is `NaN` (Not-a-Number). The function attempts to parse the value into a number
 * and determines if the result is `NaN`.
 * 
 * @param value The value to check. Can be a string or a number.
 * 
 * @returns `true` if the value is `NaN`, otherwise `false`.
 * 
 * @example
 * ```typescript
 * IsNaN("123"); // Returns false (valid number)
 * IsNaN("abc"); // Returns true (not a number)
 * IsNaN(NaN); // Returns true
 * IsNaN(123); // Returns false (valid number)
 * ```
 */
export const IsNaN = (value: string | number): boolean => {
    return isNaN(parseFloat(String(value)));
}

export default IsNaN;
