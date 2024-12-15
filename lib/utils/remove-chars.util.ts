/**
 * @description Removes characters from a string based on a condition defined by the provided `IsChar` function.
 * 
 * @param target The input string from which characters will be removed.
 * @param IsChar A callback function that determines whether a character should be removed.
 * It receives a character as input and returns `true` if the character should be removed, or `false` otherwise.
 * 
 * @returns A new string with the characters removed based on the `IsChar` condition.
 * If the input `target` is not a string, it returns the input as is.
 * 
 * @example
 * ```typescript
 * // Example 1: Remove all vowels
 * const isVowel = (char: string) => 'aeiou'.includes(char.toLowerCase());
 * const result = RemoveChars("Hello, World!", isVowel);
 * console.log(result); // "Hll, Wrld!"
 * 
 * // Example 2: Remove all digits
 * const isDigit = (char: string) => /\d/.test(char);
 * const result = RemoveChars("123abc456", isDigit);
 * console.log(result); // "abc"
 * ```
 */
export const RemoveChars = (target: string, IsChar: (char: string) => boolean): string => {
    if (typeof target !== 'string') return target;

    const chars = target.split('');
    const str = chars.reduce((prev, current) => {
        const isSpecialChar = IsChar(current);
        if (isSpecialChar) return prev;
        return prev + current;
    }, '');

    return str;
}

export default RemoveChars;
