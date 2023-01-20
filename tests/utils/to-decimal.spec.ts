import ToDecimal from "../../lib/utils/to-decimal-number.util";

describe('to-decimal', () => {
    it('should return the same value if is not a number', () => {
        const value = 'invalid';
        const result = ToDecimal(value as any);
        expect(result).toBe(value);
    });

    it('should divide by 10', () => {
        const value = 70;
        const result = ToDecimal(value);
        expect(result).toBe(7);
    });
});