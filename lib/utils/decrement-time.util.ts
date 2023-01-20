type Unit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export const DecrementTime = (date: Date, value: number, unit: Unit): number => {

    if(!(date instanceof Date)) return new Date().getTime();

    const ONE_MINUTE = 60000;
    const ONE_HOUR = ONE_MINUTE * 60;
    const ONE_DAY = ONE_HOUR * 24;
    const ONE_WEEK = ONE_DAY * 7;
    const ONE_MONTH = ONE_DAY * 30;
    const ONE_YEAR = ONE_DAY * 365;
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
