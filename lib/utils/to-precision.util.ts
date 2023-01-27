export const ToPrecision = (value: number| string, precision: number): number => {
    if(typeof value === 'string') return parseFloat(parseFloat(String(value)).toFixed(precision));
    const int = (Math.trunc(value) * 100);
    const dec = Number((((value * 100) - (int)) / 100).toPrecision(precision + 3).slice(0, precision + 2));
    return Number(((int / 100) + dec).toPrecision(String(int).length + 1 + precision));
}

export default ToPrecision;
