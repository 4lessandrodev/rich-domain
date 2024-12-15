/**
 * @description Adjusts a number or numeric string to a specified precision. The function ensures that the 
 * result maintains the desired level of precision, handling both integer and decimal parts appropriately.
 * 
 * @param value The input value to be adjusted. Can be a number or a numeric string.
 * @param precision The desired number of decimal places in the result.
 * 
 * @returns A number rounded to the specified precision. If the input is a string, it is parsed and adjusted accordingly.
 * 
 * @example
 * ```typescript
 * ToPrecision(123.456789, 2); // Returns 123.46
 * ToPrecision("987.654321", 3); // Returns 987.654
 * ToPrecision(10.5, 1); // Returns 10.5
 * ```
 */
export const ToPrecision = (value: number | string, precision: number): number => {
    if (typeof value === 'string') {
        return parseFloat(parseFloat(String(value)).toFixed(precision));
    }

    const int = Math.trunc(value) * 100; // Integer part scaled to preserve precision
    const dec = Number(
        (((value * 100) - int) / 100)
            .toPrecision(precision + 3)
            .slice(0, precision + 2)
    ); // Decimal part adjusted to specified precision

    return Number(
        ((int / 100) + dec)
            .toPrecision(String(int).length + 1 + precision)
    ); // Combined integer and adjusted decimal parts
}

export default ToPrecision;
