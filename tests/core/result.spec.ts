import { Result } from "../../lib/core";
import { ICommand } from "../../lib/index.types";

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
		})
	})
});
