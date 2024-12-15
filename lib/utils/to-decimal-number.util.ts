/**
 * @description Converts a number to its decimal equivalent by dividing it by 100.
 * This is useful for normalizing values, such as converting percentages to decimals.
 * 
 * @param value The input value to convert. Must be a number.
 * 
 * @returns The decimal equivalent of the input number. 
 * If the input is not a valid number, it returns the input as is.
 * 
 * @example
 * ```typescript
 * ToDecimal(500); // Returns 5
 * ToDecimal(25); // Returns 0.25
 * ToDecimal("100"); // Returns "100" (input not a valid number)
 * ```
 */
export const ToDecimal = (value: number): number => {
    const isValid = typeof value === 'number';
    if (!isValid) return value;
    return value / 100;
}

export default ToDecimal;
