/**
 * @description Converts a number to its "long" equivalent by multiplying it by 100.
 * This is useful for denormalizing values, such as converting decimals to percentages.
 * 
 * @param value The input value to convert. Must be a number.
 * 
 * @returns The "long" equivalent of the input number.
 * If the input is not a valid number, it returns the input as is.
 * 
 * @example
 * ```typescript
 * ToLong(5); // Returns 500
 * ToLong(0.25); // Returns 25
 * ToLong("100"); // Returns "100" (input not a valid number)
 * ```
 */
export const ToLong = (value: number): number => {
    const isValid = typeof value === 'number';
    if (!isValid) return value;
    return value * 100;
}

export default ToLong;
