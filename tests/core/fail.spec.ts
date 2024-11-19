import Fail from "../../lib/core/fail";
import Result from "../../lib/core/result";

describe('fail', () => {

	it('should create a simple no args failure', () => {
		const result = Fail();
		expect(result.isOk()).toBeFalsy();
		expect(result.isFail()).toBeTruthy();
	});

	it('should create a simple failure', () => {
		const result = Fail('internal server error');
		expect(result.isOk()).toBeFalsy();
		expect(result.isFail()).toBeTruthy();
	});

	it('should create a failure result as void', () => {
		const result = Fail<void>(null);
		expect(result.isOk()).toBeFalsy();
		expect(result.isFail()).toBeTruthy();
		expect(result.toObject()).toEqual({
			"data": null,
			"error": 'void error. no message!',
			"isFail": true,
			"isOk": false,
			"metaData": {},
		});
	});

	it('should create a failure result as void and metaData', () => {

		interface MetaData {
			ping: string;
		}

		const result = Fail<void, MetaData>(null, { ping: 'pong' });
		expect(result.isOk()).toBeFalsy();
		expect(result.isFail()).toBeTruthy();
		expect(result.toObject()).toEqual({
			"data": null,
			"error": 'void error. no message!',
			"isFail": true,
			"isOk": false,
			"metaData": { ping: 'pong' },
		});
	});

	it('should create a failure result as generic type', () => {

		interface Generic {
			message: string;
			statusCode: number;
		}

		const result = Fail<Generic>({ message: 'internal server error', statusCode: 500 });
		expect(result.isOk()).toBeFalsy();
		expect(result.isFail()).toBeTruthy();
		expect(result.toObject()).toEqual({
			"data": null,
			"error": { message: 'internal server error', statusCode: 500 },
			"isFail": true,
			"isOk": false,
			"metaData": {},
		});
	});

	it('should create a failure result as generic type and metaData', () => {

		interface Generic {
			message: string;
		}

		interface MetaData {
			statusCode: number;
		}

		const result = Fail<Generic, MetaData>({ message: 'bad request' }, { statusCode: 400 });
		expect(result.isOk()).toBeFalsy();
		expect(result.isFail()).toBeTruthy();
		expect(result.toObject()).toEqual({
			"data": null,
			"error": { message: 'bad request' },
			"isFail": true,
			"isOk": false,
			"metaData": { statusCode: 400 },
		});
	});

	it('should create a failure result as generic type and metaData and error', () => {

		interface Generic {
			message: string;
		}

		interface MetaData {
			arg: string;
		}

		const result = Fail<Generic, MetaData>({ message: 'invalid email' }, { arg: 'invalid@mail.com' });
		expect(result.isOk()).toBeFalsy();
		expect(result.isFail()).toBeTruthy();
		expect(result.toObject()).toEqual({
			"data": null,
			"error": { message: 'invalid email' },
			"isFail": true,
			"isOk": false,
			"metaData": { arg: 'invalid@mail.com' },
		});
	});

	describe('generic types', () => {

		type Error = { message: string };
		type MetaData = { args: number };

		it('should fail generate the same payload as result', () => {

			const status: number = 400;
			const metaData: MetaData = { args: status };
			const error: Error = { message: 'something went wrong!' };

			const resultInstance = Result.fail<Error, MetaData>(error, metaData);
			const failInstance = Fail<Error, MetaData>(error, metaData);

			expect(resultInstance.toObject()).toEqual(failInstance.toObject());

		});

		it('should fail generate the same payload as result', () => {

			const resultInstance = Result.fail();
			const okInstance = Fail();

			expect(resultInstance.toObject()).toEqual(okInstance.toObject());

		});


		it('should fail generate the same payload as result', () => {

			const resultInstance = Result.fail('hey there');
			const okInstance = Fail('hey there');

			expect(resultInstance.toObject()).toEqual(okInstance.toObject());

		});

		it('should fail generate the same payload as result', () => {

			const resultInstance = Result.fail('hey there', { status: 400 });
			const okInstance = Fail('hey there', { status: 400 });

			expect(resultInstance.toObject()).toEqual(okInstance.toObject());

		});


		it('should Result type to be valid if use IResult', () => {

			const testingA = (): Result => Fail('should return string');
			expect(testingA().isFail()).toBeTruthy();

		});
	});
});
