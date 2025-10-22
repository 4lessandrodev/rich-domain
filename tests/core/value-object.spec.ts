import { Class, ValueObject } from "../../lib/core";
import { Adapter } from "../../lib/types";
import { Utils, Validator } from "../../lib/utils";

describe('value-object', () => {

	describe('native static methods', () => {

		interface Props {
			value: string;
		}
		class GenericVo extends ValueObject<Props> {
			constructor(props: Props) {
				super(props)
			}

			public tools() {
				return {
					staticValidator: GenericVo.validator,
					validator: this.validator,
					staticUtils: GenericVo.util,
					utils: this.util
				}
			}

			public static tools() {
				return {
					staticValidator: GenericVo.validator,
					validator: this.validator,
					staticUtils: GenericVo.util,
					utils: this.util
				}
			}


			public static create(props: Props): Promise<GenericVo | null> {
				if(props === null || typeof props === 'undefined') return Promise.resolve(null);
				return Promise.resolve(new GenericVo(props))
			}
		}

		it('utils and validator must be available', () => {
			const instance = new GenericVo({ value: 'hello' });
			expect(instance.tools().staticUtils).toBeInstanceOf(Utils);
			expect(instance.tools().utils).toBeInstanceOf(Utils);
			expect(instance.tools().staticValidator).toBeInstanceOf(Validator);
			expect(instance.tools().validator).toBeInstanceOf(Validator);

			expect(GenericVo.tools().staticUtils).toBeInstanceOf(Utils);
			expect(GenericVo.tools().utils).toBeInstanceOf(Utils);
			expect(GenericVo.tools().staticValidator).toBeInstanceOf(Validator);
			expect(GenericVo.tools().validator).toBeInstanceOf(Validator);
		});

		it('should return fails if provide a null value', async () => {
			const obj = await GenericVo.create(null as any);
			expect(obj).toBeNull();
		});

		it('should return fails if provide an undefined value', async () => {
			const obj = await GenericVo.create(undefined as any);
			expect(obj).toBeNull();
		});

		it('should create a valid value-object', async () => {
			const obj = await GenericVo.create({ value: 'Hello World' });
			expect(obj).not.toBeNull();
			expect(obj?.get('value')).toBe('Hello World');
		});

	});

	describe('override native static methods', () => {

		interface Props {
			value: string;
		}
		class GenericVo extends ValueObject<Props> {
			constructor(props: Props) {
				super(props)
			}

			public static isValidProps(): boolean {
				return true;
			}

			public static create(props: any): Promise<GenericVo | null> {
				return Promise.resolve(new GenericVo(props));
			}
		}

		it('should return success if provide a null value', async () => {
			const obj = await GenericVo.create(null);
			expect(obj).not.toBeNull();
		});

		it('should return success if provide an undefined value', async () => {
			const obj = await GenericVo.create(undefined);
			expect(obj).not.toBeNull();
		});

		it('should create a valid value-object', async () => {
			const obj = await GenericVo.create({ value: 'Hello World' });
			expect(obj).not.toBeNull();
			expect(obj?.get('value')).toBe('Hello World');
		});

	});

	describe('toObject method', () => {
		interface Props {
			street: string;
			number: number;
			city: City;
		}
		class City extends ValueObject<'A' | 'B' | 'C'> { }
		class Address extends ValueObject<Props> { }

		it('should verify resolved types', async () => {
			const address = new Address({
				city: new City('A'),
				number: 123,
				street: '5th Avenue'
			});
			const addressObject = await address.toObject()

			expect(addressObject).toEqual({
				city: 'A',
				number: 123,
				street: '5th Avenue'
			});
			expect(addressObject.city).toBe('A');
			expect(addressObject.number).toBe(123);
			expect(addressObject.street).toBe('5th Avenue');
			expect(addressObject.number.toExponential()).toBe('1.23e+2');
			expect(addressObject.number.toFixed()).toBe('123');
			expect(addressObject.city.concat('B')).toBe('AB');
			expect(addressObject.city.toLowerCase()).toBe('a');
			expect(addressObject.street.toUpperCase()).toBe('5TH AVENUE');
		});

		it('should be immutable', async () => {
			const address = new Address({
				city: new City('A'),
				number: 123,
				street: '5th Avenue'
			});
			const addressObject = await address.toObject()
			expect(Object.isFrozen(addressObject)).toBeTruthy();
			expect(() => (addressObject as any).city = 'B').toThrowError();
		});

	});

	describe('simple value-object', () => {

		interface Props {
			value: string;
		};

		class StringVo extends ValueObject<Props> {
			private constructor(props: Props) {
				super(props);
			}

			public static create(props: Props): Promise<StringVo | null> {
				return Promise.resolve(new StringVo(props));
			}
		}

		it('should create a valid value-object', async () => {
			const obj = await StringVo.create({ value: 'Hello World' });
			expect(obj).not.toBeNull();
			expect(obj?.getRaw().value).toBe('Hello World');
		});

	});

	describe('hooks on value object result', () => {

		interface Props {
			value: string;
		};

		class StringVo extends ValueObject<Props> {
			private constructor(props: Props) {
				super(props);
			}

			public static create(props: Props): Promise<StringVo | null> {
				return Promise.resolve(new StringVo(props));
			}
		}

		it('should execute hook on create a valid value object', async () => {
			const obj = await StringVo.create({ value: 'Hello World' });
			expect(obj).not.toBeNull();
		});
	})

	describe('native validation', () => {

		interface Props {
			value: string;
			age: number;
		};

		class StringVo extends ValueObject<Props> {
			private constructor(props: Props) {
				super(props, { disableGetters: true });
			}

			public static create(props: Props): Promise<StringVo | null> {
				return Promise.resolve(new StringVo(props));
			}
		}

		it('should disable getter', async () => {
			const str = await StringVo.create({ value: 'hello', age: 7 });
			expect(() => str!.get('value')).toThrow();
		});

		it('should transform value object to object', async () => {
			class Sample extends ValueObject<string> {
				private constructor(props: string) {
					super(props);
				}
				public static create(props: string): Promise<Sample | null> {
					return Promise.resolve(new Sample(props));
				}
			};

			const valueObject = await Sample.create('Example');

			expect(await valueObject!.toObject()).toBe('Example');
		});


		it('should transform value object to object', async () => {
			class Sample extends ValueObject<{ value: string }> {
				private constructor(props: { value: string }) {
					super(props);
				}
				public static create(props: { value: string }): Promise<Sample | null> {
					return Promise.resolve(new Sample(props));
				}
			};

			const valueObject = await Sample.create({ value: 'Sample' });

			expect(await valueObject!.toObject()).toEqual({ value: 'Sample' });
		});

		it('should transform value object to object', async () => {

			class Sample extends ValueObject<{ value: string, foo: string }> {
				private constructor(props: { value: string, foo: string }) {
					super(props);
				}
				public static create(props: { value: string, foo: string }): Promise<Sample | null> {
					return Promise.resolve(new Sample(props));
				}
			};

			const sample = await Sample.create({ value: 'Sample', foo: 'bar' });

			class Obj extends ValueObject<{ value: Sample, other: string }> {
				private constructor(props: { value: Sample, other: string }) {
					super(props);
				}
				public static create(props: { value: Sample, other: string }): Promise<Obj | null> {
					return Promise.resolve(new Obj(props));
				}
			};

			const result = await Obj.create({ value: sample!, other: 'Other Sample' });

			expect(await result!.toObject()).toEqual({
				value: { value: 'Sample', foo: 'bar' },
				other: 'Other Sample'
			})
		});

		it('should clone a value object with success', async () => {
			class Sample extends ValueObject<{ value: string, foo: string }> {
				private constructor(props: { value: string, foo: string }) {
					super(props);
				}
				public static create(props: { value: string, foo: string }): Promise<Sample | null> {
					return Promise.resolve(new Sample(props));
				}
			};

			const sample = await Sample.create({ value: 'Sample', foo: 'bar' });

			const result = sample!.clone();

			expect(await sample!.toObject()).toEqual(await result.toObject())
		});

		it('should clone a value object with custom props', async () => {

			interface Props { value: string; foo: string; }
			class Sample extends ValueObject<Props> {
				private constructor(props: Props) {
					super(props);
				}

				public static create(props: Props): Promise<Sample | null> {
					return Promise.resolve(new Sample(props));
				}
			};

			const sample = await Sample.create({ value: 'Sample', foo: 'bar' });

			const result = sample!.clone({ foo: 'other' });

			expect(await result.toObject()).toEqual({ foo: 'other', value: 'Sample' });
		});

	});


	describe('create many', () => {

		interface Props1 {
			value: number;
			birthDay: Date;
		};

		class HumanAge extends ValueObject<Props1> {
			private constructor(props: Props1) {
				super(props);
			}

			public static isValidProps(props: Props1): boolean {
				const { number, date } = this.validator;
				const isValidAge = number(props.value).isBetween(0, 130);
				const isValidDate = date(props.birthDay).isBeforeNow();
				return isValidAge && isValidDate;
			}

			public static create(props: Props1): Promise<HumanAge | null> {
				if (!HumanAge.isValidProps(props)) return Promise.resolve(null);
				return Promise.resolve(new HumanAge(props));
			}
		}

		interface Props2 {
			value: string;
		}
		class GenericVo extends ValueObject<Props2> {
			constructor(props: Props2) {
				super(props)
			}
		}

		interface Props3 { value: string, foo: string };

		class Sample extends ValueObject<Props3> {
			private constructor(props: Props3) {
				super(props);
			}

			public static create(props: Props3): Promise<Sample | null> {
				return Promise.resolve(new Sample(props));
			}
		};

		it('should create many value objects', async () => {

			const payload = await ValueObject.createMany([
				{
					class: HumanAge,
					props: { value: 21, birthDay: new Date('2021-01-01') }
				},
				{
					class: GenericVo,
					props: { value: 'Hello' }
				},
				{
					class: Sample,
					props: { value: 'hello', foo: 'testing' }
				}
			]);

			const result = await payload.result;
			expect(result).not.toBeNull();
			expect(payload.data.total()).toBe(3);
		});

		it('should add fails if does not exists create function on class', async () => {

			const payload = await ValueObject.createMany([
				{
					class: {},
					props: { value: 21, birthDay: new Date() }
				},
				{
					class: GenericVo,
					props: { value: 'Hello' }
				},
				{
					class: Sample,
					props: { value: 'hello', foo: 'testing' }
				}
			]);

			const result = await payload.result;
			expect(result).toBeNull();
			expect(payload.data.total()).toBe(3);
		});

		it('should create many using DomainClass helper', async () => {
			const { result, data } = await ValueObject.createMany([
				Class<Props1>(HumanAge, { value: 21, birthDay: new Date('2021-01-01') }),
				Class<Props2>(GenericVo, { value: 'Hello' }),
				Class<Props3>(Sample, { value: 'hello', foo: 'testing' })
			]);

			const res = await result;
			expect(res).not.toBeNull();
			expect(data.total()).toBe(3);

			const age = await data.next() as HumanAge;
			const generic = await data.next() as GenericVo;
			const sample = await data.next() as Sample;

			expect(age).not.toBeNull();
			expect(generic).not.toBeNull();
			expect(sample).not.toBeNull();

			expect(age.getRaw().value).toBe(21);
			expect(generic.getRaw().value).toBe('Hello');
			expect(sample.getRaw().value).toBe('hello');
		});

		it('should fails if provide an empty array', async () => {
			const { result, data: iterator } = await ValueObject.createMany([]);

			const res = await result;
			expect(res).toBeNull();
			expect(iterator.total()).toBe(0);
		});

		it('should fails if provide an empty array', async () => {
			const { result, data: iterator } = await ValueObject.createMany({} as any);

			const res = await result;
			expect(res).toBeNull();
			expect(iterator.total()).toBe(0);
		});

		it('should fails if provide an invalid props', async () => {
			const { result, data: iterator } = await ValueObject.createMany([
				Class<Props1>(HumanAge, { value: 210 } as any),
			]);

			const res = await result;
			expect(res).toBeNull();
			expect(iterator.total()).toBe(1);
		})
	});

	describe('compare', () => {

		interface Props {
			value: string;
		}
		class Exam extends ValueObject<Props> {
			private constructor(props: Props) {
				super(props)
			}

			public static create(props: Props): Promise<Exam | null> {
				return Promise.resolve(new Exam(props));
			}
		};

		it('should to be equal another instance', async () => {
			const a = await Exam.create({ value: "hello there" });
			const b = await Exam.create({ value: "hello there" });

			expect(a!.isEqual(b!)).toBeTruthy();
		});

		it('should to be equal another instance', async () => {
			const a = await Exam.create({ value: "hello there" });
			const b = a!.clone();

			expect(a!.isEqual(b)).toBeTruthy();
		});

		it('should not to be equal another instance', async () => {
			const a = await Exam.create({ value: "hello there 1" });
			const b = await Exam.create({ value: "hello there 2" });

			expect(a!.isEqual(b!)).toBeFalsy();
		});
	});

	describe('utils', () => {

		interface Props {
			value: string;
		}
		class Exam extends ValueObject<Props> {
			private constructor(props: Props) {
				super(props)
			}

			RemoveSpaces(fromValue?: string): string {
				if (fromValue) return this.util.string(fromValue).removeSpaces();
				return this.util.string(this.props.value).removeSpaces();
			}

			RemoveSpecialChars(): string {
				return this.util.string(this.props.value).removeSpecialChars();
			}

			public static create(props: Props): Promise<Exam | null> {
				return Promise.resolve(new Exam(props));
			}
		};

		it('should remove spaces', async () => {
			const a = await Exam.create({ value: " Some Value With Many Space" });
			expect(a!.RemoveSpaces()).toBe('SomeValueWithManySpace');
		});

		it('should remove special chars', async () => {
			const a = await Exam.create({ value: "#Some@Value&With%Many*Special-Chars" });
			expect(a!.RemoveSpecialChars()).toBe('SomeValueWithManySpecialChars');
		});

		it('should remove special chars and spaces', async () => {
			const a = await Exam.create({ value: "#Some @Value &With %Many *Special-Chars" });
			expect(a!.RemoveSpaces(a!.RemoveSpecialChars())).toBe('SomeValueWithManySpecialChars');
		});
	});

	describe('compare props as object', () => {

		interface Props { value: string };
		class Simple extends ValueObject<Props> {
			constructor(props: Props) {
				super(props)
			}

			public static create(props: Props): Promise<Simple | null> {
				return Promise.resolve(new Simple(props));
			}
		}

		it('should infer type on compare', async () => {
			const a = await Simple.create({ value: 'a' });
			const b = await Simple.create({ value: 'b' });
			const c = await Simple.create({ value: 'a' });

			expect(a!.isEqual(b!)).toBeFalsy();
			expect(a!.isEqual(c!)).toBeTruthy();
		});

		it('should compare nullable or undefined', async () => {
			const a = await Simple.create({ value: 'a' });
			const b = await Simple.create({ value: 'b' });

			expect(a!.isEqual(null as unknown as Simple)).toBeFalsy();
			expect(b!.isEqual(undefined as unknown as Simple)).toBeFalsy();
		});

		it('should create a valid props object as value object', async () => {
			const primitive = await Simple.create({ value: 'TEST' });
			expect(typeof primitive!.getRaw().value).toBe('string');
			expect(typeof primitive!.get('value')).toBe('string');
			const obj = await primitive!.toObject();
			expect(typeof obj).toBe('object');

			expect(primitive!.getRaw().value).toBe('TEST');
			expect(primitive!.get('value')).toBe('TEST');
			expect(await primitive!.toObject()).toEqual({ value: 'TEST' });
		});

	});

	describe('primitive value object as string', () => {

		class Primitive extends ValueObject<string> {
			private constructor(value: string) {
				super(value)
			}

			public static create(value: string): Promise<Primitive | null> {
				return Promise.resolve(new Primitive(value));
			}
		};

		it('should create a valid primitive value object', async () => {
			const primitive = await Primitive.create('TEST');
			expect(typeof primitive!.getRaw()).toBe('string');
			expect(typeof primitive!.get('value')).toBe('string');
			const obj = await primitive!.toObject();
			expect(typeof obj).toBe('string');

			expect(primitive!.getRaw()).toBe('TEST');
			expect(primitive!.get('value')).toBe('TEST');
			expect(await primitive!.toObject()).toBe('TEST');
		});
	});

	describe('primitive value object as date', () => {

		class Primitive extends ValueObject<Date> {
			private constructor(value: Date) {
				super(value)
			}

			public static create(value: Date): Promise<Primitive | null> {
				return Promise.resolve(new Primitive(value));
			}
		};

		it('should create a valid primitive value object', async () => {
			const date = new Date('2024-04-01T00:00:00');
			const primitive = await Primitive.create(date);
			expect(primitive!.getRaw()).toBeInstanceOf(Date);
			expect(primitive!.get('value')).toBeInstanceOf(Date);
			expect(await primitive!.toObject()).toEqual(expect.any(Date));

			expect(primitive!.getRaw()).toBe(date);
			expect(primitive!.get('value')).toBe(date);
			expect(await primitive!.toObject()).toBe(date);
		});
	});

	describe('primitive value object as array', () => {

		class Primitive extends ValueObject<Array<number>> {
			private constructor(value: Array<number>) {
				super(value)
			}

			public static create(value: Array<number>): Promise<Primitive | null> {
				return Promise.resolve(new Primitive(value));
			}
		};

		it('should create a valid primitive value object', async () => {
			const primitive = await Primitive.create([1, 2, 3]);
			expect(primitive!.getRaw()).toEqual([1, 2, 3]);
			expect(primitive!.get('value')).toEqual([1, 2, 3]);
			expect(await primitive!.toObject()).toEqual([1, 2, 3]);
		});

		it('should create many primitive', async () => {
			const payload = await ValueObject.createMany([
				{
					class: Primitive,
					props: [1, 2],
				},
				{
					class: Primitive,
					props: [3, 4, 5],
				}
			]);

			const result = await payload.result;
			expect(result).not.toBeNull();
			const first = await payload.data.next();
			expect(first).toMatchInlineSnapshot(`
Primitive {
  "autoMapper": AutoMapper {
    "validator": Validator {},
  },
  "config": Object {
    "disableGetters": false,
    "disableSetters": false,
  },
  "props": Array [
    1,
    2,
  ],
  "util": Utils {},
  "validator": Validator {},
}
`);
		});
	});

	describe('clone', () => {

		class StringVo extends ValueObject<string> {
			public static init(value: string): StringVo {
				return new StringVo(value);
			}
		}

		// Number class
		class NumberVo extends ValueObject<number> {
			public static init(value: number): NumberVo {
				return new NumberVo(value);
			}
		}

		// Array class
		class ArrayVo extends ValueObject<any[]> {
			public static init(value: any[]): ArrayVo {
				return new ArrayVo(value);
			}
		}

		// Symbol class
		class SymbolVo extends ValueObject<Symbol> {
			public static init(value: Symbol): SymbolVo {
				return new SymbolVo(value);
			}
		}

		// Date class
		class DateVo extends ValueObject<Date> {
			public static init(value: Date): DateVo {
				return new DateVo(value);
			}
		}

		// Object class
		class ObjectVo extends ValueObject<{ value: string }> {
			public static init(value: { value: string }): ObjectVo {
				return new ObjectVo(value);
			}
		}

		interface CProps {
			items: ArrayVo;
			name: StringVo;
			type: SymbolVo;
			profile: ObjectVo;
			index: NumberVo;
		};
		class Complex extends ValueObject<CProps & {}> {
			public static init(props: CProps): Complex {
				return new Complex(props);
			}
			public static create(props: CProps): Promise<Complex | null> {
				return Promise.resolve(new Complex(props));
			}
		}

		it('should clone string vo with success', async () => {
			const str = StringVo.init('sample');
			expect(str.get('value')).toBe('sample');
			expect(await str.toObject()).toBe('sample');

			const copy = str.clone();

			expect(copy.get('value')).toBe('sample');
			expect(await copy.toObject()).toBe('sample');
			expect(copy.isEqual(str)).toBeTruthy();
			expect(copy.isEqual(StringVo.init('other'))).toBeFalsy();
		});

		// Test for NumberVo
		it('should clone number vo with success', async () => {
			const num = NumberVo.init(42);
			expect(num.get('value')).toBe(42);
			expect(await num.toObject()).toBe(42);

			const copy = num.clone();

			expect(copy.get('value')).toBe(42);
			expect(await copy.toObject()).toBe(42);
			expect(copy.isEqual(num)).toBeTruthy();
			expect(copy.isEqual(NumberVo.init(43))).toBeFalsy();
		});

		// Test for ArrayVo
		it('should clone array vo with success', async () => {
			const arr = ArrayVo.init([1, 2, 3]);
			expect(arr.get('value')).toEqual([1, 2, 3]);
			expect(await arr.toObject()).toEqual([1, 2, 3]);

			const copy = arr.clone();

			expect(copy.get('value')).toEqual([1, 2, 3]);
			expect(await copy.toObject()).toEqual([1, 2, 3]);
			expect(copy.isEqual(arr)).toBeTruthy();
			expect(copy.isEqual(ArrayVo.init([4, 5, 6]))).toBeFalsy();
		});

		// Test for SymbolVo
		it('should clone symbol vo with success', async () => {
			const sym = SymbolVo.init(Symbol('test'));
			expect(sym.get('value')).toBe('test');
			expect(await sym.toObject()).toBe('test');

			const copy = sym.clone();

			expect(copy.get('value')).toBe('test');
			expect(await copy.toObject()).toBe('test');
			expect(copy.isEqual(sym)).toBeTruthy();
			expect(copy.isEqual(SymbolVo.init(Symbol('other')))).toBeFalsy();
		});

		// Test for DateVo
		it('should clone date vo with success', async () => {
			const date = new Date();
			const dateVo = DateVo.init(date);
			expect(dateVo.get('value')).toEqual(date);
			expect(await dateVo.toObject()).toEqual(date);

			const copy = dateVo.clone();

			expect(copy.get('value')).toEqual(date);
			expect(await copy.toObject()).toEqual(date);
			expect(copy.isEqual(dateVo)).toBeTruthy();
			expect(copy.isEqual(DateVo.init(new Date('2020-01-01')))).toBeFalsy();
		});

		// Test for ObjectVo
		it('should clone object vo with success', async () => {
			const obj = { value: 'sample' };
			const objVo = ObjectVo.init(obj);
			expect(objVo.get('value')).toEqual('sample');
			expect(await objVo.toObject()).toEqual(obj);

			const copy = objVo.clone();

			expect(copy.get('value')).toEqual('sample');
			expect(await copy.toObject()).toEqual(obj);
			expect(copy.isEqual(objVo)).toBeTruthy();
			expect(copy.isEqual(ObjectVo.init({ value: 'other' }))).toBeFalsy();
		});

		// Test for Complex
		it('should clone object vo with success', async () => {
			const props: CProps = {
				index: NumberVo.init(1),
				items: ArrayVo.init([1, 2, 3]),
				name: StringVo.init('sample'),
				profile: ObjectVo.init({ value: 'Jane' }),
				type: SymbolVo.init(Symbol('lorem'))
			};
			const objVo = Complex.init(props);
			const obj = await objVo.toObject();
			expect(obj).toMatchInlineSnapshot(`
Object {
  "index": 1,
  "items": Array [
    1,
    2,
    3,
  ],
  "name": "sample",
  "profile": Object {
    "value": "Jane",
  },
  "type": "lorem",
}
`);

			expect(objVo.get('items').get('value'))
			expect(objVo.get('type').get('value')).toBe('lorem');
			// expect(objVo.get('value')).toEqual(props);
			expect(await objVo.toObject()).toEqual({
				"index": 1,
				"items": [
					1,
					2,
					3,
				],
				"name": "sample",
				"profile": {
					"value": "Jane",
				},
				"type": "lorem",
			});

			const copy: Complex = objVo.clone();

			expect(await copy.toObject()).toEqual({
				"index": 1,
				"items": [
					1,
					2,
					3,
				],
				"name": "sample",
				"profile": {
					"value": "Jane",
				},
				"type": "lorem",
			});
			expect(copy.isEqual(objVo)).toBeTruthy();
			expect(copy.isEqual(Complex.init({ ...props, index: NumberVo.init(2) }))).toBeFalsy();
		});
	});

	describe('init', () => {

		class Name extends ValueObject<string> {
			constructor(name: string) {
				super(name);
			}
		};

		it('should throw error if init is not implemented', () => {
			const init = () => Name.init('Jane');
			expect(init).toThrowError('method not implemented: init');
		});

		class Custom extends Name {
			private constructor(name: string) {
				super(name)
			}

			public static init(value: string): Custom {
				return new Custom(value);
			}
		}

		it('should init with success', () => {

			const name = Custom.init('Jane');
			expect(name.get('value')).toBe('Jane');

		});

		it('should adapt using adapter', async () => {
			class AdaptName implements Adapter<Custom, string> {
				adaptOne(item: Custom): string {
					return item.get('value') + ' Doe';
				}
			}
			const name = Custom.init('Jane');
			expect(await name.toObject(new AdaptName())).toBe('Jane Doe');
		});

		it('should adapt many', () => {

			class AdaptName implements Adapter<Custom, string> {
				adaptOne(item: Custom): string {
					return item.get('value') + ' Doe';
				}

				adaptMany(itens: Custom[]): string[] {
					return itens.map(this.adaptOne);
				}
			}

			const adapter = new AdaptName();
			const names = ['Jane', 'John'].map(Custom.init)
			const values = adapter.adaptMany(names);
			expect(values).toEqual(['Jane Doe', 'John Doe']);
		});
	});
});
