/**
 * @description Replaces all occurrences of a specified character in a string with a given value. 
 * The replacement is performed globally (all occurrences).
 * 
 * @param target The string in which the replacements will be made.
 * @param char The character or substring to replace. A global regular expression will be created based on this.
 * @param value The value to replace the `char` with. Can be a string or a number.
 * 
 * @returns A new string with all occurrences of `char` replaced by `value`.
 * If the inputs are not valid (e.g., `target` or `char` are not strings), the original `target` is returned unchanged.
 * 
 * @example
 * ```typescript
 * // Example 1: Replace a character
 * const result = Replace("hello world", "o", "a");
 * console.log(result); // "hella warld"
 * 
 * // Example 2: Replace a substring
 * const result = Replace("2024-12-15", "-", "/");
 * console.log(result); // "2024/12/15"
 * 
 * // Example 3: Replace with a number
 * const result = Replace("Price: $$", "$", 100);
 * console.log(result); // "Price: 100100"
 * ```
 */
export const Replace = (target: string, char: string, value: string | number): string => {
    const pattern = RegExp(char, 'g');
    const isValidTarget = typeof target === 'string';
    const isValidChar = typeof char === 'string';
    const isValidValue = typeof value === 'string' || typeof value === 'number';

    const isValid = isValidChar && isValidTarget && isValidValue;
    if (!isValid) return target;

    return target.replace(pattern, `${value}`);
}

export default Replace;
