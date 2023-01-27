import IsNaN from "../../lib/utils/is-nan.util"

describe('is-nan.util', () => {
    it('should string starts with letters is Nan', () => {
        const isN = IsNaN('abc123');
        expect(isN).toBeTruthy();
    });

    it('should string starts with numbers not is Nan', () => {
        const isN = IsNaN('123asdv');
        expect(isN).toBeFalsy();
    });

    it('should numbers not is Nan', () => {
        const isN = IsNaN(123);
        expect(isN).toBeFalsy();
    });
});
