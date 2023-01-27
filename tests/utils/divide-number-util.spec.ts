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

    it('should return 10a / 2 = 5', () => {
        const result = Divide('10a' as any, 2);
        expect(result).toBe(5);
    });

    it('should return 20 / 2a = 10', () => {
        const result = Divide(20, '2a' as any);
        expect(result).toBe(10);
    });

    it('should return 15a / 3a = 10', () => {
        const result = Divide('15a' as any, '3a' as any);
        expect(result).toBe(5);
    });

    it('should implement calc with success', () => {
        expect.assertions(11);
        const table: string[] = [];
        let i = 10;
        while(i >= 1){
            const result = Divide(100, i, 9);
            const expected = Number(String(100 / i).slice(0, 12));
            table.push(`${100} / ${i} = ${result}`);
            expect(result).toBe(expected);
            i--;
        }

        expect(table).toMatchInlineSnapshot(`
Array [
  "100 / 10 = 10",
  "100 / 9 = 11.111111111",
  "100 / 8 = 12.5",
  "100 / 7 = 14.285714285",
  "100 / 6 = 16.666666666",
  "100 / 5 = 20",
  "100 / 4 = 25",
  "100 / 3 = 33.333333333",
  "100 / 2 = 50",
  "100 / 1 = 100",
]
`);
    })
});
