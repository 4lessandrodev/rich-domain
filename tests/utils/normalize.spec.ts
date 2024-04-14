import Float from '../../lib/utils/normalize-number.util';

describe('normalize', () => {
    it('should return 0 if provide an invalid value', () => {
        const invalid = {};
        const result = Float(invalid as any);
        expect(result).toBe(0);
    });

    it('should transform string in number if is not isNaN', () => {
        const result = Float('100' as any);
        expect(result).toBe(100);
    });

    it('should return the same decimals', () => {
        const result = Float(33.33333333333);
        expect(result).toBe(33.33333333333);
    });

    it('should return 0', () => {
        const result = Float('abc123' as any);
        expect(result).toBe(0);
    })

    it('should return 0.33', () => {
        const result = Float('0.33asd' as any);
        expect(result).toBe(0.33);
    })

    it('should return 2.33', () => {
        const result = Float('2.33asd' as any);
        expect(result).toBe(2.33);
    })

    it('should return parsed float value if input is a string and not NaN', () => {
        const value = '3.14R';
        const result = Float(value as any);
        expect(result).toBe(parseFloat('3.14'));
    });

    it('should return the input value if it is a number', () => {
        const value = 3.14;
        const result = Float(value);
        expect(result).toBe(value);
    });

    it('should return 0 if input is neither a string nor a number', () => {
        const value = 'not a number';
        const result = Float(value as any);
        expect(result).toBe(0);
    });
});
