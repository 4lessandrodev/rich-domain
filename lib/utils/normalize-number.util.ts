import IsNaN from "./is-nan.util";

export const Float = (value: number): number => {
    if(typeof value === 'string' && !IsNaN(value)) return parseFloat(value);
    if(typeof value === 'number') return value;
    return 0;
}

export default Float;
