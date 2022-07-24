import { ID, Result, ValueObject } from "../../lib/core";
import { ICommand, IPropsValidation, IResult } from "../../lib/types";

describe('value-object', () => {

	describe('native static methods', () => {

		interface Props {
			value: string;
		}
		class GenericVo extends ValueObject<Props> {
			constructor(props: Props) {
				super(props)
			}
		}

		it('should return fails if provide a null value', () => {
			const obj = GenericVo.create(null);
			expect(obj.isFailure()).toBeTruthy();
		});

		it('should return fails if provide an undefined value', () => {
			const obj = GenericVo.create(undefined);
			expect(obj.isFailure()).toBeTruthy();
		});

		it('should create a valid value-object', () => {
			const obj = GenericVo.create({ value: 'Hello World' });
			expect(obj.isFailure()).toBeFalsy();
			expect(obj.value().get('value')).toBe('Hello World');
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
		}

		it('should return success if provide a null value', () => {
			const obj = GenericVo.create(null);
			expect(obj.isSuccess()).toBeTruthy();
		});

		it('should return success if provide an undefined value', () => {
			const obj = GenericVo.create(undefined);
			expect(obj.isSuccess()).toBeTruthy();
		});

		it('should create a valid value-object', () => {
			const obj = GenericVo.create({ value: 'Hello World' });
			expect(obj.isFailure()).toBeFalsy();
			expect(obj.value().get('value')).toBe('Hello World');
		});

	});

	describe('simple value-object', () => {

		interface Props {
			value: string;
		};

		class StringVo extends ValueObject<Props>{
			private constructor(props: Props) {
				super(props);
			}

			public static create(props: Props): IResult<ValueObject<Props>, string> {
				return Result.success(new StringVo(props));
			}
		}

		it('should create a valid value-object', () => {
			const obj = StringVo.create({ value: 'Hello World' });
			expect(obj.isFailure()).toBeFalsy();
			expect(obj.value().get('value')).toBe('Hello World');
		});

		it('should change value with success', () => {
			const obj = StringVo.create({ value: 'Hello World' });
			expect(obj.value().get('value')).toBe('Hello World');
			obj.value().set('value').to('Changed');
			expect(obj.value().get('value')).toBe('Changed');
		});
	});

	describe('hooks on value object result', () => {

		interface Props {
			value: string;
		};

		class StringVo extends ValueObject<Props>{
			private constructor(props: Props) {
				super(props);
			}

			public static create(props: Props): IResult<ValueObject<Props>, string> {
				return Result.success(new StringVo(props));
			}
		}

		class Command implements ICommand<string, string> {
			execute(data: string): string {
				return data;
			}
		}

		it('should execute hook on create a valid value object', () => {
			const data = 'value object created with success';
			const obj = StringVo.create({ value: 'Hello World' });
			const payload = obj.execute(new Command()).withData(data).on('success');
			expect(payload).toBe('value object created with success');
		});
	})

	describe('native validation', () => {

		interface Props {
			value: string;
			age: number;
		};

		class StringVo extends ValueObject<Props>{
			private constructor(props: Props) {
				super(props);
			}

			validation<Key extends keyof Props>(key: Key, value: Props[Key]): boolean {

				const options: IPropsValidation<Props> = {
					value: (value: string) => value.length < 15,
					age: (value: number) => value > 0 && value < 130
				}

				return options[key](value);
			};

			public static create(props: Props): IResult<ValueObject<Props>, string> {
				return Result.success(new StringVo(props));
			}
		}

		it('should set and change methods use native validation', () => {
			const str = StringVo.create({ value: 'hello', age: 7 });
			expect(str.value().get('value')).toBe('hello');
			str.value().set('value').to('changed value');
			expect(str.value().get('value')).toBe('changed value');
			str.value().set('value').to('long and invalid value not pass in validation');
			expect(str.value().get('value')).toBe('changed value');
			str.value().set('age').to(18);
			expect(str.value().get('age')).toBe(18);
			str.value().set('age').to(220);
			expect(str.value().get('age')).toBe(18);
		});

		it('should transform value object to object', () => {
			class Sample extends ValueObject<string>{
				private constructor(props: string) {
					super(props);
				}
			};

			const valueObject = Sample.create('Example');

			expect(valueObject.value().toObject()).toBe('Example');
		});


		it('should transform value object to object', () => {
			class Sample extends ValueObject<{ value: string }>{
				private constructor(props: { value: string }) {
					super(props);
				}
			};

			const valueObject = Sample.create({ value: 'Sample' });

			expect(valueObject.value().toObject()).toBe('Sample');
		});

		it('should transform value object to object', () => {

			class Sample extends ValueObject<{ value: string, foo: string }>{
				private constructor(props: { value: string, foo: string }) {
					super(props);
				}
			};

			const sample = Sample.create({ value: 'Sample', foo: 'bar' });

			class Obj extends ValueObject<{ value: Sample, other: string }> {
				private constructor(props: { value: Sample, other: string }) {
					super(props);
				}
			};

			const result = Obj.create({ value: sample.value(), other: 'Other Sample' });

			expect(result.value().toObject()).toEqual({
				value: { value: 'Sample', foo: 'bar' },
				other: 'Other Sample'
			})
		});

		it('should clone a value object with success', () => {
			class Sample extends ValueObject<{ value: string, foo: string }>{
				private constructor(props: { value: string, foo: string }) {
					super(props);
				}
			};

			const sample = Sample.create({ value: 'Sample', foo: 'bar' });

			const result = sample.value().clone();

			expect(sample.value().toObject()).toEqual(result.value().toObject())
		});

		it('should navigate for history', () => {

			interface Props { value: string, foo: string };

			class Sample extends ValueObject<Props>{
				private constructor(props: Props) {
					super(props);
				}

				public static create(props: Props): IResult<Sample> {
					return Result.success(new Sample(props));
				}
			};

			const sample = Sample.create({ value: 'Sample', foo: 'bar' });

			expect(sample.value().history().count()).toBe(1);

			sample.value().set('foo').to('changed');

			expect(sample.value().history().count()).toBe(2);
			expect(sample.value().get('value')).toBe('Sample');
			expect(sample.value().get('foo')).toBe('changed'); // changed

			sample.value().set('value').to('changed2'); // changed
			expect(sample.value().get('value')).toBe('changed2');

			sample.value().history().back();
			expect(sample.value().get('value')).toBe('changed2');
			expect(sample.value().get('foo')).toBe('changed');

			sample.value().history().back();
			expect(sample.value().get('value')).toBe('Sample');

			sample.value().history().forward();
			expect(sample.value().get('value')).toBe('changed2');

			expect(sample.value().history().list()).toHaveLength(3);
			sample.value().history().snapshot();
			expect(sample.value().history().list()).toHaveLength(4);
		});

		it('should back to a token', () => {
			interface Props { value: string, foo: string };

			class Sample extends ValueObject<Props>{
				private constructor(props: Props) {
					super(props);
				}

				public static create(props: Props): IResult<Sample> {
					return Result.success(new Sample(props));
				}
			};

			const sample = Sample.create({ value: 'Sample', foo: 'bar' });

			const step2 = ID.createShort();
			const step3 = ID.createShort();
			const step4 = ID.createShort();

			sample.value().change('foo', 'bar0');
			sample.value().change('foo', 'bar1');
			sample.value().history().snapshot(step2);

			sample.value().change('foo', 'bar2');
			sample.value().change('foo', 'bar3');
			sample.value().history().snapshot(step3);

			sample.value().change('foo', 'bar4');
			sample.value().change('foo', 'bar5');
			sample.value().history().snapshot(step4);

			expect(sample.value().get('foo')).toBe('bar5');
			sample.value().history().back(step2);

			expect(sample.value().get('foo')).toBe('bar2');

			sample.value().history().forward(step4);
			expect(sample.value().get('foo')).toBe('bar5');
		});
	});

	describe('disable set', () => {
		interface Props {
			value: number;
			birthDay: Date;
		};

		class HumanAge extends ValueObject<Props> {
			private constructor(props: Props) {
				super(props);
				this.validation.bind(this);
			}

			// the "set" function automatically will use this method to validate value before set it.
			validation<Key extends keyof Props>(key: Key, value: Props[Key]): boolean {

				const options: IPropsValidation<Props> = {
					value: _ => true,
					// on set false the prop never will be set
					birthDay: _ => false,
				}

				return options[key](value);
			};

			public static create(props: Props): IResult<ValueObject<Props>> {			
				return Result.success(new HumanAge(props));
			}
		}

		it('should disable set with success', () => {
			const result = HumanAge.create({ value: 10, birthDay: new Date('2022-01-01T03:00:00.000Z') });
			const age = result.value();
			
			expect(age.get('value')).toBe(10);
			
			age.set('birthDay').to(new Date());
			age.set('value').to(55);

			expect(age.get('birthDay')).toEqual(new Date('2022-01-01T03:00:00.000Z'));
			expect(age.get('value')).toBe(55);
		})
	})
});
