import ToLong from "../../lib/utils/to-long-number.util";

describe('to-long', () => {
    it('should return the same value if is not a number', () => {
        const value = 'invalid';
        const result = ToLong(value as any);
        expect(result).toBe(value);
    });

    it('should multiply by 100', () => {
        const value = 7;
        const result = ToLong(value);
        expect(result).toBe(700);
    });
});
