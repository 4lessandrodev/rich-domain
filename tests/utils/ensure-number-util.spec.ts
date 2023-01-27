import EnsureNumber from '../../lib/utils/ensure-number';

describe('ensure-number.util', () => {
    it('should return 0 if Infinity', () => {
        const result = EnsureNumber(Infinity);
        expect(result).toBe(0);
    });

    it('should return 0 if NaN', () => {
        const result = EnsureNumber(NaN);
        expect(result).toBe(0);
    });

    it('should return 0 if NaN', () => {
        const result = EnsureNumber("INVALID" as any);
        expect(result).toBe(0);
    });

    it('should return the value', () => {
        const result = EnsureNumber(42);
        expect(result).toBe(42);
    })

    it('should return the value', () => {
        const result = EnsureNumber('42' as any);
        expect(result).toBe('42');
    })
})