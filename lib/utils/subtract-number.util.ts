import Float from "./normalize-number.util";
import ToDecimal from "./to-decimal-number.util";
import ToLong from "./to-long-number.util";

export const Subtract = (valueA: number, valueB: number): number => {
    const isValueAnumber = typeof valueA === 'number';
    const isValueBnumber = typeof valueB === 'number';
    const isBothNumber = isValueAnumber && isValueBnumber;

    if(!isBothNumber){
        const isNaNValueA = isNaN(valueA);
        const isNaNValueB = isNaN(valueB);
        const isBothNaN = isNaNValueA && isNaNValueB;
        if(isBothNaN) return 0;
        if(isNaNValueA) return Float(valueB) * -1;
        if(isNaNValueB) return Float(valueA);
        if(typeof valueA === 'string' && typeof valueB === 'string') return Float(ToDecimal(ToLong(Float(valueA)) - ToLong(Float(valueB))));
        if(typeof valueA === 'string' && typeof valueB === 'number') return Float(ToDecimal(ToLong(Float(valueA)) - ToLong(valueB)));
        if(typeof valueB === 'string' && typeof valueA === 'number') return Float(ToDecimal(ToLong(valueA) - ToLong(Float(valueB))));
    }
    return Float(ToDecimal(ToLong(valueA) - ToLong(valueB)));
}

export default Subtract;
