export const ToLong = (value: number): number => {
    const isValid = typeof value === 'number';
    if(!isValid) return value;
    return value * 100;
}
export default ToLong;
