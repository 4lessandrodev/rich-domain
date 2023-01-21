import validator, { Validator } from "./validator";
import RemoveSpaces from "./remove-spaces.util";
import RemoveChars from "./remove-chars.util";
import Replace from "./replace-char.util";
import Multiply from "./multiply-number.util";
import Divide from "./divide-number.util";
import Subtract from "./subtract-number.util";
import Sum from "./sum-number.util";
import IncrementTime from "./increment-time.util";
import DecrementTime from "./decrement-time.util";

export class Utils {
    private static instance: Utils;
    private static validator: Validator = validator;

    public static create(): Utils {
        if (!Utils.instance) {
            Utils.instance = new Utils();
        }
        return Utils.instance;
    }

    date(target: Date) {
        return ({
            add: (value: number) => ({
                /**
                 * @description add days to a date.
                 * @returns a new date with incremented days.
                 */
                days: () => new Date(IncrementTime(target, value, 'day')),
                /**
                 * @description add hours to a date.
                 * @returns a new date with incremented hours.
                 */
                hours: () => new Date(IncrementTime(target, value, 'hour')),
                /**
                 * @description add minutes to a date.
                 * @returns a new date with incremented minutes.
                 */
                minutes: () => new Date(IncrementTime(target, value, 'minute')),
                /**
                 * @description add weeks to a date.
                 * @returns a new date with incremented weeks.
                 */
                weeks: () => new Date(IncrementTime(target, value, 'week')),
                /**
                 * @description add months to a date.
                 * @returns a new date with incremented months.
                 */
                months: () => new Date(IncrementTime(target, value, 'month')),
                /**
                 * @description add years to a date.
                 * @returns a new date with incremented years.
                 */
                years: () => new Date(IncrementTime(target, value, 'year'))
            }),
            remove: (value: number) => ({
                /**
                 * @description remove days from a date.
                 * @returns a new date with removed days.
                 */
                days: () => new Date(DecrementTime(target, value, 'day')),
                /**
                 * @description remove hours from a date.
                 * @returns a new date with removed hours.
                 */
                hours: () => new Date(DecrementTime(target, value, 'hour')),
                /**
                 * @description remove minutes from a date.
                 * @returns a new date with removed minutes.
                 */
                minutes: () => new Date(DecrementTime(target, value, 'minute')),
                /**
                 * @description remove weeks from a date.
                 * @returns a new date with removed weeks.
                 */
                weeks: () => new Date(DecrementTime(target, value, 'week')),
                /**
                 * @description remove months from a date.
                 * @returns a new date with removed months.
                 */
                months: () => new Date(DecrementTime(target, value, 'month')),
                /**
                 * @description remove years from a date.
                 * @returns a new date with removed years.
                 */
                years: () => new Date(DecrementTime(target, value, 'year'))
            })
        })
    }

    number(target: number) {
        return {
            /**
             * @description multiply a value for another one.
             * @param value number or string (number)
             * @returns result as number
             * @sumary If you provide a string NAN (not a number) 0 will be considered as value.
             */
            multiplyBy: (value: number): number => Multiply(target, value),
            /**
             * @description divide a value for another one.
             * @param value number or string
             * @returns result as number
             * @sumary If you provide a string NAN (not a number) 0 will be considered as value.
             */
            divideBy: (value: number): number => Divide(target, value),
            /**
             * @description subtract a value for another one.
             * @param value number or string
             * @returns result as number
             * @sumary If you provide a string NAN (not a number) 0 will be considered as value.
             */
            subtract: (value: number): number => Subtract(target, value),
            /**
             * @description sum a value with another one.
             * @param value number or string
             * @returns result as number
             * @sumary If you provide a string NAN (not a number) 0 will be considered as value.
             */
            sum: (value: number): number => Sum(target, value)
        }
    }

    string(target: string) {
        return {
            /**
             * @description remove all special chars from a string.
             * @returns string with no special chars.
             * @summary special chars: based on ascii table
             * @example
             * (asciiCode >= 33 && asciiCode <= 47) ||
             * (asciiCode >= 58 && asciiCode <= 64) ||
             * (asciiCode >= 91 && asciiCode <= 96) || 
             * (asciiCode >= 123 && asciiCode <= 126)
             */
            removeSpecialChars: () => RemoveChars(target, (char: string) => Utils.validator.string(char).isSpecialChar()),
            /**
             * @description remove all spaces from text.
             * @returns string with no spaces
             */
            removeSpaces: (): string => RemoveSpaces(target),
            /**
             * @description remove all numbers from a text
             * @returns string with no numbers.
             */
            removeNumbers: (): string => RemoveChars(target, (char: string) => Utils.validator.string(char).hasOnlyNumbers()),
            /**
             * @description remove only specific character from a text.
             * @param char character to be removed.
             * @returns string without char.
             * @memberof replace. If you need to remove a word or more than one character from a text use replace function.
             * @see replace
             */
            removeChar: (char: string) => RemoveChars(target, (val: string) => val === char),
            /**
             * @description replace any character or word from an string for some provided value.
             * @param char character or word to be replaced.
             * @param value character or word to be aplied.
             * @returns text with replaced value.
             * @example
             * string("hello world").replace("world").to("dear");
             */
            replace: (char: string) => ({ to: (value: string | number) => Replace(target, char, value) })
        }
    }

    private constructor() {
        Utils.validator = validator;
    }
};

export default Utils.create();
