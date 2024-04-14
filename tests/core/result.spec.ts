import { Fail, Ok, Result } from "../../lib/core";
import { ICommand, Payload } from "../../lib/types";

describe('result', () => {

	type Args = string | void;
	type CustomPayload = string;

	class Command implements ICommand<Args, CustomPayload> {
		execute(args?: Args): CustomPayload {
			return args ?? 'no args provided';
		}
	}

	describe('failure', () => {
		it('should be fail', () => {

			const result = Result.fail('fail', { message: 'some metadata info' });

			expect(result.error()).toBe('fail');
			expect(result.isOk()).toBeFalsy();
			expect(result.isFail()).toBeTruthy();
			const payloadA = result.execute(new Command()).on('fail')
			const payloadB = result.execute(new Command()).withData('args provided').on('fail');
			expect(payloadA).toBe('no args provided');
			expect(payloadB).toBe('args provided');
			const payloadC = Result.combine([result]).execute(new Command()).on('fail');
			expect(payloadC).toBe('no args provided');
		});

		it('should fails if provide an empty state to combine function', () => {
			expect(Result.combine([]).isFail()).toBeTruthy();
		});
	});

	describe('success', () => {
		const success1 = Result.Ok(1);
		const success2 = Result.Ok(2);
		const success3 = Result.Ok(3);

		it('should return first if success', () => {
			expect(Result.combine([success1, success2, success3]).value()).toBe(1);
		});

		it('should execute a command on success', () => {

			class Command implements ICommand<void, number> {
				execute(): number {
					return 1;
				}
			}

			const command = new Command();
			const commandSpy = jest.spyOn(command, 'execute');

			const success = Result.Ok(1);

			const payload = success.execute(command).on('Ok');
			expect(commandSpy).toHaveBeenCalled();
			expect(payload).toBe(1);
		});

		it('should execute a command on success and provide data', () => {

			class Command implements ICommand<number, number> {
				execute(data: number): number {
					return data + 1;
				}
			}

			const command = new Command();
			const commandSpy = jest.spyOn(command, 'execute');

			const success = Result.Ok(1);

			const payload = success.execute(command).withData(1).on('Ok');
			expect(commandSpy).toHaveBeenCalled();
			expect(payload).toBe(2);
		});

		it('should get an {} if metadata is not provided', () => {
			const success = Result.Ok(1);
			expect(success.metaData()).toEqual({});
		});

		it('should get metadata if provided', () => {
			const success = Result.Ok(1, { meta: 'Data' });
			expect(success.metaData()).toEqual({ meta: 'Data' });
		});

		it('should get object result', () => {
			const success = Result.Ok(1, { meta: 'Data' });
			expect(success.toObject()).toEqual({
				"data": 1, "error": null, "isFail": false, "isOk": true, "metaData": { "meta": "Data" }
			});
		});

		it('should accept void', () => {

			const result: Result = Result.Ok();

			expect(result.isOk()).toBeTruthy();

			expect(result.isFail()).toBeFalsy();

			expect(result.metaData()).toEqual({});

			expect(result.error()).toBe(null);

			expect(result.value()).toBe(null);

		});
	});

	describe('read-only', () => {
		it('result must be read-only', () => {
			const fail = Result.fail('error message');

			const errObj = fail.toObject();

			expect(errObj.error).toBe('error message');

			const error = () => errObj.error = 'new changed message';

			expect(error).toThrowError("Cannot assign to read only property 'error' of object '#<Object>'")

			expect(errObj.error).toBe('error message');
		})
	});

	describe('Payload type', () => {

		it('should payload to be a valid type for Result', () => {

			const IsOK = (): Payload<any> => Result.Ok();
			expect(IsOK().isOk()).toBeTruthy();

		});

		it('should payload to be a valid type for Result', () => {

			const IsOK = (): Payload<any> => Result.fail();
			expect(IsOK().isOk()).toBeFalsy();

		});

		it('should payload to be a valid type for Result', () => {

			const IsOK = (): Payload<any> => Ok();
			expect(IsOK().isOk()).toBeTruthy();

		});

		it('should payload to be a valid type for Result', () => {

			const IsOK = (): Payload<any> => Fail();
			expect(IsOK().isOk()).toBeFalsy();

		});

	});

	describe('result serialized', () => {
		it('should Ok do not have none public key', () => {
			const result = Ok();
			expect(JSON.stringify(result)).toMatchInlineSnapshot(`"{}"`);
		});

		it('should Fail do not have none public key', () => {
			const result = Fail();
			expect(JSON.stringify(result)).toMatchInlineSnapshot(`"{}"`);
		});
	});
});

describe('Result', () => {
	describe('Ok', () => {
		it('should create an instance of Result in success state without data', () => {
			const result = Result.Ok();
			expect(result.isOk()).toBe(true);
			expect(result.value()).toBe(null);
			expect(result.error()).toBe(null);
			expect(result.metaData()).toEqual({});
		});

		it('should create an instance of Result in success state with data and metadata', () => {
			const data = { key: 'value' };
			const metaData = { metaKey: 'metaValue' };
			const result = Result.Ok(data, metaData);
			expect(result.isOk()).toBe(true);
			expect(result.value()).toBe(data);
			expect(result.error()).toBe(null);
			expect(result.metaData()).toEqual(metaData);
		});
	});

	describe('fail', () => {
		it('should create an instance of Result in failure state without error', () => {
			const result = Result.fail();
			expect(result.isFail()).toBe(true);
			expect(result.value()).toBe(null);
			expect(result.error()).toBe('void error. no message!');
			expect(result.metaData()).toEqual({});
		});

		it('should create an instance of Result in failure state with error and metadata', () => {
			const error = 'Custom error message';
			const metaData = { metaKey: 'metaValue' };
			const result = Result.fail(error, metaData);
			expect(result.isFail()).toBe(true);
			expect(result.value()).toBe(null);
			expect(result.error()).toBe(error);
			expect(result.metaData()).toEqual(metaData);
		});
	});

	describe('iterate', () => {
		it('should create an Iterator instance from an array of Results', () => {
			const results = [Result.Ok(), Result.fail()];
			const iterator = Result.iterate(results);
			expect(iterator).toBeDefined();
			expect(iterator.total()).toBe(2);
		});
	});

	describe('combine', () => {
		it('should return the first failure if provided with an array of results', () => {
			const results = [Result.Ok(), Result.fail('Error 1'), Result.fail('Error 2')];
			const combinedResult = Result.combine(results);
			expect(combinedResult.isFail()).toBe(true);
			expect(combinedResult.error()).toBe('Error 1');
		});

		it('should return the first success if provided with an array of results', () => {
			const results = [Result.Ok(), Result.Ok(), Result.Ok()];
			const combinedResult = Result.combine(results);
			expect(combinedResult.isOk()).toBe(true);
			expect(combinedResult.value()).toBe(null);
		});

		it('should return a failure if no results are provided', () => {
			const combinedResult = Result.combine([]);
			expect(combinedResult.isFail()).toBe(true);
			expect(combinedResult.error()).toBe('No results provided on combine param');
		});
	});

	describe('execute', () => {
		it('should execute a command without data based on result state', () => {
			const command = {
				execute: jest.fn().mockReturnValue('Command result')
			};
			const result = Result.Ok();
			const resultExecute = result.execute(command);
			expect(resultExecute.on('Ok')).toBe('Command result');
		});

		it('should execute a command with data based on result state', () => {
			const command = {
				execute: jest.fn().mockReturnValue('Command result')
			};
			const result = Result.Ok();
			const resultExecute = result.execute(command);
			expect(resultExecute.withData('Data').on('Ok')).toBe('Command result');
		});
	});

	describe('value', () => {
		it('should return the value of the result', () => {
			const result = Result.Ok('Value');
			expect(result.value()).toBe('Value');
		});
	});

	describe('error', () => {
		it('should return the error of the result', () => {
			const result = Result.fail('Error');
			expect(result.error()).toBe('Error');
		});
	});

	describe('isFail', () => {
		it('should return true if the result is a failure', () => {
			const result = Result.fail();
			expect(result.isFail()).toBe(true);
		});

		it('should return false if the result is a success', () => {
			const result = Result.Ok();
			expect(result.isFail()).toBe(false);
		});
	});

	describe('isOk', () => {
		it('should return true if the result is a success', () => {
			const result = Result.Ok();
			expect(result.isOk()).toBe(true);
		});

		it('should return false if the result is a failure', () => {
			const result = Result.fail();
			expect(result.isOk()).toBe(false);
		});
	});

	describe('metaData', () => {
		it('should return the metadata of the result', () => {
			const metaData = { key: 'value' };
			const result = Result.Ok(null, metaData);
			expect(result.metaData()).toEqual(metaData);
		});
	});

	describe('toObject', () => {
		it('should return the state of the result as an object', () => {
			const result = Result.Ok('Value', { key: 'value' });
			const resultObject = result.toObject();
			expect(resultObject.isOk).toBe(true);
			expect(resultObject.isFail).toBe(false);
			expect(resultObject.data).toBe('Value');
			expect(resultObject.error).toBe(null);
			expect(resultObject.metaData).toEqual({ key: 'value' });
		});
	});
});
