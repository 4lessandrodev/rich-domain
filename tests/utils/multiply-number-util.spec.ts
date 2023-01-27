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

    it('should return 10a x 2 = 20', () => {
        const result = Multiply('10a' as any, 2);
        expect(result).toBe(20);
    });

    it('should return 20 x 2a = 40', () => {
        const result = Multiply(20, '2a' as any);
        expect(result).toBe(40);
    });

    it('should return 15a x 3a = 45', () => {
        const result = Multiply('15a' as any, '3a' as any);
        expect(result).toBe(45);
    });

    it('should implement calc with success', () => {
        expect.assertions(11);
        const table : string[] = [];
        let i = 10;
        while(i >= 1){
            const result = Multiply(100, i, 9);
            const expected = Number(String(100 * i).slice(0, 12));
            table.push(`${100} x ${i} = ${result}`);
            expect(result).toBe(expected);
            i--;
        }

        expect(table).toMatchInlineSnapshot(`
Array [
  "100 x 10 = 1000",
  "100 x 9 = 900",
  "100 x 8 = 800",
  "100 x 7 = 700",
  "100 x 6 = 600",
  "100 x 5 = 500",
  "100 x 4 = 400",
  "100 x 3 = 300",
  "100 x 2 = 200",
  "100 x 1 = 100",
]
`);
    })
});
