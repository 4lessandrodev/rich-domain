import ToPrecision from '../../lib/utils/to-precision.util';

describe('to-precision.util', () => {
    it('should return numbers with 3 numbers fraction', () => {
        const result = ToPrecision(3.1234567, 3);
        expect(result).toBe(3.123);
    });

    it('should return numbers with 3 numbers fraction', () => {
        const result = ToPrecision('3.1234567' as any, 3);
        expect(result).toBe(3.123);
    });

    it('should return numbers with 2 numbers fraction', () => {
        const result = ToPrecision(3.12, 5);
        expect(result).toBe(3.12);
    });

    it('should return numbers with 3 numbers fraction', () => {
        const result = ToPrecision('3.123' as any, 10);
        expect(result).toBe(3.123);
    });

    it('should return numbers with 4 numbers fraction', () => {
        const result = ToPrecision(3.123456, 4);
        expect(result).toBe(3.1234);
    });

    it('should return numbers with 5 numbers fraction', () => {
        const result = ToPrecision('3.1234567' as any, 5);
        expect(result).toBe(3.12346);
    });
});
