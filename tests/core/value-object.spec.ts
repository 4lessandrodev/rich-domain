import { Result, ValueObject } from "../../lib/core";
import { IResult } from "../../lib/index.types";

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

			public static isValidValue(): boolean {
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
			obj.value().set('value').toValue('Changed');
			expect(obj.value().get('value')).toBe('Changed');
		});
	});
});
