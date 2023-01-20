export const RemoveChars = (target: string, IsChar: (char: string) => boolean): string => {
    if(typeof target !== 'string') return target;
    const chars = target.split('');
    const str = chars.reduce((prev, current) => {
        const isSpecialChar = IsChar(current);
        if(isSpecialChar) return prev;
        return prev + current;
    }, '');
    return str;
}

export default RemoveChars;
