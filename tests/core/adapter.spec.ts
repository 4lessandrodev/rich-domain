import { ValueObject, Entity } from '../../lib/core';
import { Adapter, _Adapter } from '../../lib/types';

describe('adapter v1', () => {

	interface NameProps { value: string; };

	class DomainName extends ValueObject<NameProps> {
		private constructor(props: NameProps) {
			super(props);
		}

		public static create(props: NameProps): Promise<DomainName | null> {
			return Promise.resolve(new DomainName(props));
		}
	}


	interface UserProps { id: string; name: DomainName; createdAt?: Date; updatedAt?: Date };

	class DomainUser extends Entity<UserProps> {
		private constructor(props: UserProps) {
			super(props)
		}

		public static async create(props: UserProps): Promise<DomainUser | null> {
			return Promise.resolve(new DomainUser(props));
		}
	}

	interface Model {
		id: string;
		name: string;
		createdAt: Date;
		updatedAt: Date;
	}

	class DomainUserAdapter implements _Adapter<Model, DomainUser> {
		async build(target: Model): Promise<DomainUser | null> {
			const name = await DomainName.create({ value: target.name });
			if(!name) return null;
			return DomainUser.create({
				id: target.id,
				name,
				createdAt: target.createdAt,
				updatedAt: target.updatedAt
			});
		}
	}

	class DataUserAdapter implements _Adapter<DomainUser, Model> {
		async build(target: DomainUser): Promise<Model | null> {
			return Promise.resolve({
				id: target.id.value(),
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

	describe('from data layer to domain', () => {
		it('should a domain entity from data layer with success', async () => {
			const adapter = new DomainUserAdapter();
			const domainUser = await adapter.build(userModel);

			expect(domainUser).not.toBeNull();
			expect(domainUser?.get('name').get('value')).toBe('John Stuart');
			expect(domainUser?.id.value()).toBe('valid_id');
			expect(domainUser?.get('createdAt')).toEqual(new Date('2020-01-01T04:00:23.000Z'));
			expect(domainUser?.get('updatedAt')).toEqual(new Date('2020-01-01T05:00:23.000Z'));
		});
	});

	describe('from domain to data layer', () => {
		it('should create a model from domain with success', async () => {
			const adapter = new DataUserAdapter();
			const name = await DomainName.create({ value: userModel.name });
			const domainUser = await DomainUser.create({ ...userModel, name: name! });
			const model = await adapter.build(domainUser!);

			expect(model).toEqual(userModel);
		});

		it('should toObject method use adapter', async () => {
			const adapter = new DataUserAdapter();
			const name = await DomainName.create({ value: userModel.name });
			const domainUser = await DomainUser.create({ ...userModel, name: name! });
			const model = await domainUser!.toObject(adapter);
			expect(model).toEqual(userModel);
		})
	});

	describe('adapter with custom error', () => {

		type In = { a: number };
		type Out = { b: string };

		class CustomAdapter implements _Adapter<In, Out> {
			async build(target: In): Promise<Out | null> {
				if (typeof target.a !== 'number') return null;
				return { b: target.a.toString() };
			}
		}

		const adapter = new CustomAdapter();

		it('should return a success payload', async () => {
			const result = await adapter.build({ a: 200 });
			expect(result).not.toBeNull();
			expect(result).toEqual({ b: '200' });
		});

		it('should return a custom error', async () => {
			const result = await adapter.build({ a: null as any });
			expect(result).toBeNull();
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