export const Float = (value: number): number => {
    if(typeof value === 'string' && !isNaN(value)) return parseFloat(value);
    if(typeof value === 'number') return parseFloat(value.toFixed(5));
    return 0;
}

export default Float;
