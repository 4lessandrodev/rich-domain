export const Replace = (target: string, char: string, value: string | number): string => {
    const pattern = RegExp(char, 'g');
    const isValidTarget = typeof target === 'string';
    const isValidChar = typeof char === 'string';
    const isValidValue = typeof value === 'string' || typeof value === 'number';

    const isValid = isValidChar && isValidTarget && isValidValue;
    if(!isValid) return target;
    return target.replace(pattern, `${value}`);
}

export default Replace;
