import { ValueObject, Entity, Result, Ok, Fail } from '../../lib/core';
import { Adapter, _Adapter, _Result } from '../../lib/types';

describe('adapter v1', () => {

	interface NameProps { value: string; };

	class DomainName extends ValueObject<NameProps> {
		private constructor(props: NameProps) {
			super(props);
		}

		public static create(props: NameProps): _Result<DomainName> {
			return Result.Ok(new DomainName(props));
		}
	}


	interface UserProps { id: string; name: DomainName; createdAt?: Date; updatedAt?: Date };

	class DomainUser extends Entity<UserProps> {
		private constructor(props: UserProps) {
			super(props)
		}

		public static create(props: UserProps): Result<DomainUser> {
			return Result.Ok(new DomainUser(props));
		}
	}

	interface Model {
		id: string;
		name: string;
		createdAt: Date;
		updatedAt: Date;
	}

	class DomainUserAdapter implements _Adapter<Model, DomainUser> {
		build(target: Model): _Result<DomainUser> {
			return DomainUser.create({
				id: target.id,
				name: DomainName.create({ value: target.name }).value(),
				createdAt: target.createdAt,
				updatedAt: target.updatedAt
			});
		}
	}

	class DataUserAdapter implements _Adapter<DomainUser, Model> {
		build(target: DomainUser): _Result<Model> {

			return Result.Ok({
				id: target.get('id'),
				createdAt: target.get('createdAt') as Date,
				updatedAt: target.get('updatedAt') as Date,
				name: target.get('name').get('value')
			})
		}
	}

	const userModel: Model = {
		id: 'valid_id',
		name: 'John Stuart',
		createdAt: new Date('2020-01-01T04:00:23.000Z'),
		updatedAt: new Date('2020-01-01T05:00:23.000Z')
	}

	const name = DomainName.create({ value: userModel.name }).value();
	const domainUser = DomainUser.create({ ...userModel, name }).value();

	describe('from data layer to domain', () => {
		it('should a domain entity from data layer with success', () => {
			const adapter = new DomainUserAdapter();
			const domainUser = adapter.build(userModel);

			expect(domainUser.isOk()).toBeTruthy();
			expect(domainUser.value().get('name').get('value')).toBe('John Stuart');
			expect(domainUser.value().id.value()).toBe('valid_id');
			expect(domainUser.value().get('createdAt')).toEqual(new Date('2020-01-01T04:00:23.000Z'));
			expect(domainUser.value().get('updatedAt')).toEqual(new Date('2020-01-01T05:00:23.000Z'));
		});
	});

	describe('from domain to data layer', () => {
		it('should create a model from domain with success', () => {
			const adapter = new DataUserAdapter();

			const model = adapter.build(domainUser);

			expect(model.value()).toEqual(userModel);
		});

		it('should toObject method use adapter', () => {
			const adapter = new DataUserAdapter();
			const model = domainUser.toObject(adapter);
			expect(model).toEqual(userModel);
		})
	});

	describe('adapter with custom error', () => {

		type In = { a: number };
		type Out = { b: string };
		type Err = { err: string; stack?: string };

		class CustomAdapter implements _Adapter<In, Out, Err> {
			build(target: In): _Result<Out, Err> {
				if (typeof target.a !== 'number') return Fail({ err: 'target.a is not a number' });
				return Ok({ b: target.a.toString() });
			}
		}

		const adapter = new CustomAdapter();

		it('should return a success payload', () => {
			const result = adapter.build({ a: 200 });
			expect(result.isOk()).toBeTruthy();
			expect(result.value()).toEqual({ b: '200' });
		});

		it('should return a custom error', () => {
			const result = adapter.build({ a: null as any });
			expect(result.isFail()).toBeTruthy();
			expect(result.error()).toEqual({ err: 'target.a is not a number' });
		});
	});
});

describe('adapter v2', () => {

	describe('only one method', () => {
		class AdapteV2 implements Adapter<number, string> {
			adaptOne(item: number): string {
				return item.toString();
			}
		}

		it('should adapt one', () => {
			const adapter = new AdapteV2();
			const adapted = adapter.adaptOne(5);
			expect(adapted).toBe('5');
		});

	});

	describe('two methods', () => {
		class AdapteV2 implements Adapter<number, string> {
			adaptOne(item: number): string {
				return item.toString();
			}

			adaptMany(itens: number[]): string[] {
				return itens.map(this.adaptOne);
			}

		}

		it('should adapt many', () => {

			const adapter = new AdapteV2();
			const values = adapter.adaptMany([1, 2, 3]);
			expect(values).toEqual(['1', '2', '3'])
		});
	});
});
