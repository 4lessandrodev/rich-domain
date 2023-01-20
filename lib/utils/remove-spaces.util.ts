import RemoveChars from "./remove-chars.util";

export const RemoveSpaces = (target: string): string => {
    return RemoveChars(target, (char: string) => char === ' ');
}

export default RemoveSpaces;
