import Normalize from '../../lib/utils/normalize-number.util';

describe('normalize', () => {
    it('should return 0 if provide an invalid value', () => {
        const invalid = {};
        const result = Normalize(invalid as any);
        expect(result).toBe(0);
    });

    it('should transform string in number if is not isNaN', () => {
        const result = Normalize('100' as any);
        expect(result).toBe(100);
    });

    it('should transform number in 5 decimals', () => {
        const result = Normalize(33.33333333333 as any);
        expect(result).toBe(33.33333);
    });
});
