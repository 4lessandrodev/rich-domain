import assert from 'node:assert/strict';
import { Result, ValueObject } from '../dist/core/index';

interface Props { value: number };

export class MyValueObject extends ValueObject<Props>{
	private constructor(props: Props) {
		super(props);
	}

	validation(): boolean {
		return false;
	}

	sum(value: number): number {
		const current  = this.props.value;
		return this.util.number(current).sum(value);
	}

	isEven(): boolean {
		const current  = this.props.value;
		return this.validator.number(current).isEven();
	}

	public static create(props: Props): Result<MyValueObject> {
		return Result.Ok(new MyValueObject(props));
	}
}

const result = MyValueObject.create({ value: 42 });

assert.equal(result.isOk(), true, 'the result is failure');
assert.equal(result.value().get('value'), 42, 'the value is not 42');
assert.equal(result.value().sum(1), 43, 'the value is not 43');
assert.equal(result.value().isEven(), true, 'the value is even');

// validation is set to false
const changed = result.value().set('value').to(20);
assert.equal(changed, false, 'value changed');
