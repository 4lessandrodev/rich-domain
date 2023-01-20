import IncrementTime from '../../lib/utils/increment-time.util';

describe('increment-time', () => {
    const date = new Date(2206299212000);
    it('should increment minutes with success', () => {
        expect(date.toISOString()).toBe('2039-11-30T20:53:32.000Z');
        const result = IncrementTime(date, 42, 'minute');
        expect(new Date(result).toISOString()).toBe('2039-11-30T21:35:32.000Z');
        expect(result).toBe(2206301732000)
    })

    it('should increment hours with success', () => {
        expect(date.toISOString()).toBe('2039-11-30T20:53:32.000Z');
        const result = IncrementTime(date, 2, 'hour');
        expect(new Date(result).toISOString()).toBe('2039-11-30T22:53:32.000Z');
        expect(result).toBe(2206306412000)
    })

    it('should increment days with success', () => {
        expect(date.toISOString()).toBe('2039-11-30T20:53:32.000Z');
        const result = IncrementTime(date, 2, 'day');
        expect(new Date(result).toISOString()).toBe('2039-12-02T20:53:32.000Z');
        expect(result).toBe(2206472012000)
    })

    it('should increment week with success', () => {
        expect(date.toISOString()).toBe('2039-11-30T20:53:32.000Z');
        const result = IncrementTime(date, 2, 'week');
        expect(new Date(result).toISOString()).toBe('2039-12-14T20:53:32.000Z');
        expect(result).toBe(2207508812000)
    })

    it('should increment month with success', () => {
        expect(date.toISOString()).toBe('2039-11-30T20:53:32.000Z');
        const result = IncrementTime(date, 2, 'month');
        expect(new Date(result).toISOString()).toBe('2040-01-29T20:53:32.000Z');
        expect(result).toBe(2211483212000)
    })

    it('should increment year with success', () => {
        expect(date.toISOString()).toBe('2039-11-30T20:53:32.000Z');
        const result = IncrementTime(date, 2, 'year');
        expect(new Date(result).toISOString()).toBe('2041-11-29T20:53:32.000Z');
        expect(result).toBe(2269371212000)
    })

    it('should return current date if provide an invalid date value', () => {
        const result = IncrementTime('Invalid Date' as any, 2, 'year');
        expect(typeof result).toBe('number');
    })

    it('should return same date value if provide invalid value', () => {
        const result = IncrementTime(date, 'invalid' as any, 'year');
        expect(result).toBe(date.getTime());
    })

    it('should return same date value if provide invalid option', () => {
        const result = IncrementTime(date, 5, 'invalid' as any);
        expect(result).toBe(date.getTime());
    })
})