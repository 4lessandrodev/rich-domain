import Sum from '../../lib/utils/sum-number.util';

describe('sum-number', () => {
    it('should return 93 + 7 = 100 as number', () => {
        const result = Sum(93, 7);
        expect(result).toBe(100);
    });

    it('should return 93 + (-3) = 90 as number', () => {
        const result = Sum(93, -3);
        expect(result).toBe(90);
    });

    it('should return (-93) + 3 = 90 as number', () => {
        const result = Sum(-93, 3);
        expect(result).toBe(-90);
    });

    it('should return (-90) + (-3) = (-93) as number', () => {
        const result = Sum(-90, -3);
        expect(result).toBe(-93);
    });

    it('should return 93.231 + 7.458 = 100 as number', () => {
        const result = Sum(93.231, 7.458);
        expect(result).toBe(100.689);
    });

    it('should return 93 + 4 = 33.33333 as string', () => {
        const result = Sum('93' as unknown as number, '4' as unknown as number);
        expect(result).toBe(97);
    });

    it('should return 0 if provide invalid values, a(0) + b(0) = 0', () => {
        const result = Sum('a' as unknown as number, 'b' as unknown as number);
        expect(result).toBe(0);
    });

    it('should return value b if value a is invalid a(0) + 10 = 10', () => {
        const result = Sum('a' as unknown as number, '10' as unknown as number);
        expect(result).toBe(10);
    });

    it('should return 21 + abc(0) = 21', () => {
        const result = Sum('21' as unknown as number, 'abc' as unknown as number);
        expect(result).toBe(21);
    });

    it('should return 55 + abc(0) = 55 as number', () => {
        const result = Sum(55, 'abc' as unknown as number);
        expect(result).toBe(55);
    });

    it('should return a(0) + 10 = 0', () => {
        const result = Sum('a' as unknown as number, 10);
        expect(result).toBe(10);
    });

    it('should return 42 + 10.2 = 52.2', () => {
        const result = Sum('42' as unknown as number, 10.2);
        expect(result).toBe(52.2);
    });

    it('should return 42 + 10 = 52', () => {
        const result = Sum(42, '10' as unknown as number);
        expect(result).toBe(52);
    });

    it('should return 10a + 2 = 12', () => {
        const result = Sum('10a' as any, 2);
        expect(result).toBe(12);
    });

    it('should return 20 + 2a = 22', () => {
        const result = Sum(20, '2a' as any);
        expect(result).toBe(22);
    });

    it('should return 15a + 3a = 18', () => {
        const result = Sum('15a' as any, '3a' as any);
        expect(result).toBe(18);
    });

    it('should implement calc with success', () => {
        expect.assertions(11);
        const table: string[] = [];
        let i = 10;
        while(i >= 1){
            const result = Sum(100, i, 9);
            const expected = Number(String(100 + i).slice(0, 12));
            table.push(`${100} + ${i} = ${result}`);
            expect(result).toBe(expected);
            i--;
        }

        expect(table).toMatchInlineSnapshot(`
Array [
  "100 + 10 = 110",
  "100 + 9 = 109",
  "100 + 8 = 108",
  "100 + 7 = 107",
  "100 + 6 = 106",
  "100 + 5 = 105",
  "100 + 4 = 104",
  "100 + 3 = 103",
  "100 + 2 = 102",
  "100 + 1 = 101",
]
`);
    })
});
