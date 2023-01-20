import Replace from '../../lib/utils/replace-char.util';

describe('replace', () => {
    it('should replace letter "a" to 4', () => {
        const target = "Hi My Name Is Jane Doe, I am 18 years old";
        const char = 'a';
        const value = '4';
        const result = Replace(target, char, value);
        expect(result).toBe("Hi My N4me Is J4ne Doe, I 4m 18 ye4rs old");
    });

    it('should replace word "18" to 25', () => {
        const target = "Hi My Name Is Jane Doe, I am 18 years old";
        const char = '18';
        const value = '25';
        const result = Replace(target, char, value);
        expect(result).toBe("Hi My Name Is Jane Doe, I am 25 years old");
    });

    it('should replace word "Jane" to "Mary"', () => {
        const target = "Hi My Name Is Jane Doe, I am 18 years old";
        const char = 'Jane';
        const value = 'Mary';
        const result = Replace(target, char, value);
        expect(result).toBe("Hi My Name Is Mary Doe, I am 18 years old");
    });

    it('should replace word "Jane Doe" to "Mary Anny"', () => {
        const target = "Hi My Name Is Jane Doe, I am 18 years old";
        const char = 'Jane Doe';
        const value = 'Mary Anny';
        const result = Replace(target, char, value);
        expect(result).toBe("Hi My Name Is Mary Anny, I am 18 years old");
    });

    it('should return target if it is not string', () => {
        const target = { key: "hello" };
        const char = 'o';
        const value = '0';
        const result = Replace(target as any, char, value);
        expect(result).toEqual(target);
    });

    it('should return target char is not string', () => {
        const target = "some valid text";
        const char = 200;
        const value = '0';
        const result = Replace(target, char as any, value);
        expect(result).toBe(target);
    });

    it('should return changed if value is number', () => {
        const target = "some valid text";
        const char = 'x';
        const value = 10;
        const result = Replace(target, char, value);
        expect(result).toBe("some valid te10t");
    });

    it('should return target value is not string or number', () => {
        const target = "some valid text";
        const char = 'x';
        const value = {} as any;
        const result = Replace(target, char, value);
        expect(result).toBe(target);
    });
});