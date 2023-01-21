import { ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_MONTH, ONE_WEEK, ONE_YEAR, Unit } from "../types";

export const DecrementTime = (date: Date, value: number, unit: Unit): number => {

    if(!(date instanceof Date)) return new Date().getTime();

    const time = date.getTime();

    if(typeof value !== 'number') return time;

    switch(unit){
        case 'day': return time - (ONE_DAY * value);
        case 'hour': return time - (ONE_HOUR * value);
        case 'minute': return time - (ONE_MINUTE * value);
        case 'month': return time - (ONE_MONTH * value);
        case 'week': return time - (ONE_WEEK * value);
        case 'year': return time - (ONE_YEAR * value);
        default: return time;
    }
}

export default DecrementTime;
