import { Aggregate, AutoMapper, Entity, Id, ID, Iterator, ValueObject } from "../../lib/core";
import { UID } from "../../lib/types";

describe('auto-mapper', () => {

	describe('value-object', () => {

		it('should convert value to a simple string', async () => {

			class StringVo extends ValueObject<{ value: string }> {
				private constructor(props: { value: string }) {
					super(props);
				}
				public static create(props: { value: string }): Promise<StringVo | null> {
					return Promise.resolve(new StringVo(props));
				}
			}

			const vo = await StringVo.create({ value: 'hello' });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo!);

			expect(result).toEqual({ value: 'hello' });

		});

		it('should convert value to an object if result has more than one key', async () => {

			class StringVo extends ValueObject<{ value: string, age: number }> {
				private constructor(props: { value: string, age: number }) {
					super(props);
				}
				public static create(props: { value: string, age: number }): Promise<StringVo | null> {
					return Promise.resolve(new StringVo(props));
				}
			}

			const vo = await StringVo.create({ value: 'hello', age: 21 });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo!);

			expect(result).toEqual({ value: 'hello', age: 21 });

		});

		it('should get boolean with success', async () => {

			class StringVo extends ValueObject<{ value: string, isActive: boolean }> {
				private constructor(props: { value: string, isActive: boolean }) {
					super(props);
				}
				public static create(props: { value: string, isActive: boolean }): Promise<StringVo | null> {
					return Promise.resolve(new StringVo(props));
				}
			}

			const vo1 = await StringVo.create({ value: 'hello', isActive: true });
			const vo2 = await StringVo.create({ value: 'hello', isActive: false });

			const autoMapper = new AutoMapper();

			const result1 = autoMapper.valueObjectToObj(vo1!);
			const result2 = autoMapper.valueObjectToObj(vo2!);

			expect(result1).toEqual({ value: 'hello', isActive: true });
			expect(result2).toEqual({ value: 'hello', isActive: false });

		});

		it('should convert array and value to a simple object', async () => {

			class StringVo extends ValueObject<{ value: string, notes: number[] }> {
				private constructor(props: { value: string, notes: number[] }) {
					super(props);
				}
				public static create(props: { value: string, notes: number[] }): Promise<StringVo | null> {
					return Promise.resolve(new StringVo(props));
				}
			}

			const vo = await StringVo.create({ value: 'hello', notes: [1, 2, 3, 4, 5, 6, 7] });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo!);

			expect(result).toEqual({ value: 'hello', notes: [1, 2, 3, 4, 5, 6, 7] });

		});

		it('should get array from value object', async () => {

			class StringVo extends ValueObject<{ value: any[] }> {
				private constructor(props: { value: any[] }) {
					super(props);
				}
				public static create(props: { value: any[] }): Promise<StringVo | null> {
					return Promise.resolve(new StringVo(props));
				}
			}

			const vo = await StringVo.create({ value: [1, 2, 3, 4, 5, 6, 7] });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo!);

			expect(result).toEqual({ value: [1, 2, 3, 4, 5, 6, 7] });

		});

		it('should get id value from value object', async () => {

			class StringVo extends ValueObject<{ value: UID<string> }> {
				private constructor(props: { value: UID<string> }) {
					super(props);
				}
				public static create(props: { value: UID<string> }): Promise<StringVo | null> {
					return Promise.resolve(new StringVo(props));
				}
			}

			const vo = await StringVo.create({ value: ID.create('3c5738cf-825e-48b7-884d-927be849b0b6') });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo!);

			expect(result).toEqual({ value: '3c5738cf-825e-48b7-884d-927be849b0b6' });

		});

		it('should get ids value from value object', async () => {

			class StringVo extends ValueObject<{ value: UID<string>[] }> {
				private constructor(props: { value: UID<string>[] }) {
					super(props);
				}
				public static create(props: { value: UID<string>[] }): Promise<StringVo | null> {
					return Promise.resolve(new StringVo(props));
				}
			}

			const ids = Iterator.create({ initialData: ['927be849b0b1', '927be849b0b2', '927be849b0b3'] });

			const IDS: UID<string>[] = [];

			while (ids.hasNext()) {
				IDS.push(ID.create(ids.next()));
			}

			const vo = await StringVo.create({ value: IDS });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo!);

			expect(result).toEqual({ value: ["927be849b0b1", "927be849b0b2", "927be849b0b3"] });

		});

		it('should get value object from value object', async () => {

			class StringVo2 extends ValueObject<{ value: string, age: number }> {
				private constructor(props: { value: string, age: number }) {
					super(props);
				}
				public static create(props: { value: string, age: number }): Promise<StringVo2 | null> {
					return Promise.resolve(new StringVo2(props));
				}
			}

			class StringVo extends ValueObject<{ value: StringVo2, message: string }> {
				private constructor(props: { value: StringVo2, message: string }) {
					super(props);
				}
				public static create(props: { value: StringVo2, message: string }): Promise<StringVo | null> {
					return Promise.resolve(new StringVo(props));
				}
			}

			const vo2 = await StringVo2.create({ value: 'hello', age: 21 });
			const vo = await StringVo.create({
				value: vo2!,
				message: 'text'
			});

			const autoMapper = new AutoMapper<{ value: StringVo2, message: string }>();

			const result = autoMapper.valueObjectToObj(vo!);

			expect(result).toEqual({ message: "text", value: { value: 'hello', age: 21 } });

		});

		it('should get date from object in other value object', async () => {
			process.env.TZ = 'UTC';
			class StringVo2 extends ValueObject<{ value: Date, age: number }> {
				private constructor(props: { value: Date, age: number }) {
					super(props);
				}
				public static create(props: { value: Date, age: number }): Promise<StringVo2 | null> {
					return Promise.resolve(new StringVo2(props));
				}
			}

			class StringVo extends ValueObject<{ value: StringVo2, message: string }> {
				private constructor(props: { value: StringVo2, message: string }) {
					super(props);
				}
				public static create(props: { value: StringVo2, message: string }): Promise<StringVo | null> {
					return Promise.resolve(new StringVo(props));
				}
			}

			const vo2 = await StringVo2.create({
				value: new Date('2022-01-01T03:00:00.000Z'),
				age: 21
			});
			const vo = await StringVo.create({
				value: vo2!,
				message: 'text'
			});

			const autoMapper = new AutoMapper<{ value: StringVo2, message: string }>();

			const result = autoMapper.valueObjectToObj(vo!);

			expect(result).toEqual({
				message: "text",
				value: {
					value: new Date('2022-01-01T03:00:00.000Z'),
					age: 21
				}
			});

		});

	});

	describe('entity', () => {

		it('should get object from entity', async () => {

			class NameVo extends ValueObject<{ value: string }> {
				private constructor(props: { value: string }) {
					super(props)
				}
				public static create(props: { value: string }): Promise<NameVo | null> {
					return Promise.resolve(new NameVo(props));
				}
			}

			class AgeVo extends ValueObject<{ value: number }> {
				private constructor(props: { value: number }) {
					super(props)
				}
				public static create(props: { value: number }): Promise<AgeVo | null> {
					return Promise.resolve(new AgeVo(props));
				}
			}

			interface Props {
				id?: string;
				name: NameVo;
				age: AgeVo;
				notes: Array<number>;
				arraySimpleObject: Array<{
					value1: string;
					value2: string;
					value3: number;
					value4: Date;
					value5: string[];
				}>
			}

			class SimpleEntity extends Entity<Props> {
				private constructor(props: Props, config?: any) {
					super(props, config);
				}
				public static create(props: Props): Promise<SimpleEntity | null> {
					return Promise.resolve(new SimpleEntity(props));
				}
			}

			const age = await AgeVo.create({ value: 21 });
			const name = await NameVo.create({ value: 'some value' });
			const agg = await SimpleEntity.create({
				id: "1519cb69-9904-4f2b-84e1-e6e95431cf24",
				age: age!,
				name: name!,
				notes: [1, 2, 3],
				arraySimpleObject: [
					{
						value1: 'value1',
						value2: 'value1',
						value3: 100,
						value4: new Date('2020-01-01 00:00:00'),
						value5: ['value', 'foo', 'bar']
					}
				]
			}
			);

			const user = agg!;

			expect(user.id.value()).toBe('1519cb69-9904-4f2b-84e1-e6e95431cf24');

			const autoMapper = new AutoMapper<Props>();

			const obj = autoMapper.entityToObj(user);

			expect(obj.id).toBe('1519cb69-9904-4f2b-84e1-e6e95431cf24');
			expect(obj.age).toEqual({ value: 21 });
			expect(obj.name).toEqual({ value: 'some value' });
			expect(obj.createdAt).toBeInstanceOf(Date);
			expect(obj.updatedAt).toBeInstanceOf(Date);
			expect(obj.notes).toEqual([1, 2, 3]);
			expect(obj.arraySimpleObject).toEqual([{
				value1: 'value1',
				value2: 'value1',
				value3: 100,
				value4: new Date('2020-01-01 00:00:00'),
				value5: ['value', 'foo', 'bar']
			}]);

		});

	});

	describe('complex entity', () => {

		class Price extends ValueObject<{ value: number }> {
			private constructor(props: { value: number }) {
				super(props)
			}
			public static create(props: { value: number }): Promise<Price | null> {
				return Promise.resolve(new Price(props));
			}
		}

		class Name extends ValueObject<{ value: string }> {
			private constructor(props: { value: string }) {
				super(props)
			}
			public static create(props: { value: string }): Promise<Name | null> {
				return Promise.resolve(new Name(props));
			}
		}

		class Item extends ValueObject<{ name: string }> {
			private constructor(props: { name: string }) {
				super(props)
			}
			public static create(props: { name: string }): Promise<Item | null> {
				return Promise.resolve(new Item(props));
			}
		}
		interface Props {
			id: UID;
			price: Price;
			name: Name;
			item: Item;
			detail: string;
			amount: number;
			options: string[];
			lastSales: Item[];
			createdAt: Date;
			updatedAt: Date;
		}

		class Product extends Entity<Props> {
			private constructor(props: Props) {
				super(props);
			}

			public static create(props: Props): Promise<Product | null> {
				return Promise.resolve(new Product(props));
			}
		}

		interface AggProps {
			id: UID;
			product: Product;
			price: Price;
			name: Name;
			item: Item;
			detail: string;
			amount: number;
			options: string[];
			lastSales: Item[];
			createdAt: Date;
			updatedAt: Date;
		}

		class Order extends Aggregate<AggProps> {
			private constructor(props: AggProps) {
				super(props);
			}

			public static create(props: AggProps): Promise<Order | null> {
				return Promise.resolve(new Order(props));
			}
		}

		it('should convert an entity to simple object with success', async () => {

			const price = await Price.create({ value: 20 });
			const name = await Name.create({ value: "jane" });
			const item = await Item.create({ name: "some-item" });

			const now = new Date('2022-11-27T22:39:58.897Z');
			const id = Id('f25a30cb-294c-4269-8e8c-060403f3a971');
			const itemObj = "some-item";

			const expectedResult = {
				id: id.value(),
				name: { value: "jane" },
				item: { name: itemObj },
				price: { value: 20 },
				amount: 42,
				detail: 'detail info',
				lastSales: [{ name: itemObj }, { name: itemObj }, { name: itemObj }],
				options: ['a', 'b', 'c'],
				createdAt: now,
				updatedAt: now,
			};

			const props: Props = {
				id,
				name: name!,
				item: item!,
				price: price!,
				amount: 42,
				detail: 'detail info',
				lastSales: [item!, item!, item!],
				options: ['a', 'b', 'c'],
				createdAt: now,
				updatedAt: now,
			}
			const product = await Product.create(props);
			expect(product).not.toBeNull();
			const obj = await product!.toObject();
			expect(obj).toEqual(expectedResult);
			expect(obj).toMatchSnapshot();
		});

		it('should convert an aggregate to simple object with success', async () => {
			const price = await Price.create({ value: 20 });
			const name = await Name.create({ value: "jane" });
			const item = await Item.create({ name: "some-item" });

			const now = new Date('2022-11-27T22:39:58.897Z');
			const id = Id('f25a30cb-294c-4269-8e8c-060403f3a971');
			const itemObj = "some-item";

			const prop = {
				id: id.value(),
				name: { value: "jane" },
				item: { name: itemObj },
				price: { value: 20 },
				amount: 42,
				detail: 'detail info',
				lastSales: [{ name: itemObj }, { name: itemObj }, { name: itemObj }],
				options: ['a', 'b', 'c'],
				createdAt: now,
				updatedAt: now,
			};

			const expectedResult = {
				id: id.value(),
				product: prop,
				name: { value: "jane" },
				item: { name: itemObj },
				price: { value: 20 },
				amount: 42,
				detail: 'detail info',
				lastSales: [{ name: itemObj }, { name: itemObj }, { name: itemObj }],
				options: ['a', 'b', 'c'],
				createdAt: now,
				updatedAt: now,
			};

			const props: Props = {
				id,
				name: name!,
				item: item!,
				price: price!,
				amount: 42,
				detail: 'detail info',
				lastSales: [item!, item!, item!],
				options: ['a', 'b', 'c'],
				createdAt: now,
				updatedAt: now,
			}

			const product = await Product.create(props);
			const order = await Order.create({ ...props, product: product! });

			expect(order).not.toBeNull();
			const obj = await order!.toObject();
			expect(obj).toEqual(expectedResult);
			expect(obj).toMatchSnapshot();
		});

	})

	describe("auto mapper entity with object", () => {

		interface ValueA {
			value: string;
		}

		interface ValueB {
			value: number;
		}

		interface Detail {
			nick: string;
			site: string;
			likes: number;
			summary: string[];
		}

		class Name extends ValueObject<ValueA> { 
			public static create(props: ValueA): Promise<Name | null> {
				return Promise.resolve(new Name(props));
			}
		}
		class Age extends ValueObject<ValueB> { 
			public static create(props: ValueB): Promise<Age | null> {
				return Promise.resolve(new Age(props));
			}
		}

		interface PropsA {
			id?: UID;
			name: Name;
			age: Age;
			data: string;
			value: number;
			notes: number[];
			detail: Detail;
			createdAt: Date;
		}

		class Profile extends Entity<PropsA> { 
			public static create(props: PropsA): Promise<Profile | null> {
				return Promise.resolve(new Profile(props));
			}
		}
		interface PropsB {
			id?: UID;
			profile: Profile;
			isMarried: boolean;
			value: number;
			cite: string;
			createdAt: Date;
		}

		class Example extends Entity<PropsB> { 
			public static create(props: PropsB): Promise<Example | null> {
				return Promise.resolve(new Example(props));
			}
		}

		it('should convert object on entity to simple object', async () => {
			const age = await Age.create({ value: 21 });
			const name = await Name.create({ value: 'Mille' });
			const profileProps: PropsA = {
				age: age!,
				data: 'lorem ipsum',
				name: name!,
				notes: [10, 20, 30],
				value: 7,
				id: Id('valid-uuid-2'),
				createdAt: new Date('2023-01-05T18:20:41.916Z'),
				detail: {
					likes: 200,
					nick: 'Loader',
					site: '4dev.com',
					summary: ['page1', 'page2'],
				},
			};

			const profile = await Profile.create(profileProps);

			const props: PropsB = {
				cite: 'Lorem',
				isMarried: true,
				profile: profile!,
				value: 42,
				id: Id('valid-uuid-1'),
				createdAt: new Date('2023-01-05T18:20:41.916Z'),
			};

			const entity = await Example.create(props);

			const object = await entity!.toObject();
			expect(object).toEqual({
				id: "valid-uuid-1",
				cite: 'Lorem',
				createdAt: new Date("2023-01-05T18:20:41.916Z"),
				updatedAt: expect.any(Date),
				isMarried: true,
				value: 42,
				profile: {
					age: { value: 21 },
					data: 'lorem ipsum',
					name: { value: 'Mille' },
					notes: [10, 20, 30],
					value: 7,
					id: 'valid-uuid-2',
					createdAt: new Date("2023-01-05T18:20:41.916Z"),
					updatedAt: expect.any(Date),
					detail: {
						likes: 200,
						nick: 'Loader',
						site: '4dev.com',
						summary: ['page1', 'page2']
					}
				}
			});
		})
	});

	describe('uid', () => {
		it('should get value from entity attribute if instance of ID', async () => {

			interface Props {
				id: UID;
				userId: UID;
				some: string;
				arr: UID[];
				createdAt: Date;
				updatedAt: Date;
			}
			class Sample extends Entity<Props> {
				private constructor(props: Props) {
					super(props)
				}
				public static create(props: Props): Promise<Sample | null> {
					return Promise.resolve(new Sample(props));
				}
			}

			const t = {
				createdAt: new Date('2020-01-01 00:00:00'),
				updatedAt: new Date('2020-01-01 00:00:00'),
				id: '80961b81-0d45-454a-b54a-b146c7700828',
				userId: 'aa1d2188-cf30-4a57-abf1-ff28c1ee71db',
				some: 'sample',
				arr: [
					'91861ce3-5e29-44d3-9a4c-850c585d87b5',
					'647ec7ca-98c7-4078-ae4a-7a62fe1a47f1'
				]
			};

			const result = await Sample.create({
				arr: [Id(t.arr[0]), Id(t.arr[1])],
				id: Id(t.id),
				some: 'sample',
				userId: Id(t.userId),
				createdAt: t.createdAt,
				updatedAt: t.updatedAt
			});
			const obj = await result!.toObject();
			expect(obj).toEqual(t);
		});

		it('should get value from value object attribute if instance of ID', async () => {

			interface Props {
				userId: UID;
				some: string;
				arr: UID[];
			}
			class Sample extends ValueObject<Props> {
				private constructor(props: Props) {
					super(props)
				}
				public static create(props: Props): Promise<Sample | null> {
					return Promise.resolve(new Sample(props));
				}
			}

			const t = {
				userId: 'aa1d2188-cf30-4a57-abf1-ff28c1ee71db',
				some: 'sample',
				arr: [
					'91861ce3-5e29-44d3-9a4c-850c585d87b5',
					'647ec7ca-98c7-4078-ae4a-7a62fe1a47f1'
				]
			};

			const result = await Sample.create({
				arr: [Id(t.arr[0]), Id(t.arr[1])],
				some: 'sample',
				userId: Id(t.userId)
			});

			const obj = await result!.toObject();
			expect(obj).toEqual(t);
		});
	});

	describe('value-object', () => {
		interface Props1 { text: string };
		class Vo1 extends ValueObject<Props1> {
			private constructor(props: Props1) {
				super(props)
			}

			public static create(text: string): Promise<Vo1 | null> {
				return Promise.resolve(new Vo1({ text }));
			}
		};

		interface Props2 { text: string; vo1: Vo1, nullable: number | null };
		class Vo2 extends ValueObject<Props2> {
			private constructor(props: Props2) {
				super(props)
			}

			public static create(props: Props2): Promise<Vo2 | null> {
				return Promise.resolve(new Vo2(props));
			}
		};

		interface Props3 {
			level3: Vo2;
			level1: Vo1;
			simple: string;
			nullable: number | null;
			id: UID;
			createdAt: Date;
			updatedAt: Date;
		}
		class Sample extends Entity<Props3> {
			private constructor(props: Props3) {
				super(props)
			}

			public static create(props: Props3): Promise<Sample | null> {
				return Promise.resolve(new Sample(props));
			}
		}

		it('should transform in simple object when value object inside other', async () => {
			const vo1 = await Vo1.create('sub-object');
			const vo = await Vo2.create({ text: 'example', vo1: vo1!, nullable: 10 });
			const obj = await vo!.toObject();
			expect(obj).toMatchInlineSnapshot(`
Object {
  "nullable": 10,
  "text": "example",
  "vo1": Object {
    "text": "sub-object",
  },
}
`);

		})
		it('should transform on entity', async () => {
			const vo1 = await Vo1.create('sub-object');
			const vo2 = await Vo2.create({ text: 'example', vo1: vo1!, nullable: null });
			const date = new Date();

			const sample = await Sample.create({
				level1: vo1!,
				level3: vo2!,
				nullable: null,
				simple: 'hey there',
				id: Id('8280c69f-be52-4918-ada9-f43d4703dbfe'),
				createdAt: date,
				updatedAt: date
			});

			const obj = await sample!.toObject();
			expect(obj).toMatchInlineSnapshot(`
Object {
  "createdAt": ${date.toISOString()},
  "id": "8280c69f-be52-4918-ada9-f43d4703dbfe",
  "level1": Object {
    "text": "sub-object",
  },
  "level3": Object {
    "nullable": null,
    "text": "example",
    "vo1": Object {
      "text": "sub-object",
    },
  },
  "nullable": null,
  "simple": "hey there",
  "updatedAt": ${date.toISOString()},
}
`);
		})
	});

});

describe('should create object with success', () => {

	interface PostProps {
		name: string;
		comments: string[];
		likes: number;
	}

	class Post extends ValueObject<PostProps> {
		private constructor(props: PostProps) {
			super(props);
		}

		public static init(props: PostProps): Post {
			return new Post(props);
		}
	}

	interface UserProps {
		id?: UID;
		name: string;
		age: number;
		tags: string[];
		likes: number[];
		posts: Post[];
		friends: User[];
		createdAt?: Date;
		updatedAt?: Date;
	}

	class User extends Entity<UserProps> {
		private constructor(props: UserProps) {
			super(props);
		}

		public static init(props: UserProps): User {
			return new User(props);
		}
	}

	it('object', async () => {
		const post = Post.init({
			comments: ['lorem', 'test', 'sample001'],
			likes: 1,
			name: 'sample'
		});

		const jane = User.init({
			id: Id('fde45011-952e-443b-8674-9cbd2acf9c40'),
			age: 25,
			friends: [],
			likes: [10, 34],
			name: 'jane doe',
			posts: [post, post, post],
			tags: ['social', 'network'],
			createdAt: new Date('2024-12-15T18:00:14.761Z'),
			updatedAt: new Date('2024-12-15T18:00:14.761Z')
		});

		const john = User.init({
			id: Id('fc4c5e4a-5345-4100-9d6e-9f1777f34ffb'),
			age: 27,
			friends: [jane],
			likes: [26, 32, 44],
			name: 'john doe',
			posts: [post, post],
			tags: ['game', 'sports'],
			createdAt: new Date('2024-12-15T18:00:14.761Z'),
			updatedAt: new Date('2024-12-15T18:00:14.761Z')
		});

		const johnObj = await john.toObject();
		const janeObj = await jane.toObject();

		expect(johnObj).toEqual({
			"age": 27,
			"createdAt": expect.any(Date),
			"friends": [
				{
					"age": 25,
					"createdAt": expect.any(Date),
					"friends": [],
					"id": "fde45011-952e-443b-8674-9cbd2acf9c40",
					"likes": [
						10,
						34,
					],
					"name": "jane doe",
					"posts": [
						{
							"comments": [
								"lorem",
								"test",
								"sample001",
							],
							"likes": 1,
							"name": "sample",
						},
						{
							"comments": [
								"lorem",
								"test",
								"sample001",
							],
							"likes": 1,
							"name": "sample",
						},
						{
							"comments": [
								"lorem",
								"test",
								"sample001",
							],
							"likes": 1,
							"name": "sample",
						},
					],
					"tags": [
						"social",
						"network",
					],
					"updatedAt": expect.any(Date),
				},
			],
			"id": "fc4c5e4a-5345-4100-9d6e-9f1777f34ffb",
			"likes": [
				26,
				32,
				44,
			],
			"name": "john doe",
			"posts": [
				{
					"comments": [
						"lorem",
						"test",
						"sample001",
					],
					"likes": 1,
					"name": "sample",
				},
				{
					"comments": [
						"lorem",
						"test",
						"sample001",
					],
					"likes": 1,
					"name": "sample",
				},
			],
			"tags": [
				"game",
				"sports",
			],
			"updatedAt": expect.any(Date),
		});
		expect(janeObj).toEqual({
			"age": 25,
			"createdAt": expect.any(Date),
			"friends": [],
			"id": "fde45011-952e-443b-8674-9cbd2acf9c40",
			"likes": [
				10,
				34,
			],
			"name": "jane doe",
			"posts": [
				{
					"comments": [
						"lorem",
						"test",
						"sample001",
					],
					"likes": 1,
					"name": "sample",
				},
				{
					"comments": [
						"lorem",
						"test",
						"sample001",
					],
					"likes": 1,
					"name": "sample",
				},
				{
					"comments": [
						"lorem",
						"test",
						"sample001",
					],
					"likes": 1,
					"name": "sample",
				},
			],
			"tags": [
				"social",
				"network",
			],
			"updatedAt": expect.any(Date),
		});
	});
});

describe('', () => {
	it('', async () => {

		class Money extends ValueObject<number> {
			private constructor(value: number) {
				super(value);
			}

			public static init(value: number): Money {
				return new Money(value);
			}
		}

		interface Operation {
			value: Money;
			description: string;
		}

		interface Props {
			id?: UID;
			operations: Operation[];
			createdAt?: Date;
			updatedAt?: Date;
		}

		class Payment extends Entity<Props> {
			private constructor(props: Props) {
				super(props);
			}

			public static init(props: Props): Payment {
				return new Payment(props);
			}
		}

		const payment = Payment.init({
			id: Id('1'),
			operations: [
				{
					description: 'internet',
					value: Money.init(50)
				},
				{
					description: 'light',
					value: Money.init(70)
				}
			],
			createdAt: new Date('2024-12-15T18:17:17.422Z'),
			updatedAt: new Date('2024-12-15T18:17:17.422Z')
		});

		const obj = await payment.toObject();
		expect(obj).toEqual({
			"createdAt": expect.any(Date),
			"id": "1",
			"operations": [
				{
					"description": "internet",
					"value": 50,
				},
				{
					"description": "light",
					"value": 70,
				},
			],
			"updatedAt": expect.any(Date),
		})
	})
})

describe('auto-mapper additional tests', () => {

	// Cenário: Valor simples null e undefined
	describe('primitive values: null and undefined', () => {

		class SimpleVo extends ValueObject<{ value: string | null | undefined }> {
			private constructor(props: { value: string | null | undefined }) {
				super(props);
			}
			public static create(value: string | null | undefined): Promise<SimpleVo | null> {
				return Promise.resolve(new SimpleVo({ value }));
			}
		}

		it('should return null if value is null', async () => {
			const vo = await SimpleVo.create(null);
			const autoMapper = new AutoMapper<{ value: string | null }>();
			const result = autoMapper.valueObjectToObj(vo as any);
			expect(result).toEqual({ value: null });
		});

		it('should return undefined if value is undefined', async () => {
			const vo = await SimpleVo.create(undefined);
			const autoMapper = new AutoMapper<{ value: string | undefined }>();
			const result = autoMapper.valueObjectToObj(vo as any);
			expect(result).toEqual({ value: undefined });
		});
	});

	// Cenário: Symbol
	describe('primitive special: symbol', () => {
		class SymbolVo extends ValueObject<{ tag: symbol }> {
			private constructor(props: { tag: symbol }) {
				super(props);
			}
			public static create(tag: symbol): Promise<SymbolVo | null> {
				return Promise.resolve(new SymbolVo({ tag }));
			}
		}

		it('should convert symbol to its description', async () => {
			const sym = Symbol("myTag");
			const vo = await SymbolVo.create(sym);
			const autoMapper = new AutoMapper<{ tag: symbol }>();
			const result = autoMapper.valueObjectToObj(vo!);
			expect(result).toEqual({ tag: "myTag" });
		});
	});

	// Cenário: Arrays com tipos mistos
	describe('arrays with mixed types', () => {

		class MixedVo extends ValueObject<{ data: any[] }> {
			private constructor(props: { data: any[] }) {
				super(props);
			}
			public static create(data: any[]): Promise<MixedVo | null> {
				return Promise.resolve(new MixedVo({ data }));
			}
		}

		it('should handle arrays with mixed data types', async () => {
			const arr = [ID.create('123'), 'hello', 42, new Date('2020-01-01')];
			const vo = await MixedVo.create(arr);
			const autoMapper = new AutoMapper<{ data: any[] }>();
			const result = autoMapper.valueObjectToObj(vo!);
			expect(result).toEqual({
				data: [
					'123',
					'hello',
					42,
					new Date('2020-01-01T00:00:00.000Z')
				]
			});
		});
	});

	// Cenário: ValueObject aninhado em outro ValueObject
	describe('nested value objects', () => {

		class InnerVo extends ValueObject<{ message: string }> {
			private constructor(props: { message: string }) {
				super(props);
			}
			public static create(message: string): Promise<InnerVo | null> {
				return Promise.resolve(new InnerVo({ message }));
			}
		}

		class OuterVo extends ValueObject<{ data: InnerVo }> {
			private constructor(props: { data: InnerVo }) {
				super(props);
			}
			public static create(data: InnerVo): Promise<OuterVo | null> {
				return Promise.resolve(new OuterVo({ data }));
			}
		}

		it('should recursively convert nested value objects', async () => {
			const inner = await InnerVo.create('inner text');
			const outer = await OuterVo.create(inner!);
			const autoMapper = new AutoMapper<{ data: InnerVo }>();
			const result = autoMapper.valueObjectToObj(outer!);
			expect(result).toEqual({
				data: { message: 'inner text' }
			});
		});
	});

	// Cenário: Entidade simples sem props definidos
	describe('entity without props defined', () => {

		interface EmptyProps { }

		class EmptyEntity extends Entity<EmptyProps> {
			private constructor(props: EmptyProps) {
				super(props);
			}
			public static create(): Promise<EmptyEntity | null> {
				return Promise.resolve(new EmptyEntity({}));
			}
		}

		it('should handle entity with no props gracefully', async () => {
			const entity = await EmptyEntity.create();
			const autoMapper = new AutoMapper<EmptyProps>();
			const result = autoMapper.entityToObj(entity!);
			// result deve ter apenas id, createdAt, updatedAt
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('createdAt');
			expect(result).toHaveProperty('updatedAt');
		});

	});

	// Cenário: Arrays de entidades
	describe('entity with arrays of entities', () => {

		class ChildVo extends ValueObject<{ name: string }> {
			private constructor(props: { name: string }) {
				super(props);
			}
			public static create(name: string): Promise<ChildVo | null> {
				return Promise.resolve(new ChildVo({ name }));
			}
		}

		interface ChildProps {
			id?: UID;
			childName: ChildVo;
		}

		class ChildEntity extends Entity<ChildProps> {
			private constructor(props: ChildProps) {
				super(props);
			}
			public static async create(name: string): Promise<ChildEntity | null> {
				const childVo = await ChildVo.create(name);
				return Promise.resolve(new ChildEntity({ childName: childVo! }));
			}
		}

		interface ParentProps {
			id?: UID;
			children: ChildEntity[];
		}

		class ParentEntity extends Entity<ParentProps> {
			private constructor(props: ParentProps) {
				super(props);
			}
			public static create(children: ChildEntity[]): Promise<ParentEntity | null> {
				return Promise.resolve(new ParentEntity({ children }));
			}
		}

		it('should convert entity with array of child entities', async () => {
			const child1 = await ChildEntity.create('child1');
			const child2 = await ChildEntity.create('child2');

			const parent = await ParentEntity.create([child1!, child2!]);

			const autoMapper = new AutoMapper<ParentProps>();
			const result = autoMapper.entityToObj(parent!);
			expect(result.children).toEqual([
				{
					id: expect.any(String),
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
					childName: { name: 'child1' }
				},
				{
					id: expect.any(String),
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
					childName: { name: 'child2' }
				}
			]);
		});
	});

	// Cenário: Aggregate aninhando outra Aggregate/Entity
	describe('aggregate with nested aggregates/entities', () => {

		class SimpleVo extends ValueObject<{ text: string }> {
			private constructor(props: { text: string }) {
				super(props);
			}
			public static create(text: string): Promise<SimpleVo | null> {
				return Promise.resolve(new SimpleVo({ text }));
			}
		}

		interface SimpleProps {
			id?: UID;
			description: SimpleVo;
		}

		class SimpleEntity extends Entity<SimpleProps> {
			private constructor(props: SimpleProps) {
				super(props);
			}
			public static async create(desc: string): Promise<SimpleEntity | null> {
				const simpleVo = await SimpleVo.create(desc);
				return Promise.resolve(new SimpleEntity({
					description: simpleVo!
				}));
			}
		}

		interface AggProps {
			id?: UID;
			entity: SimpleEntity;
			name: string;
		}

		class SampleAggregate extends Aggregate<AggProps> {
			private constructor(props: AggProps) {
				super(props);
			}
			public static create(props: AggProps): Promise<SampleAggregate | null> {
				return Promise.resolve(new SampleAggregate(props));
			}
		}

		it('should convert aggregate with nested entity', async () => {
			const entity = await SimpleEntity.create('desc');
			const agg = await SampleAggregate.create({ entity: entity!, name: 'agg-name' });

			const result = await agg!.toObject();
			expect(result).toEqual({
				id: expect.any(String),
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
				entity: {
					id: expect.any(String),
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
					description: { text: 'desc' }
				},
				name: 'agg-name'
			});
		});
	});

	// Cenário: Objetos não "compatíveis"
	describe('unusual input', () => {
		it('should handle a function as input gracefully', () => {
			const autoMapper = new AutoMapper<any>();

			const fn = function () { return "test"; };
			const result = autoMapper.valueObjectToObj(fn as any);

			// Dependendo da lógica, pode retornar um objeto vazio ou algo similar
			// Aqui supõe-se que é tratado como objeto simples
			expect(typeof result).toBe('object');
		});

		it('should handle undefined props in value object', async () => {
			class PartialVo extends ValueObject<{ text?: string, count?: number }> {
				private constructor(props: { text?: string, count?: number }) {
					super(props);
				}
				public static create(props: { text?: string, count?: number }): Promise<PartialVo | null> {
					return Promise.resolve(new PartialVo(props));
				}
			}

			const vo = await PartialVo.create({ text: 'partial' });
			const autoMapper = new AutoMapper<{ text?: string, count?: number }>();
			const result = autoMapper.valueObjectToObj(vo!);
			expect(result).toEqual({ text: 'partial', count: undefined });
		});
	});
});