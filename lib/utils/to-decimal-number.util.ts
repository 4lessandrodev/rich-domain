export const ToDecimal = (value: number): number => {
    const isValid = typeof value === 'number';
    if(!isValid) return value;
    return value / 10;
}
export default ToDecimal;
