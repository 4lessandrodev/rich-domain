import Fail from "../../lib/core/fail";

describe('ok', () => {

	it('should create a simple failure', () => {
		const result = Fail('internal server error');
		expect(result.isOk()).toBeFalsy();
		expect(result.isFail()).toBeTruthy();
	})

	it('should create a failure result as void', () => {
		const result = Fail<void>(null);
		expect(result.isOk()).toBeFalsy();
		expect(result.isFail()).toBeTruthy();
		expect(result.toObject()).toEqual({
			"data": null,
			"error": 'void error',
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
			"error": 'void error',
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

		interface Payload {
			user: any;
		}

		const result = Fail<Generic, MetaData, Payload>({ message: 'invalid email' }, { arg: 'invalid@mail.com' });
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
});
