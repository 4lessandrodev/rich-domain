import { Aggregate, ID, Ok, Result, TsEvents, ValueObject } from "../../lib/core";
import { DEvent, EventHandler, IResult, ISettings, UID } from "../../lib/types";

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

			const setAge = agg.value().set('age').to(18);
			const setName = agg.value().set('name').to('Anne');
			expect(setAge).toBeTruthy();
			expect(setName).toBeTruthy();
			expect(agg.value().get('age')).toBe(18);
			expect(agg.value().get('name')).toBe('Anne');

			const changedAge = agg.value().change('age', 21);
			const changedName = agg.value().change('name', 'Louse');
			expect(changedName).toBeTruthy();
			expect(changedAge).toBeTruthy();
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

		it('should add domain event [3]', async () => {
			const agg = UserAgg.create({ name: 'Jane' }).value();

			agg.addEvent('someEvent', () => {
				console.log('event');
			});

			expect(agg.eventsMetrics.current).toBe(1);
			agg.deleteEvent('someEvent');
			expect(agg.eventsMetrics.current).toBe(0);
		});


		it('should dispatch domain event from aggregate', async () => {
			const agg = UserAgg.create({ name: 'Jane' }).value();

			agg.addEvent('hello', (agg) => {
				console.log(agg.get('name'));
			});

			expect(agg.eventsMetrics.total).toBe(1);

			await agg.dispatchEvent("hello");

			expect(agg.eventsMetrics.current).toBe(0);
		});

		it('should dispatch all domain events from aggregate', async () => {
			const agg = UserAgg.create({ name: 'Jane' }).value();

			agg.addEvent('event1', () => { });
			agg.addEvent('event2', () => { });

			expect(agg.eventsMetrics.current).toBe(2);

			await agg.dispatchAll();

			expect(agg.eventsMetrics.current).toBe(0);
			expect(agg.eventsMetrics.dispatch).toBe(2);
		});

		it('should add domain event [1] with the same name', async () => {

			const agg = UserAgg.create({ name: 'Jane' }).value();

			agg.addEvent('unique', () => { });
			agg.addEvent('unique', () => { });

			expect(agg.eventsMetrics.current).toBe(1);
			await agg.dispatchAll();
			expect(agg.eventsMetrics.current).toBe(0);
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

	describe('aggregate events', () => {
		it('should dispatch all events once', async () => {

			class Agg extends Aggregate<{ key: string }> { };
			const spy = jest.fn();

			const agg = Agg.create({ key: 'some' }).value();
			agg.addEvent('event', spy);

			expect(agg.eventsMetrics.current).toBe(1);
			expect(agg.eventsMetrics.dispatch).toBe(0);

			await agg.dispatchAll();
			expect(agg.eventsMetrics.current).toBe(0);
			expect(agg.eventsMetrics.dispatch).toBe(1);

			expect(spy).toHaveBeenCalled();

		});

		it('should clear events and metrics', async () => {

			class Agg extends Aggregate<{ key: string }> { };

			const agg = Agg.create({ key: 'some' }).value();
			agg.addEvent('event', () => { }, { priority: 1 });

			expect(agg.eventsMetrics.current).toBe(1);
			expect(agg.eventsMetrics.dispatch).toBe(0);

			agg.clearEvents({ resetMetrics: true });

			expect(agg.eventsMetrics.current).toBe(0);
			expect(agg.eventsMetrics.dispatch).toBe(0);

			const aggB = Agg.create({ key: 'some' }).value();

			aggB.addEvent('event1', () => { });
			aggB.dispatchEvent('event1');
			expect(aggB.eventsMetrics.dispatch).toBe(1);

			aggB.addEvent('event2', () => { });
			expect(aggB.eventsMetrics.current).toBe(1);
			expect(aggB.eventsMetrics.dispatch).toBe(1);

			aggB.clearEvents({ resetMetrics: false });
			expect(aggB.eventsMetrics.current).toBe(0);
			expect(aggB.eventsMetrics.dispatch).toBe(1);
		});

		it('should clone aggregate with events', async () => {


			interface Props { key: string };
			class Agg extends Aggregate<Props> {
				public static create(props: Props): Result<Agg> {
					return Result.Ok(new Agg(props))
				}
			};



			const agg = Agg.create({ key: 'some' }).value();

			agg.addEvent('eventA', () => { });
			agg.addEvent('eventB', () => { });

			expect(agg.eventsMetrics.current).toBe(2);
			expect(agg.eventsMetrics.dispatch).toBe(0);

			const copy = agg.clone({ copyEvents: true, key: 'changed' });

			expect(copy.eventsMetrics.current).toBe(2);
			expect(copy.eventsMetrics.dispatch).toBe(0);
			expect(copy.get('key')).toBe('changed');

			const clean = copy.clone({ copyEvents: false });
			expect(clean.eventsMetrics.current).toBe(0);
			expect(clean.eventsMetrics.dispatch).toBe(0);

			const none = copy.clone();
			expect(none.eventsMetrics.current).toBe(0);
			expect(none.eventsMetrics.dispatch).toBe(0);
		});
	});

	describe('toObject', () => {
		it('should infer types to aggregate on toObject method', async () => {

			class Name extends ValueObject<{ value: string }>{
				private constructor(props: { value: string }) {
					super(props)
				}

				public static create(value: string): Result<Name> {
					return Ok(new Name({ value }));
				}
			}

			interface Props {
				id?: UID;
				price: number;
				name: Name;
				additionalInfo: string[];
				createdAt?: Date;
				updatedAt?: Date;
			};

			class Product extends Aggregate<Props>{
				private constructor(props: Props) {
					super(props)
				}
				public static create(props: Props): Result<Product> {
					return Ok(new Product(props));
				}
			}

			const name = Name.create('orange').value();
			const props: Props = { name, additionalInfo: ['from brazil'], price: 10 };
			const orange = Product.create(props).value();

			orange.addEvent('create', () => {
				console.log('make a juice');
			})

			orange.addEvent('save', () => {
				console.log('make a juice');
			}, { priority: 1 })

			await orange.dispatchAll();

			const object = orange.toObject();
			expect(object.additionalInfo).toEqual(['from brazil']);
			expect(object.name).toEqual({ value: 'orange' });
			expect(object.price).toBe(10);
		});
	});

	it('should add event as class', async () => {
		interface Props {
			id?: UID;
			price: number;
			name: string;
			createdAt?: Date;
			updatedAt?: Date;
		};

		class Product extends Aggregate<Props>{
			private constructor(props: Props) {
				super(props)
			}
			public static create(props: Props): Result<Product> {
				return Ok(new Product(props));
			}
		}

		const props: Props = { name: 'Orange', price: 1.21 };
		const orange = Product.create(props).value();

		class Handler extends EventHandler<Product> {
			constructor() { super({ eventName: 'event' }) };

			dispatch(product: Product, args_1: [DEvent<Product>, any[]]): void | Promise<void> {
				const model = product.toObject();
				const [event, args] = args_1;

				console.log(model);
				console.log(event);
				console.log(event.eventName);
				console.log(event.options);
				console.log(args);
			}

		}

		const event = new Handler();
		orange.addEvent(event);

		await orange.dispatchEvent('event', { custom: 'params' });
		expect(orange.eventsMetrics.dispatch).toBe(1);

	});
});

describe('Aggregate', () => {
    describe('hashCode', () => {
        it('should return the hash code of the aggregate', () => {
            const props = { id: '123', name: 'Test Aggregate' };
            const aggregate = new Aggregate(props);
            const hashCode = aggregate.hashCode();
            expect(hashCode.value()).toBe("[Aggregate@Aggregate]:123");
        });
    });

    describe('context', () => {
        it('should return an EventManager', () => {
            const aggregate = new Aggregate({});
            const context = aggregate.context();
            expect(context).toBeDefined();
            // Adicione mais testes aqui para verificar se o context é uma instância válida de EventManager.
        });
    });

    describe('eventsMetrics', () => {
        it('should return the aggregate metrics', () => {
            const aggregate = new Aggregate({}, undefined);
			aggregate.addEvent('testEvent', () => {});
            const metrics = aggregate.eventsMetrics;
            expect(metrics.current).toBe(1);
            expect(metrics.total).toBe(1);
            expect(metrics.dispatch).toBe(0);
        });
    });

    describe('clone', () => {
        it('should create a new instance of Aggregate', () => {
            const props = { id: '123', name: 'Test Aggregate' };
            const aggregate = new Aggregate(props);
            const clonedAggregate = aggregate.clone();
            expect(clonedAggregate).toBeInstanceOf(Aggregate);
            expect(clonedAggregate.toObject()).toEqual(aggregate.toObject());
        });
    });

    describe('dispatchEvent', () => {
        it('should dispatch the specified event', () => {
            const aggregate = new Aggregate({});
            const eventName = 'testEvent';
            aggregate.dispatchEvent(eventName);
        });
    });

    describe('dispatchAll', () => {
		it('should dispatch the specified event', () => {
			const tsEvent = new TsEvents( new Aggregate({}));
            const aggregate = new Aggregate({}, {}, tsEvent as any);
            const eventName = 'testEvent';
            const handler = jest.fn();
			aggregate.addEvent(eventName, handler);
            const dispatchSpy = jest.spyOn(tsEvent, 'dispatchEvent');
            aggregate.addEvent(eventName, handler);
            aggregate.dispatchEvent(eventName);
            expect(dispatchSpy).toHaveBeenCalled();
            expect(handler).toHaveBeenCalled();
        });
    });

    describe('clearEvents', () => {
        it('should delete all events in the current aggregate instance', () => {
            const events = new TsEvents(new Aggregate({}));
            const aggregate = new Aggregate({}, {}, events as any);
            const clearEventsSpy = jest.spyOn(events, 'clearEvents').mockImplementation(() => {});
            aggregate.clearEvents();
            expect(clearEventsSpy).toHaveBeenCalled();
        });
    });

    describe('addEvent', () => {
        it('should add a new event to the aggregate', () => {
            const aggregate = new Aggregate({});
            const eventName = 'testEvent';
            const handler = () => {};
            aggregate.addEvent(eventName, handler);
        });
    });

    describe('deleteEvent', () => {
        it('should delete the event matching the provided name', () => {
            const aggregate = new Aggregate({});
            const eventName = 'testEvent';
            aggregate.addEvent(eventName, () => {});
            const deletedCount = aggregate.deleteEvent(eventName);
            expect(deletedCount).toBe(1);
        });
    });

    describe('create', () => {
        it('should create a new instance of Aggregate', () => {
            const props = { id: '123', name: 'Test Aggregate' };
            const result = Aggregate.create(props);
            expect(result).toBeInstanceOf(Result);
        });
    });
});