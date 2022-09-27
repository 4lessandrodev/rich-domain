import Ok from "../../lib/core/ok";

describe('ok', () => {

	it('should create a simple success', () => {
		const result = Ok(null);
		expect(result.isOk()).toBeTruthy();
		expect(result.isFail()).toBeFalsy();
	})

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
});
