import { Aggregate, ID, Result } from "../../lib/core";

describe('aggregate', () => {

	describe('aggregate errors', () => {
		class AggregateErr extends Aggregate<number> {
			private constructor(props: number, id?: string) {
				super(props, id)
			}
		}

		it('should fails if static method is not defined', () => {
			expect.assertions(1);
			const result = AggregateErr.create('some value');

			expect(result.error()).toBe('Static method [create] not implemented on aggregate AggregateErr');
		});
	});

	describe('basic-aggregate', () => {

		interface Props {
			name: string;
			age: number;
		}

		class BasicAggregate extends Aggregate<Props> {
			private constructor(props: Props, id?: string) {
				super(props, id)
			}

			public static create(props: Props, id?: string): Result<Aggregate<Props>, string> {
				return Result.success(new BasicAggregate(props, id));
			}
		}

		it('should create a basic aggregate with success', () => {
			const agg = BasicAggregate.create({ name: 'Jane Doe', age: 21 });

			expect(agg.value().id).toBeDefined();

			expect(agg.value().isNew()).toBeTruthy();

			expect(agg.value().get('name')).toBe('Jane Doe');

		});

		it('should create a basic aggregate with a provided id', () => {
			const agg = BasicAggregate.create({ name: 'Jane Doe', age: 18 }, '8b51a5a2-d47a-4431-884a-4c7d77e1a201');

			expect(agg.value().isNew()).toBeFalsy();

			expect(agg.value().hashCode().value)
				.toBe('[Aggregate@]:8b51a5a2-d47a-4431-884a-4c7d77e1a201');
		});

		it('should change attributes values with default function', () => {
			const agg = BasicAggregate.create({ name: 'Jane Doe', age: 23 });

			expect(agg.value().get('name')).toBe('Jane Doe');
			expect(agg.value().get('age')).toBe(23);

			agg.value().set('age').toValue(18).set('name').toValue('Anne');
			expect(agg.value().get('age')).toBe(18);
			expect(agg.value().get('name')).toBe('Anne');

			agg.value().updateTo('age', 21).updateTo('name', 'Louse');
			expect(agg.value().get('age')).toBe(21);
			expect(agg.value().get('name')).toBe('Louse');
		});
	});
});
