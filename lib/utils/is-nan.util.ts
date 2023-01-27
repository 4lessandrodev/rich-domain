export const IsNaN = (value: string | number) : boolean => {
    return isNaN(parseFloat(String(value)));
}

export default IsNaN;
