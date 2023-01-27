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

        it('should do not remove specific char', () => {
            const text = "4gileCouch4Devs";
           const result = Utils.string(text).removeChar('4');
            expect(result).toBe("gileCouchDevs");
        });
    
        it('should return same value if is not string', () => {
            const invalid = 100 as any;
            const result = Utils.string(invalid).removeSpecialChars();
            expect(result).toBe(100);
        });

        it('should replace value "a" to 4', () => {  
            const target = "Hi, My Name Is Jane Doe, I am 18 years old";
            const char = 'a';
            const value = '4';
            const result = Utils.string(target).replace(char).to(value);
            expect(result).toBe("Hi, My N4me Is J4ne Doe, I 4m 18 ye4rs old");
        });

        it('should remove numbers with success', () => {  
            const target = "I have 7 cars, I am 31 years old, the status is 200";
            const result = Utils.string(target).removeNumbers();
            expect(result).toBe("I have  cars, I am  years old, the status is ");
        });

        it('should remove numbers with success', () => {  
            const target = "404";
            const result = Utils.string(target).removeNumbers();
            expect(result).toBe("");
        });
    });

    describe('numbers', () => {
        it('should multiply 70 x 7 = 490 as number', () => {  
            const result = Utils.number(70).multiplyBy(7);
            expect(result).toBe(490);
        });

        it('should multiply 70 x 7 = 490 as string', () => {  
            const result = Utils.number('70' as any).multiplyBy('7' as any);
            expect(result).toBe(490);
        });

        it('should divide 70 / 7 = 10 as number', () => {  
            const result = Utils.number(70).divideBy(7);
            expect(result).toBe(10);
        });

        it('should divide 70 / 7 = 10 as string', () => {  
            const result = Utils.number('70' as any).divideBy('7' as any);
            expect(result).toBe(10);
        });

        it('should subtract 70 - 7 = 63 as number', () => {  
            const result = Utils.number(70).subtract(7);
            expect(result).toBe(63);
        });

        it('should divide 70 - 7 = 63 as string', () => {  
            const result = Utils.number('70' as any).subtract('7' as any);
            expect(result).toBe(63);
        });

        it('should sum 70 + 7 = 77 as number', () => {  
            const result = Utils.number(70).sum(7);
            expect(result).toBe(77);
        });

        it('should sum 70 + 7 = 77 as string', () => {  
            const result = Utils.number('70' as any).sum('7' as any);
            expect(result).toBe(77);
        });



        it('should multiply 70 x 7 = 490 as number', () => {  
            const result = Utils.number(70).multiplyBy(7, { fractionDigits: 3 });
            expect(result).toBe(490);
        });

        it('should multiply 70 x 7 = 490 as string', () => {  
            const result = Utils.number('70' as any).multiplyBy('7' as any, { fractionDigits: 3 });
            expect(result).toBe(490);
        });

        it('should divide 70 / 7 = 10 as number', () => {  
            const result = Utils.number(70).divideBy(7);
            expect(result).toBe(10);
        });

        it('should divide 0.02 / 0.03 = 10 as number', () => {  
            const result = Utils.number(0.02).divideBy(0.03, { fractionDigits: 2 });
            expect(result).toBe(0.66);
        });

        it('should divide 0,02 / 0.03 = 10 as string', () => {  
            const result = Utils.number('0.02' as any).divideBy('0.03' as any, { fractionDigits: 3 });
            expect(result).toBe(0.666);
        });

        it('should divide 0,02 / 0.03 = 10 as string', () => {  
            const result = Utils.number('0.02' as any).divideBy('0.03' as any);
            expect(result).toBe(0.66666);
        });

        it('should subtract 70 - 7 = 63 as number', () => {  
            const result = Utils.number(70).subtract(7, { fractionDigits: 3 });
            expect(result).toBe(63);
        });

        it('should divide 70 - 7 = 63 as string', () => {  
            const result = Utils.number('70' as any).subtract('7' as any, { fractionDigits: 3 });
            expect(result).toBe(63);
        });

        it('should sum 70 + 7 = 77 as number', () => {  
            const result = Utils.number(70).sum(7, { fractionDigits: 3 });
            expect(result).toBe(77);
        });

        it('should sum 70 + 7 = 77 as string', () => {  
            const result = Utils.number('70' as any).sum('7' as any, { fractionDigits: 3 });
            expect(result).toBe(77);
        });
    });

    describe('date', () => {
        const date = new Date('2001-09-09T01:46:39.999Z');

        it('should add 5 minutes', () => {
            const result = Utils.date(date).add(5).minutes();
            expect(result.toISOString()).toBe('2001-09-09T01:51:39.999Z')
        });

        it('should add 5 hours', () => {
            const result = Utils.date(date).add(5).hours();
            expect(result.toISOString()).toBe('2001-09-09T06:46:39.999Z')
        });

        it('should add 5 days', () => {
            const result = Utils.date(date).add(5).days();
            expect(result.toISOString()).toBe('2001-09-14T01:46:39.999Z')
        });

        it('should add 5 weeks', () => {
            const result = Utils.date(date).add(5).weeks();
            expect(result.toISOString()).toBe('2001-10-14T01:46:39.999Z')
        });

        it('should add 5 months', () => {
            const result = Utils.date(date).add(5).months();
            expect(result.toISOString()).toBe('2002-02-06T01:46:39.999Z')
        });

        it('should add 5 years', () => {
            const result = Utils.date(date).add(5).years();
            expect(result.toISOString()).toBe('2006-09-08T01:46:39.999Z')
        });

        it('should remove 5 minutes', () => {
            const result = Utils.date(date).remove(5).minutes();
            expect(result.toISOString()).toBe('2001-09-09T01:41:39.999Z')
        });

        it('should remove 5 hours', () => {
            const result = Utils.date(date).remove(5).hours();
            expect(result.toISOString()).toBe('2001-09-08T20:46:39.999Z')
        });

        it('should remove 5 days', () => {
            const result = Utils.date(date).remove(5).days();
            expect(result.toISOString()).toBe('2001-09-04T01:46:39.999Z')
        });

        it('should remove 5 weeks', () => {
            const result = Utils.date(date).remove(5).weeks();
            expect(result.toISOString()).toBe('2001-08-05T01:46:39.999Z')
        });

        it('should remove 5 months', () => {
            const result = Utils.date(date).remove(5).months();
            expect(result.toISOString()).toBe('2001-04-12T01:46:39.999Z')
        });

        it('should remove 5 years', () => {
            const result = Utils.date(date).remove(5).years();
            expect(result.toISOString()).toBe('1996-09-10T01:46:39.999Z')
        });
    })
});
