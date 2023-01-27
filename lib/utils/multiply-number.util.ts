import EnsureNumber from "./ensure-number";
import IsNaN from "./is-nan.util";
import Float from "./normalize-number.util";
import ToDecimal from "./to-decimal-number.util";
import ToLong from "./to-long-number.util";
import ToPrecision from "./to-precision.util";

export const Multiply = (valueA: number, valueB: number, precision = 5): number => {
    const isValueAnumber = typeof valueA === 'number';
    const isValueBnumber = typeof valueB === 'number';
    const isBothNumber = isValueAnumber && isValueBnumber;

    if(!isBothNumber){
        const isNaNValueA = IsNaN(valueA);
        const isNaNValueB = IsNaN(valueB);
        const isBothNaN = isNaNValueA && isNaNValueB;
        if(isBothNaN || isNaNValueA || isNaNValueB) return 0;
        const result = ToPrecision(ToDecimal(Float(ToDecimal(ToLong(Float(valueA)) * ToLong(Float(valueB))))), precision);
        return EnsureNumber(result);
    }
    const result = ToPrecision(ToDecimal(Float(ToDecimal(ToLong(valueA) * ToLong(valueB)))), precision);
    return EnsureNumber(result);
}

export default Multiply;
