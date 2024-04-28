import { ValueObject, Entity, Result, Ok, Fail } from '../../lib/core';
import { IAdapter, IResult } from '../../lib/types';

describe('adapter', () => {

	interface NameProps { value: string; };

	class DomainName extends ValueObject<NameProps>{
		private constructor(props: NameProps) {
			super(props);
		}

		public static create(props: NameProps): IResult<DomainName> {
			return Result.Ok(new DomainName(props));
		}
	}


	interface UserProps { id: string; name: DomainName; createdAt?: Date; updatedAt?: Date };

	class DomainUser extends Entity<UserProps>{
		private constructor(props: UserProps) {
			super(props)
		}

		public static create(props: UserProps): IResult<DomainUser> {
			return Result.Ok(new DomainUser(props));
		}
	}

	interface Model {
		id: string;
		name: string;
		createdAt: Date;
		updatedAt: Date;
	}

	class DomainUserAdapter implements IAdapter<Model, DomainUser>{
		build(target: Model): IResult<DomainUser> {
			return DomainUser.create({
				id: target.id,
				name: DomainName.create({ value: target.name }).value(),
				createdAt: target.createdAt,
				updatedAt: target.updatedAt
			});
		}
	}

	class DataUserAdapter implements IAdapter<DomainUser, Model>{
		build(target: DomainUser): IResult<Model> {

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

		class CustomAdapter implements IAdapter<In, Out, Err>{
			build(target: In): IResult<Out, Err> {
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
