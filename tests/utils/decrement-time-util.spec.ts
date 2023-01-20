import DecrementTime from '../../lib/utils/decrement-time.util';

describe('decrement-time', () => {
    const date = new Date(2206299212000);
    it('should decrement minutes with success', () => {
        expect(date.toISOString()).toBe('2039-11-30T20:53:32.000Z');
        const result = DecrementTime(date, 53, 'minute');
        expect(new Date(result).toISOString()).toBe('2039-11-30T20:00:32.000Z');
        expect(result).toBe(2206296032000)
    })

    it('should decrement hours with success', () => {
        expect(date.toISOString()).toBe('2039-11-30T20:53:32.000Z');
        const result = DecrementTime(date, 2, 'hour');
        expect(new Date(result).toISOString()).toBe('2039-11-30T18:53:32.000Z');
        expect(result).toBe(2206292012000)
    })

    it('should decrement days with success', () => {
        expect(date.toISOString()).toBe('2039-11-30T20:53:32.000Z');
        const result = DecrementTime(date, 2, 'day');
        expect(new Date(result).toISOString()).toBe('2039-11-28T20:53:32.000Z');
        expect(result).toBe(2206126412000)
    })

    it('should decrement week with success', () => {
        expect(date.toISOString()).toBe('2039-11-30T20:53:32.000Z');
        const result = DecrementTime(date, 2, 'week');
        expect(new Date(result).toISOString()).toBe('2039-11-16T20:53:32.000Z');
        expect(result).toBe(2205089612000)
    })

    it('should decrement month with success', () => {
        expect(date.toISOString()).toBe('2039-11-30T20:53:32.000Z');
        const result = DecrementTime(date, 2, 'month');
        expect(new Date(result).toISOString()).toBe('2039-10-01T20:53:32.000Z');
        expect(result).toBe(2201115212000)
    })

    it('should decrement year with success', () => {
        expect(date.toISOString()).toBe('2039-11-30T20:53:32.000Z');
        const result = DecrementTime(date, 2, 'year');
        expect(new Date(result).toISOString()).toBe('2037-11-30T20:53:32.000Z');
        expect(result).toBe(2143227212000)
    })

    it('should return current date if provide an invalid value', () => {
        const result = DecrementTime('Invalid Date' as any, 2, 'year');
        expect(typeof result).toBe('number');
    })

    it('should return same date value if provide invalid value', () => {
        const result = DecrementTime(date, 'invalid' as any, 'year');
        expect(result).toBe(date.getTime());
    })

    it('should return same date value if provide invalid option', () => {
        const result = DecrementTime(date, 5, 'invalid' as any);
        expect(result).toBe(date.getTime());
    })
})
