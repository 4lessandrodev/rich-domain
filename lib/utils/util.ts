import validator, { Validator } from "./validator";
import RemoveSpaces from "./remove-spaces.util";
import RemoveChars from "./remove-chars.util";
import Replace from "./replace-char.util";
import Multiply from "./multiply-number.util";
import Divide from "./divide-number.util";
import Subtract from "./subtract-number.util";
import Sum from "./sum-number.util";

export class Utils {
    private static instance: Utils;
    private static validator: Validator = validator;

    public static create(): Utils {
        if(!Utils.instance){
            Utils.instance = new Utils();
        }
        return Utils.instance;
    }

    number(target: number){
        return {
            multiplyBy: (value: number): number => Multiply(target, value),
            divideBy: (value: number): number => Divide(target, value),
            subtract: (value: number): number => Subtract(target, value),
            sum: (value: number): number => Sum(target, value)
        }
    }

    string(target: string){
        return {
            removeSpecialChars: () => RemoveChars(target, (char: string) => Utils.validator.string(char).isSpecialChar()),
            removeSpaces: (): string => RemoveSpaces(target),
            removeNumbers: (): string => RemoveChars(target, (char: string) => Utils.validator.string(char).hasOnlyNumbers()),
            removeChar: (char: string) => RemoveChars(target, (val: string) => val === char),
            replace: (char: string) => ({ to: (value: string | number) => Replace(target, char, value) })
        }
    }

    private constructor(){
        Utils.validator = validator;
    }
};

export default Utils.create();
