import assert from 'node:assert/strict';
import { Result, ValueObject } from '../dist/core/index';

interface Props { value: number };

export class MyValueObject extends ValueObject<Props>{
	private constructor(props: Props) {
		super(props);
	}

	validation<Key extends 'value'>(_key: Key, _value: Props[Key]): boolean {
		return false;
	}

	public static create(props: Props): Result<ValueObject<Props>> {
		return Result.success(new MyValueObject(props));
	}
}

const result = MyValueObject.create({ value: 42 });

assert.equal(result.isSuccess(), true, 'the result is failure');
assert.equal(result.value().get('value'), 42, 'the value is not 42');

result.value().set('value').to(20);
