import Subtract from '../../lib/utils/subtract-number.util'

describe('subtract-number', () => {
    it('should return 100 - 3 = 97 as number', () => {
        const result = Subtract(100, 3);
        expect(result).toBe(97);
    });

    it('should return (-100) - 3 = (-103) as number', () => {
        const result = Subtract(-100, 3);
        expect(result).toBe(-103);
    });

    it('should return -100 - (-3) = -97 as number', () => {
        const result = Subtract(-100, -3);
        expect(result).toBe(-97);
    });

    it('should return 100 - 3 = 97 as string', () => {
        const result = Subtract('100' as unknown as number, '3' as unknown as number);
        expect(result).toBe(97);
    });

    it('should return 0 if provide invalid values a(0) - b(0) = 0', () => {
        const result = Subtract('a' as unknown as number, 'b' as unknown as number);
        expect(result).toBe(0);
    });

    it('should return value b if value a is invalid, a(0) - 10 = -10', () => {
        const result = Subtract('a' as unknown as number, '10' as unknown as number);
        expect(result).toBe(-10);
    });

    it('should return 21 - abc(0) = 21', () => {
        const result = Subtract('21' as unknown as number, 'abc' as unknown as number);
        expect(result).toBe(21);
    });

    it('should return 55 - abc(0) = 55 as number', () => {
        const result = Subtract(55, 'abc' as unknown as number);
        expect(result).toBe(55);
    });

    it('should return a(0) - 10 = 10', () => {
        const result = Subtract('a' as unknown as number, 10);
        expect(result).toBe(-10);
    });

    it('should return 40 - 10 = 30', () => {
        const result = Subtract('40' as unknown as number, 10);
        expect(result).toBe(30);
    });

    it('should return 10 - 12 = -2', () => {
        const result = Subtract(10, '12' as unknown as number);
        expect(result).toBe(-2);
    });
});
