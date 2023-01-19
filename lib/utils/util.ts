import validator, { Validator } from "./validator";
import RemoveSpaces from "./remove-spaces.util";
import RemoveChars from "./remove-chars.util";

export class Utils {
    private static instance: Utils;
    private static validator: Validator = validator;
    
    public static create(): Utils {
        if(!Utils.instance){
            Utils.instance = new Utils();
        }
        return Utils.instance;
    }

    string(target: string){
        return {
            removeSpecialChars: () => RemoveChars(target, (char: string) => Utils.validator.string(char).isSpecialChar()),
            removeSpaces: (): string => RemoveSpaces(target),
            removeNumbers: (): string => RemoveChars(target, (char: string) => Utils.validator.string(char).hasOnlyNumbers()),
            removeChar: (char: string) => RemoveChars(target, (val: string) => val === char)
        }
    }

    private constructor(){
        Utils.validator = validator;
    }
};

export default Utils.create();
