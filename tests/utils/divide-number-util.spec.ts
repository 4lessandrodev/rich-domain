import Divide from '../../lib/utils/divide-number.util'

describe('divide-number', () => {
    it('should return 100 / 3 = 33.33333 as number', () => {
        const result = Divide(100, 3);
        expect(result).toBe(33.33333);
    });

    it('should return 100 / 3 = 33.33333 as string', () => {
        const result = Divide('100' as unknown as number, '3' as unknown as number);
        expect(result).toBe(33.33333);
    });

    it('should return 0 if provide invalid values, a / b = 0', () => {
        const result = Divide('a' as unknown as number, 'b' as unknown as number);
        expect(result).toBe(0);
    });

    it('should return value b if value a is invalid, a / 10 = 0', () => {
        const result = Divide('a' as unknown as number, '10' as unknown as number);
        expect(result).toBe(0);
    });

    it('should return 21 / abc = 0', () => {
        const result = Divide('21' as unknown as number, 'abc' as unknown as number);
        expect(result).toBe(0);
    });

    it('should return 55 / abc = 0 as number', () => {
        const result = Divide(55, 'abc' as unknown as number);
        expect(result).toBe(0);
    });

    it('should return a / 10 = 0', () => {
        const result = Divide('a' as unknown as number, 10);
        expect(result).toBe(0);
    });

    it('should return 42 / 10 = 4.2', () => {
        const result = Divide('42' as unknown as number, 10);
        expect(result).toBe(4.2);
    });

    it('should return 42 / 10 = 4', () => {
        const result = Divide(40, '10' as unknown as number);
        expect(result).toBe(4);
    });
});
