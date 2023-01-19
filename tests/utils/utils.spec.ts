import Utils from '../../lib/utils/util';

describe('utils', () => {

    describe('string', () => {
        it('should remove space with success', () => {
            const text = " Some Text With Space ";
            const result = Utils.string(text).removeSpaces();
            expect(result).toBe("SomeTextWithSpace");
        });
    
        it('should do not remove numbers', () => {
            const text = "S0meT3xtW1thSp4ce";
            const result = Utils.string(text).removeSpaces();
            expect(result).toBe("S0meT3xtW1thSp4ce");
        });
    
        it('should return same value if is not string', () => {
            const invalid = 100 as any;
            const result = Utils.string(invalid).removeSpaces();
            expect(result).toBe(100);
        });

        it('should remove special char with success', () => {
            const text = "Some #Text @With Special&* Chars";
           const result = Utils.string(text).removeSpecialChars();
            expect(result).toBe("Some Text With Special Chars");
        });
    
        it('should do not remove numbers', () => {
            const text = "S0meT3xtW1thSp4ce";
           const result = Utils.string(text).removeSpecialChars();
            expect(result).toBe("S0meT3xtW1thSp4ce");
        });
    
        it('should return same value if is not string', () => {
            const invalid = 100 as any;
            const result = Utils.string(invalid).removeSpecialChars();
            expect(result).toBe(100);
        });
    })
});
