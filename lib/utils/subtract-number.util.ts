import EnsureNumber from "./ensure-number";
import IsNaN from "./is-nan.util";
import Float from "./normalize-number.util";
import ToDecimal from "./to-decimal-number.util";
import ToLong from "./to-long-number.util";
import ToPrecision from "./to-precision.util";

export const Subtract = (valueA: number, valueB: number, precision = 5): number => {
    const isValueAnumber = typeof valueA === 'number';
    const isValueBnumber = typeof valueB === 'number';
    const isBothNumber = isValueAnumber && isValueBnumber;

    if(!isBothNumber){
        const isNaNValueA = IsNaN(valueA);
        const isNaNValueB = IsNaN(valueB);
        const isBothNaN = isNaNValueA && isNaNValueB;
        if(isBothNaN) return 0;
        if(isNaNValueA) return Float(valueB) * -1;
        if(isNaNValueB) return Float(valueA);
        const result = ToPrecision(Float(ToDecimal(ToLong(Float(valueA)) - ToLong(Float(valueB)))), precision);
        return EnsureNumber(result);
    }
    const result = ToPrecision(Float(ToDecimal(ToLong(valueA) - ToLong(valueB))), precision);
    return EnsureNumber(result);
}

export default Subtract;
