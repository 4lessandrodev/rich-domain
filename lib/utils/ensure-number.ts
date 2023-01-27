import IsNaN from "./is-nan.util";

export const EnsureNumber = (value: number): number => {
    if(IsNaN(value) || value === Infinity) return 0;
    return value;
}

export default EnsureNumber;
