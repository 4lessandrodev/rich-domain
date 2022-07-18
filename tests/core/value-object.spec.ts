import { Result, ValueObject } from "../../lib/core";
import { ICommand, IPropsValidation, IResult } from "../../lib/index.types";

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

	});
});
