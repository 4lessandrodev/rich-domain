import Multiply from '../../lib/utils/multiply-number.util';

describe('multiply-number', () => {
    it('should return 77 x 1.2 = 92.4', () => {
        const result = Multiply(77, 1.2);
        expect(result).toBe(92.4);
    });

    it('should return 77 x -1.2 = -92.4', () => {
        const result = Multiply(77, -1.2);
        expect(result).toBe(-92.4);
    });

    it('should return -77 x 1.2 = -92.4', () => {
        const result = Multiply(-77, 1.2);
        expect(result).toBe(-92.4);
    });

    it('should return -77 x -1.2 = 92.4', () => {
        const result = Multiply(-77, -1.2);
        expect(result).toBe(92.4);
    });

    it('should return 21 x 3 = 63', () => {
        const result = Multiply('21' as unknown as number, '3' as unknown as number);
        expect(result).toBe(63);
    });

    it('should return a x b = 0', () => {
        const result = Multiply('a' as unknown as number, 'b' as unknown as number);
        expect(result).toBe(0);
    });

    it('should return a x 10 = 10', () => {
        const result = Multiply('a' as unknown as number, '10' as unknown as number);
        expect(result).toBe(0);
    });

    it('should return 21 x abc = 0 ', () => {
        const result = Multiply('21' as unknown as number, 'abc' as unknown as number);
        expect(result).toBe(0);
    });

    it('should return 55 x abc = 0', () => {
        const result = Multiply(55, 'abc' as unknown as number);
        expect(result).toBe(0);
    });

    it('should return a x 10 = 0', () => {
        const result = Multiply('a' as unknown as number, 10);
        expect(result).toBe(0);
    });

    it('should return 42 x 10 = 420', () => {
        const result = Multiply('42' as unknown as number, 10);
        expect(result).toBe(420);
    });

    it('should return 42 x 10.3 = 432.6', () => {
        const result = Multiply(42, '10.3' as unknown as number);
        expect(result).toBe(432.6);
    });
});
