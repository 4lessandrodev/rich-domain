import Ok from "../../lib/core/ok";
import Result from "../../lib/core/result";

describe('ok', () => {

	it('should create a simple success with no args', () => {
		const result = Ok();
		expect(result.isOk()).toBeTruthy();
		expect(result.isFail()).toBeFalsy();
	});

	it('should create a simple success with null value', () => {
		const result = Ok(null);
		expect(result.isOk()).toBeTruthy();
		expect(result.isFail()).toBeFalsy();
	});

	it('should create a success result as void', () => {
		const result = Ok<void>(null);
		expect(result.isOk()).toBeTruthy();
		expect(result.isFail()).toBeFalsy();
		expect(result.toObject()).toEqual({
			"data": null,
			"error": null,
			"isFail": false,
			"isOk": true,
			"metaData": {},
		});
	});

	it('should create a success result as void and metaData', () => {

		interface MetaData {
			ping: string;
		}

		const result = Ok<void, MetaData>(null, { ping: 'pong' });
		expect(result.isOk()).toBeTruthy();
		expect(result.isFail()).toBeFalsy();
		expect(result.toObject()).toEqual({
			"data": null,
			"error": null,
			"isFail": false,
			"isOk": true,
			"metaData": { ping: 'pong' },
		});
	});

	it('should create a success result as generic type', () => {

		interface Generic {
			name: string;
			age: number;
		}

		const result = Ok<Generic>({ age: 21, name: 'Jane' });
		expect(result.isOk()).toBeTruthy();
		expect(result.isFail()).toBeFalsy();
		expect(result.toObject()).toEqual({
			"data": { age: 21, name: 'Jane' },
			"error": null,
			"isFail": false,
			"isOk": true,
			"metaData": {},
		});
	});

	it('should create a success result as generic type and metaData', () => {

		interface Generic {
			name: string;
			age: number;
		}

		interface MetaData {
			arg: string;
		}

		const result = Ok<Generic, MetaData>({ age: 23, name: 'James' }, { arg: 'my argument' });
		expect(result.isOk()).toBeTruthy();
		expect(result.isFail()).toBeFalsy();
		expect(result.toObject()).toEqual({
			"data": { age: 23, name: 'James' },
			"error": null,
			"isFail": false,
			"isOk": true,
			"metaData": { arg: 'my argument' },
		});
	});

	it('should create a success result as generic type and metaData and error', () => {

		interface Generic {
			name: string;
			age: number;
		}

		interface MetaData {
			arg: string;
		}

		interface Error {
			message: string;
		}

		const result = Ok<Generic, MetaData, Error>({ age: 2, name: 'Panda' }, { arg: 'my argument' });
		expect(result.isOk()).toBeTruthy();
		expect(result.isFail()).toBeFalsy();
		expect(result.toObject()).toEqual({
			"data": { age: 2, name: 'Panda' },
			"error": null,
			"isFail": false,
			"isOk": true,
			"metaData": { arg: 'my argument' },
		});
	});

	describe('generic types', () => {

		type Error = { message: string };
		type Payload = { data: { status: number } };
		type MetaData = { args: number };

		it('should ok generate the same payload as result', () => {

			const status: number = 200;
			const payload: Payload = { data: { status } };
			const metaData: MetaData = { args: status };

			const resultInstance = Result.Ok<Payload, MetaData, Error>(payload, metaData);
			const okInstance = Ok<Payload, MetaData, Error>(payload, metaData);

			expect(resultInstance.toObject()).toEqual(okInstance.toObject());

		});

		it('should ok generate the same payload as result', () => {

			const resultInstance = Result.Ok();
			const okInstance = Ok();

			expect(resultInstance.toObject()).toEqual(okInstance.toObject());

		});


		it('should ok generate the same payload as result', () => {

			const resultInstance = Result.Ok('hey there');
			const okInstance = Ok('hey there');

			expect(resultInstance.toObject()).toEqual(okInstance.toObject());

		});

		it('should ok generate the same payload as result', () => {

			const resultInstance = Result.Ok('hey there', { status: 200 });
			const okInstance = Ok('hey there', { status: 200 });

			expect(resultInstance.toObject()).toEqual(okInstance.toObject());

		});

		it('should Result type to be valid if use IResult', () => {

			const testingA = (): Result => Ok();
			expect(testingA().isOk()).toBeTruthy();

		});
	});
});
