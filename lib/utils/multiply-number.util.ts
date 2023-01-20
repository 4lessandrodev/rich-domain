import Float from "./normalize-number.util";
import ToDecimal from "./to-decimal-number.util";
import ToLong from "./to-long-number.util";

export const Multiply = (valueA: number, valueB: number): number => {
    const isValueAnumber = typeof valueA === 'number';
    const isValueBnumber = typeof valueB === 'number';
    const isBothNumber = isValueAnumber && isValueBnumber;

    if(!isBothNumber){
        const isNaNValueA = isNaN(valueA);
        const isNaNValueB = isNaN(valueB);
        const isBothNaN = isNaNValueA && isNaNValueB;
        if(isBothNaN || isNaNValueA || isNaNValueB) return 0;
        if(typeof valueA === 'string' && typeof valueB === 'string') {
            return ToDecimal(Float(ToDecimal(ToLong(Float(valueA)) * ToLong(Float(valueB)))));
        }
        if(typeof valueA === 'string' && typeof valueB === 'number'){
            return ToDecimal(Float(ToDecimal(ToLong(Float(valueA)) * ToLong(valueB))));
        }
        if(typeof valueB === 'string' && typeof valueA === 'number'){
            return ToDecimal(Float(ToDecimal(ToLong(valueA) * ToLong(Float(valueB)))));
        }
    }
    return ToDecimal(Float(ToDecimal(ToLong(valueA) * ToLong(valueB))));
}

export default Multiply;
