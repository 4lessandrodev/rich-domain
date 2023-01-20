type Unit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export const IncrementTime = (date: Date, value: number, unit: Unit): number => {

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
