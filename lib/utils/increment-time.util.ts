import { ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_MONTH, ONE_WEEK, ONE_YEAR, Unit } from "../types";

/**
 * @description Increments a given date by a specified amount of time based on the unit provided.
 * 
 * @param date The starting date to increment.
 * @param value The number of units to increment. If not a valid number, the original timestamp is returned.
 * @param unit The unit of time to increment. Possible values are:
 * - `'day'`: Increment by days.
 * - `'hour'`: Increment by hours.
 * - `'minute'`: Increment by minutes.
 * - `'month'`: Increment by months.
 * - `'week'`: Increment by weeks.
 * - `'year'`: Increment by years.
 * 
 * @returns The incremented timestamp as a number. If the input date is invalid, the current timestamp is returned.
 * 
 * @example
 * ```typescript
 * const now = new Date();
 * const incrementedTime = IncrementTime(now, 3, 'day'); // Adds 3 days to the current date.
 * console.log(new Date(incrementedTime)); // Logs the incremented date.
 * ```
 */
export const IncrementTime = (date: Date, value: number, unit: Unit): number => {

    if (!(date instanceof Date)) return new Date().getTime();

    const time = date.getTime();

    if (typeof value !== 'number') return time;

    switch (unit) {
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
