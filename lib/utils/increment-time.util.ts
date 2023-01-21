import { ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_MONTH, ONE_WEEK, ONE_YEAR, Unit } from "../types";

export const IncrementTime = (date: Date, value: number, unit: Unit): number => {

    if(!(date instanceof Date)) return new Date().getTime();

    const time = date.getTime();

    if(typeof value !== 'number') return time;

    switch(unit){
        case 'day': return (ONE_DAY * value) + time;
        case 'hour': return (ONE_HOUR * value) + time;
        case 'minute': return (ONE_MINUTE * value) + time;
        case 'month': return (ONE_MONTH * value) + time;
        case 'week': return (ONE_WEEK * value) + time;
        case 'year': return (ONE_YEAR * value) + time;
        default: return time;
    }
}

export default IncrementTime;
