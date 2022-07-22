import { Result } from "../../lib/core";
import { ICommand } from "../../lib/types";

describe('result', () => {

	type Args = string | void;
	type Payload = string;

	class Command implements ICommand<Args, Payload> {
		execute(args?: Args): Payload {
			return args ?? 'no args provided';
		}
	}

	describe('failure', () => {
		it('should be fail', () => {
			
			const result = Result.fail('fail', { message: 'some metadata info' });

			expect(result.error()).toBe('fail');
			expect(result.isSuccess()).toBeFalsy();
			expect(result.isFailure()).toBeTruthy();
			const payloadA = result.execute(new Command()).on('fail')
			const payloadB = result.execute(new Command()).withData('args provided').on('fail');
			expect(payloadA).toBe('no args provided');
			expect(payloadB).toBe('args provided');
			const payloadC = Result.combine([result]).execute(new Command()).on('fail');
			expect(payloadC).toBe('no args provided');
		});

		it('should fails if provide an empty state to combine function', () => {
			expect(Result.combine([]).isFailure).toBeTruthy();
		});
	});

	describe('success', () => {
		const success1 = Result.success(1);
		const success2 = Result.success(2);
		const success3 = Result.success(3);

		it('should return first if success', () => {
			expect(Result.combine([ success1, success2, success3 ]).value()).toBe(1);
		});

		it('should execute a command on success', () => {

			class Command implements ICommand<void, number> {
				execute(): number {
					return 1;
				}
			}

			const command = new Command();
			const commandSpy = jest.spyOn(command, 'execute');

			const success = Result.success(1);

			const payload = success.execute(command).on('success');
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

			const success = Result.success(1);

			const payload = success.execute(command).withData(1).on('success');
			expect(commandSpy).toHaveBeenCalled();
			expect(payload).toBe(2);
		});

		it('should get an {} if metadata is not provided', () => {
			const success = Result.success(1);
			expect(success.metaData()).toEqual({});
		});

		it('should get metadata if provided', () => {
			const success = Result.success(1, { meta: 'Data' });
			expect(success.metaData()).toEqual({ meta: 'Data' });
		});

		it('should get object result', () => {
			const success = Result.success(1, { meta: 'Data' });
			expect(success.toObject()).toEqual({
				"data": 1, "error": null, "isFailure": false, "isSuccess": true, "metaData": { "meta": "Data" }
			});
		});
	});
});