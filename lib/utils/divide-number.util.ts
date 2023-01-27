import EnsureNumber from "./ensure-number";
import IsNaN from "./is-nan.util";
import Float from "./normalize-number.util";
import ToLong from "./to-long-number.util";
import ToPrecision from "./to-precision.util";

export const Divide = (valueA: number, valueB: number, precision = 5): number => {
    const isValueAnumber = typeof valueA === 'number';
    const isValueBnumber = typeof valueB === 'number';
    const isBothNumber = isValueAnumber && isValueBnumber;

    if(!isBothNumber){
        const isNaNValueA = IsNaN(valueA);
        const isNaNValueB = IsNaN(valueB);
        const isBothNaN = isNaNValueA && isNaNValueB;
        if(isBothNaN || isNaNValueA || isNaNValueB) return 0;
        const result = ToPrecision(Float((ToLong(Float(valueA)) / ToLong(Float(valueB)))), precision);
        return EnsureNumber(result);
    }

    const result = ToPrecision(Float((ToLong(valueA) / ToLong(valueB))), precision);
    return EnsureNumber(result);
}

export default Divide;
