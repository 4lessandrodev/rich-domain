import Float from "./normalize-number.util";
import ToLong from "./to-long-number.util";

export const Divide = (valueA: number, valueB: number): number => {
    const isValueAnumber = typeof valueA === 'number';
    const isValueBnumber = typeof valueB === 'number';
    const isBothNumber = isValueAnumber && isValueBnumber;

    if(!isBothNumber){
        const isNaNValueA = isNaN(valueA);
        const isNaNValueB = isNaN(valueB);
        const isBothNaN = isNaNValueA && isNaNValueB;
        if(isBothNaN || isNaNValueA || isNaNValueB) return 0;
        if(typeof valueA === 'string' && typeof valueB === 'string') return Float((ToLong(Float(valueA)) / ToLong(Float(valueB))));
        if(typeof valueA === 'string' && typeof valueB === 'number') return Float((ToLong(Float(valueA)) / ToLong(valueB)));
        if(typeof valueB === 'string' && typeof valueA === 'number') return Float((ToLong(valueA) / ToLong(Float(valueB))));
    }

    return Float((ToLong(valueA) / ToLong(valueB)));
}

export default Divide;
