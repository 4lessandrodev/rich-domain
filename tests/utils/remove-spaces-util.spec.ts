import RemoveSpaces from '../../lib/utils/remove-spaces.util';

describe('remove-spaces', () => {
    it('should remove space with success', () => {
        const text = " Some Text With Space ";
        const result = RemoveSpaces(text);
        expect(result).toBe("SomeTextWithSpace");
    });

    it('should do not remove numbers', () => {
        const text = "S0meT3xtW1thSp4ce";
        const result = RemoveSpaces(text);
        expect(result).toBe("S0meT3xtW1thSp4ce");
    });

    it('should return same value if is not string', () => {
        const invalid = 100 as any;
        const result = RemoveSpaces(invalid);
        expect(result).toBe(100);
    });
});
