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
import { CalcOpt } from "../types";

/**
 * @description Utility class providing various helper methods for date, number, and string manipulations.
 */
export class Utils {
    private static instance: Utils;
    private static validator: Validator = validator;

    /**
     * @description Creates a singleton instance of the Utils class.
     * @returns {Utils} An instance of the Utils class.
    */
    public static create(): Utils {
        if (!Utils.instance) {
            Utils.instance = new Utils();
        }
        return Utils.instance;
    }

    /**
     * @description Provides date manipulation utilities for adding or removing units of time.
     * @param target The date to manipulate.
     * @returns An object with methods for adding or removing units of time (days, hours, etc.).
     */
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

    /**
     * @description Provides number manipulation utilities, including mathematical operations.
     * @param target The number to manipulate.
     * @returns An object with methods for multiplication, division, subtraction, and addition.
     */
    number(target: number) {
        return {
            /**
             * @description multiply a value for another one.
             * @param value number or string (number)
             * @param options as object with fractionDigits option
             * @default fractionDigits 5
             * @returns result as number
             * @sumary If you provide a string NAN (not a number) 0 will be considered as value.
             */
            multiplyBy: (value: number, opt?: CalcOpt): number => Multiply(target, value, opt?.fractionDigits),
            /**
             * @description divide a value for another one.
             * @param value number or string
             * @param options as object with fractionDigits option
             * @default fractionDigits 5
             * @returns result as number
             * @sumary If you provide a string NAN (not a number) 0 will be considered as value.
             */
            divideBy: (value: number, opt?: CalcOpt): number => Divide(target, value, opt?.fractionDigits),
            /**
             * @description subtract a value for another one.
             * @param value number or string
             * @param options as object with fractionDigits option
             * @default fractionDigits 5
             * @returns result as number
             * @sumary If you provide a string NAN (not a number) 0 will be considered as value.
             */
            subtract: (value: number, opt?: CalcOpt): number => Subtract(target, value, opt?.fractionDigits),
            /**
             * @description sum a value with another one.
             * @param value number or string
             * @param options as object with fractionDigits option
             * @default fractionDigits 5
             * @returns result as number
             * @sumary If you provide a string NAN (not a number) 0 will be considered as value.
             */
            sum: (value: number, opt?: CalcOpt): number => Sum(target, value, opt?.fractionDigits)
        }
    }

    /**
     * @description Provides string manipulation utilities, including removing or replacing characters.
     * @param target The string to manipulate.
     * @returns An object with methods for character removal, space removal, and replacement.
     */
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
