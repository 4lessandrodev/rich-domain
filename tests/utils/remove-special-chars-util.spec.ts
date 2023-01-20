import RemoveChars from '../../lib/utils/remove-chars.util';
import { Validator } from '../../lib/utils/validator';

describe('remove-special-chars', () => {

    beforeAll(() => {
        Validator.create();
    })
    
    const callback = (char: string): boolean => Validator.create().string(char).isSpecialChar();

    it('should remove special char with success', () => {
        const text = "Some #Text @With Special&* Chars";
        const result = RemoveChars(text, callback);
        expect(result).toBe("Some Text With Special Chars");
    });

    it('should do not remove numbers', () => {
        const text = "S0meT3xtW1thSp4ce";
        const result = RemoveChars(text, callback);
        expect(result).toBe("S0meT3xtW1thSp4ce");
    });

    it('should return same value if is not string', () => {
        const invalid = 100 as any;
        const result = RemoveChars(invalid, callback);
        expect(result).toBe(100);
    });

    it('should remove only numbers', () => {
        const text = "S0meT3xtW1thSp4ce";
        const remove = (char: string) => ['0','3','1', '4'].includes(char);
        const result = RemoveChars(text, remove);
        expect(result).toBe("SmeTxtWthSpce");
    })
});
