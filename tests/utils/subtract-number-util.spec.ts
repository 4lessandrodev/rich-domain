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

    it('should return value b if value a is invalid, a(0) - 10 = (-10)', () => {
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

    it('should return a(0) - 10 = (-10)', () => {
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

    it('should return 10a - 2 = 8', () => {
        const result = Subtract('10a' as any, 2);
        expect(result).toBe(8);
    });

    it('should return 20 - 2a = 18', () => {
        const result = Subtract(20, '2a' as any);
        expect(result).toBe(18);
    });

    it('should return 15a - 3a = 12', () => {
        const result = Subtract('15a' as any, '3a' as any);
        expect(result).toBe(12);
    });

    it('should implement calc with success', () => {
        expect.assertions(11);
        const table: string[] = [];
        let i = 10;
        while(i >= 1){
            const result = Subtract(100, i, 9);
            const expected = Number(String(100 - i).slice(0, 12));
            table.push(`${100} - ${i} = ${result}`);
            expect(result).toBe(expected);
            i--;
        }

        expect(table).toMatchInlineSnapshot(`
Array [
  "100 - 10 = 90",
  "100 - 9 = 91",
  "100 - 8 = 92",
  "100 - 7 = 93",
  "100 - 6 = 94",
  "100 - 5 = 95",
  "100 - 4 = 96",
  "100 - 3 = 97",
  "100 - 2 = 98",
  "100 - 1 = 99",
]
`);
    })
});
