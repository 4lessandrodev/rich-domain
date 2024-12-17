import { ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_MONTH, ONE_WEEK, ONE_YEAR, Unit } from "../types";

/**
 * @description Decreases a given date by a specified amount of time based on the unit provided.
 * 
 * @param date The starting date from which the time will be decremented.
 * @param value The number of units to decrement. If not a valid number, the original timestamp is returned.
 * @param unit The unit of time to decrement. Possible values are:
 * - `'day'`: Decrement by days.
 * - `'hour'`: Decrement by hours.
 * - `'minute'`: Decrement by minutes.
 * - `'month'`: Decrement by months.
 * - `'week'`: Decrement by weeks.
 * - `'year'`: Decrement by years.
 * 
 * @returns The decremented timestamp as a number. If the input date is invalid, the current timestamp is returned.
 * 
 * @example
 * ```typescript
 * const now = new Date();
 * const decrementedTime = DecrementTime(now, 2, 'day'); // Subtracts 2 days from the current date.
 * console.log(new Date(decrementedTime)); // Logs the decremented date.
 * ```
 */
export const DecrementTime = (date: Date, value: number, unit: Unit): number => {

    if (!(date instanceof Date)) return new Date().getTime();

    const time = date.getTime();

    if (typeof value !== 'number') return time;

    switch (unit) {
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
