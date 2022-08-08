import { Aggregate, DomainEvents, ID, Result, ValueObject } from "../../lib/core";
import { ISettings, IResult, IHandle, IDomainEvent, UID } from "../../lib/types";

describe('aggregate', () => {

	describe('aggregate native methods', () => {

		interface Props {
			id: string;
			name: string;
		}

		class AggregateErr extends Aggregate<Props> {
			private constructor(props: Props, config?: ISettings) {
				super(props, config)
			}
		}

		it('should return fails if provide a null value', () => {
			const obj = AggregateErr.create(null);
			expect(obj.isFail()).toBeTruthy();
		});

		it('should return fails if provide an undefined value', () => {
			const obj = AggregateErr.create(undefined);
			expect(obj.isFail()).toBeTruthy();
		});

		it('should create a valid aggregate', () => {
			const obj = AggregateErr.create({ id: '23366cbf-86cd-4de3-874a-5a11b4fe5dac', name: 'Jane' });
			expect(obj.isFail()).toBeFalsy();
			expect(obj.value().get('name')).toBe('Jane');
			expect(obj.value().hashCode().value()).toBe('[Aggregate@AggregateErr]:23366cbf-86cd-4de3-874a-5a11b4fe5dac')
		});
	});

	describe('basic-aggregate', () => {

		interface Props {
			id?: string;
			name: string;
			age: number;
		}

		class BasicAggregate extends Aggregate<Props> {
			private constructor(props: Props) {
				super(props)
			}

			public static create(props: Props): Result<BasicAggregate> {
				return Result.Ok(new BasicAggregate(props));
			}
		}

		it('should create a basic aggregate with success', () => {

			const agg = BasicAggregate.create({ name: 'Jane Doe', age: 21 });

			expect(agg.value().id).toBeDefined();

			expect(agg.value().isNew()).toBeTruthy();

			expect(agg.value().get('name')).toBe('Jane Doe');

		});

		it('should create a basic aggregate with a provided id', () => {
			const agg = BasicAggregate.create({
				id: '8b51a5a2-d47a-4431-884a-4c7d77e1a201',
				name: 'Jane Doe',
				age: 18
			});

			expect(agg.value().isNew()).toBeFalsy();

			expect(agg.value().hashCode().value())
				.toBe('[Aggregate@BasicAggregate]:8b51a5a2-d47a-4431-884a-4c7d77e1a201');
		});

		it('should change attributes values with default function', () => {
			const agg = BasicAggregate.create({ name: 'Jane Doe', age: 23 });

			expect(agg.value().id.value()).toBeDefined();

			expect(agg.value().get('name')).toBe('Jane Doe');
			expect(agg.value().get('age')).toBe(23);

			agg.value().set('age').to(18).set('name').to('Anne');
			expect(agg.value().get('age')).toBe(18);
			expect(agg.value().get('name')).toBe('Anne');

			agg.value().change('age', 21).change('name', 'Louse');
			expect(agg.value().get('age')).toBe(21);
			expect(agg.value().get('name')).toBe('Louse');
		});
	});

	describe('aggregate with value objects', () => {

		interface Props { value: number };

		class AgeVo extends ValueObject<Props>{
			private constructor(props: Props) {
				super(props)
			}

			public static isValidValue(value: number): boolean {
				return this.validator.number(value).isBetween(0, 130);
			}

			public static create(props: Props): IResult<ValueObject<Props>> {
				if (!this.isValidValue(props.value)) return Result.fail('Invalid value');
				return Result.Ok(new AgeVo(props));
			}
		}

		it('should returns false if provide a negative value', () => {
			expect(AgeVo.isValidValue(-1)).toBeFalsy();
		});

		it('should returns false if provide a value greater than 129', () => {
			expect(AgeVo.isValidValue(130)).toBeFalsy();
		});

		it('should returns true if number is greater than 0 and less than 130', () => {
			expect(AgeVo.isValidValue(1)).toBeTruthy();
			expect(AgeVo.isValidValue(129)).toBeTruthy();
		});

		interface AggProps {
			id?: string;
			age: AgeVo;
		}
		class UserAgg extends Aggregate<AggProps>{
			private constructor(props: AggProps) {
				super(props);
			}

			public static create(props: AggProps): IResult<Aggregate<AggProps>> {
				return Result.Ok(new UserAgg(props));
			}
		}

		it('should create a user with success', () => {

			const age = AgeVo.create({ value: 21 }).value();
			const user = UserAgg.create({ age });

			expect(user.isOk()).toBeTruthy();

		});

		it('should get value from age with success', () => {

			const age = AgeVo.create({ value: 21 }).value();
			const user = UserAgg.create({ age }).value();

			const result = user
				.get('age')
				.get('value');

			expect(result).toBe(21);

		});

		it('should set a new age with success and navigate on history', () => {

			const age = AgeVo.create({ value: 21 }).value();
			const user = UserAgg.create({ age }).value();

			expect(user.get('age').get('value')).toBe(21);

			const age18 = AgeVo.create({ value: 18 }).value();

			expect(user.history().count()).toBe(1);

			const result = user
				.set('age')
				.to(age18);

			expect(result.get('age').get('value')).toBe(18);

			expect(user.history().count()).toBe(2);

			user.history().back();

			expect(result.get('age').get('value')).toBe(21);

			user.history().forward();

			expect(result.get('age').get('value')).toBe(18);
		});

	});

	describe('createdAt and updatedAt', () => {

		interface AggProps {
			id?: string;
			name: string;
			createdAt?: Date;
			updatedAt?: Date;
		}
		class UserAgg extends Aggregate<AggProps>{
			private constructor(props: AggProps) {
				super(props);
			}

			public static create(props: AggProps): IResult<Aggregate<AggProps>> {
				return Result.Ok(new UserAgg(props));
			}
		}
		it('should create a new date if props are defined on props', () => {
			const agg = UserAgg.create({ name: 'Leticia' });

			expect(agg.value().get('createdAt')).toBeDefined();
			expect(agg.value().get('createdAt')).toBeDefined();
			expect(agg.value().toObject().name).toBe('Leticia');
		});

		it('should create a date from props if provide value', () => {
			process.env.TZ = 'UTC';
			const createdAt = new Date('2022-01-01T03:00:00.000Z');
			const updatedAt = new Date('2022-01-01T03:00:00.000Z');
			const agg = UserAgg.create({ name: 'Leticia', createdAt, updatedAt });

			expect(agg.value().get('createdAt')).toEqual(new Date('2022-01-01T03:00:00.000Z'));
			expect(agg.value().get('updatedAt')).toEqual(new Date('2022-01-01T03:00:00.000Z'));
		});

		it('should update a the value of updatedAt if change some prop', () => {
			process.env.TZ = 'UTC';
			const createdAt = new Date('2022-01-01T03:00:00.000Z');
			const updatedAt = new Date('2022-01-01T03:00:00.000Z');
			const agg = UserAgg.create({ name: 'Leticia', createdAt, updatedAt });
			expect(agg.value().get('updatedAt')).toEqual(new Date('2022-01-01T03:00:00.000Z'));
			agg.value().set('name').to('Lana');
			expect(agg.value().get('updatedAt')).not.toEqual(new Date('2022-01-01T03:00:00.000Z'));
		});

		it('should add domain event', async () => {

			class Handler implements IHandle<UserAgg> {
				eventName: string = 'Handler Event';
				dispatch(event: IDomainEvent<UserAgg>): void | Promise<void> {
					console.log(event.aggregate.toObject());
				}
			}

			const agg = UserAgg.create({ name: 'Jane' }).value();

			agg.addEvent(new Handler(), 'REPLACE_DUPLICATED');

			expect(DomainEvents.events.total()).toBe(1);

			agg.deleteEvent('Handler Event');

			expect(DomainEvents.events.total()).toBe(0);
		});

		it('should add domain event', async () => {

			class Handler implements IHandle<UserAgg> {
				eventName: string = 'Handler Event';
				dispatch(event: IDomainEvent<UserAgg>): void | Promise<void> {
					console.log(event.aggregate.toObject());
				}
			}

			const agg = UserAgg.create({ name: 'Jane' }).value();

			agg.addEvent(new Handler(), 'REPLACE_DUPLICATED');

			expect(DomainEvents.events.total()).toBe(1);

			DomainEvents.dispatch({ eventName: 'Handler Event', id: agg.id })

			expect(DomainEvents.events.total()).toBe(0);
		});

		it('should add domain event', async () => {

			class Handler implements IHandle<UserAgg> {
				eventName = undefined;
				dispatch(event: IDomainEvent<UserAgg>): void | Promise<void> {
					console.log(event.aggregate.toObject());
				}
			}

			const agg = UserAgg.create({ name: 'Jane' }).value();

			agg.addEvent(new Handler(), 'REPLACE_DUPLICATED');

			expect(DomainEvents.events.total()).toBe(1);

			DomainEvents.dispatch({ eventName: Handler.name, id: agg.id })

			expect(DomainEvents.events.total()).toBe(0);
		});

		it('should change id', () => {
			const agg = UserAgg.create({
				name: 'James Stuart',
				id: 'valid_id'
			});

			const user = agg.value();
			expect(user.id.value()).toBe('valid_id');
			expect(user.get('id')).toBe('valid_id');

			user.set('id').to('changed_id');
			expect(user.id.value()).toBe('changed_id');
			expect(user.get('id')).toBe("changed_id");

			expect(user.toObject().id).toBe('changed_id');

			user.change('id', 'new_changed_id');

			expect(user.id.value()).toBe('new_changed_id');
			expect(user.get('id')).toBe("new_changed_id");

			user.change('id', ID.create('new uuid') as any);

			expect(user.get('id')).toBe("new uuid");

			user.set('id').to(ID.create('new uuid2') as any);

			expect(user.get('id')).toBe("new uuid2");

			user.change('id', 9887822939 as any);
			expect(user.get('id')).toBe("9887822939");

			user.set('id').to(7454 as any);
			expect(user.get('id')).toBe("7454");
		})
	});

	describe('aggregate with domain id', () => {

		it('should be success if define id as UID', () => {

			interface Props {
				id: UID;
				name: string;
				createdAt: Date;
				updatedAt: Date;
			}

			class Product extends Aggregate<Props>{
				private constructor(props: Props) {
					super(props)
				}

				public static create(props: Props): IResult<Product> {
					return Result.Ok(new Product(props));
				}
			}

			const result = Product.create({
				id: ID.create('fd15df0c-af60-45ce-9976-33c6197e5ca0'),
				name: 'James',
				createdAt: new Date(),
				updatedAt: new Date()
			});
			
			const id = result.value().toObject().id;
			
			expect(id).toBe('fd15df0c-af60-45ce-9976-33c6197e5ca0');
			expect(result.value().id.value()).toBe('fd15df0c-af60-45ce-9976-33c6197e5ca0');
			expect(result.value().get('id').value()).toBe('fd15df0c-af60-45ce-9976-33c6197e5ca0');
		})
	});
});
