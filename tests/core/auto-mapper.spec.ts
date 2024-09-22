import { Aggregate, AutoMapper, Entity, Id, ID, Iterator, Ok, Result, ValueObject } from "../../lib/core";
import { UID } from "../../lib/types";

describe('auto-mapper', () => {

	describe('value-object', () => {

		it('should convert value to a simple string', () => {

			class StringVo extends ValueObject<{ value: string }> {
				private constructor(props: { value: string }) {
					super(props);
				}
			}

			const vo = StringVo.create({ value: 'hello' });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo.value());

			expect(result).toEqual({ value: 'hello' });

		});

		it('should convert value to an object if result has more than one key', () => {

			class StringVo extends ValueObject<{ value: string, age: number }> {
				private constructor(props: { value: string, age: number }) {
					super(props);
				}
			}

			const vo = StringVo.create({ value: 'hello', age: 21 });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo.value());

			expect(result).toEqual({ value: 'hello', age: 21 });

		});

		it('should get boolean with success', () => {

			class StringVo extends ValueObject<{ value: string, isActive: boolean }> {
				private constructor(props: { value: string, isActive: boolean }) {
					super(props);
				}
			}

			const vo1 = StringVo.create({ value: 'hello', isActive: true });
			const vo2 = StringVo.create({ value: 'hello', isActive: false });

			const autoMapper = new AutoMapper();

			const result1 = autoMapper.valueObjectToObj(vo1.value());
			const result2 = autoMapper.valueObjectToObj(vo2.value());

			expect(result1).toEqual({ value: 'hello', isActive: true });
			expect(result2).toEqual({ value: 'hello', isActive: false });

		});

		it('should convert array and value to a simple object', () => {

			class StringVo extends ValueObject<{ value: string, notes: number[] }> {
				private constructor(props: { value: string, notes: number[] }) {
					super(props);
				}
			}

			const vo = StringVo.create({ value: 'hello', notes: [1, 2, 3, 4, 5, 6, 7] });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo.value());

			expect(result).toEqual({ value: 'hello', notes: [1, 2, 3, 4, 5, 6, 7] });

		});

		it('should get array from value object', () => {

			class StringVo extends ValueObject<{ value: string }> {
				private constructor(props: { value: string }) {
					super(props);
				}
			}

			const vo = StringVo.create({ value: [1, 2, 3, 4, 5, 6, 7] });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo.value());

			expect(result).toEqual({ value: [1, 2, 3, 4, 5, 6, 7] });

		});

		it('should get id value from value object', () => {

			class StringVo extends ValueObject<{ value: ID<string> }> {
				private constructor(props: { value: ID<string> }) {
					super(props);
				}
			}

			const vo = StringVo.create({ value: ID.create('3c5738cf-825e-48b7-884d-927be849b0b6') });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo.value());

			expect(result).toEqual({ value: '3c5738cf-825e-48b7-884d-927be849b0b6' });

		});

		it('should get ids value from value object', () => {

			class StringVo extends ValueObject<{ value: ID<string>[] }> {
				private constructor(props: { value: ID<string>[] }) {
					super(props);
				}
			}

			const ids = Iterator.create({ initialData: ['927be849b0b1', '927be849b0b2', '927be849b0b3'] });

			const IDS: UID<string>[] = [];

			while (ids.hasNext()) {
				IDS.push(ID.create(ids.next()));
			}

			const vo = StringVo.create({ value: IDS });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo.value());

			expect(result).toEqual({ value: ["927be849b0b1", "927be849b0b2", "927be849b0b3"]});

		});

		it('should get value object from value object', () => {

			class StringVo2 extends ValueObject<{ value: string, age: number }> {
				private constructor(props: { value: string, age: number }) {
					super(props);
				}
			}

			class StringVo extends ValueObject<{ value: StringVo2, message: string }> {
				private constructor(props: { value: StringVo2, message: string }) {
					super(props);
				}
			}

			const vo = StringVo.create({
				value: StringVo2.create({ value: 'hello', age: 21 }).value(),
				message: 'text'
			});

			const autoMapper = new AutoMapper<{ value: StringVo2, message: string }>();

			const result = autoMapper.valueObjectToObj(vo.value());

			expect(result).toEqual({ message: "text", value: { value: 'hello', age: 21 } });

		});

		it('should get date from object in other value object', () => {
			process.env.TZ = 'UTC';
			class StringVo2 extends ValueObject<{ value: Date, age: number }> {
				private constructor(props: { value: Date, age: number }) {
					super(props);
				}
			}

			class StringVo extends ValueObject<{ value: StringVo2, message: string }> {
				private constructor(props: { value: StringVo2, message: string }) {
					super(props);
				}
			}

			const vo = StringVo.create({
				value: StringVo2.create({
					value: new Date('2022-01-01T03:00:00.000Z'),
					age: 21
				}).value(),
				message: 'text'
			});

			const autoMapper = new AutoMapper<{ value: StringVo2, message: string }>();

			const result = autoMapper.valueObjectToObj(vo.value());

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

		it('should get object from entity', () => {

			class NameVo extends ValueObject<{ value: string }>{
				private constructor(props: { value: string }) {
					super(props)
				}
			}

			class AgeVo extends ValueObject<{ value: number }>{
				private constructor(props: { value: number }) {
					super(props)
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

			class SimpleEntity extends Entity<Props>{
				private constructor(props: Props, config?: any) {
					super(props, config);
				}
			}

			const age = AgeVo.create({ value: 21 }).value();
			const name = NameVo.create({ value: 'some value' }).value();
			const agg = SimpleEntity.create({
				id: "1519cb69-9904-4f2b-84e1-e6e95431cf24",
				age,
				name,
				notes: [1, 2, 3],
				arraySimpleObject: [
					{
						value1: 'value1',
						value2: 'value1',
						value3: 100,
						value4: new Date('2020-01-01 00:00:00'),
						value5: ['value', 'foo', 'bar']
					}
				] }
			);

			const user = agg.value();

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
		}

		class Name extends ValueObject<{ value: string }> {
			private constructor(props: { value: string }) {
				super(props)
			}
		}

		class Item extends ValueObject<{ name: string }> {
			private constructor(props: { name: string }) {
				super(props)
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

		class Product extends Entity<Props>{
			private constructor(props: Props) {
				super(props);
			}

			public static create(props: Props): Result<Product> {
				return Ok(new Product(props));
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

		class Order extends Aggregate<AggProps>{
			private constructor(props: AggProps) {
				super(props);
			}

			public static create(props: AggProps): Result<Order> {
				return Ok(new Order(props));
			}
		}

		const price = Price.create({ value: 20 }).value();
		const name = Name.create({ value: "jane" }).value();
		const item = Item.create({ name: "some-item" }).value();

		it('should convert an entity to simple object with success', () => {

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
				name,
				item,
				price,
				amount: 42,
				detail: 'detail info',
				lastSales: [item, item, item],
				options: ['a', 'b', 'c'],
				createdAt: now,
				updatedAt: now,
			}
			const product = Product.create(props);
			expect(product.isOk()).toBeTruthy();
			const obj = product.value().toObject();
			expect(obj).toEqual(expectedResult);
			expect(obj).toMatchSnapshot();
		});

		it('should convert an aggregate to simple object with success', () => {
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
				name,
				item,
				price,
				amount: 42,
				detail: 'detail info',
				lastSales: [item, item, item],
				options: ['a', 'b', 'c'],
				createdAt: now,
				updatedAt: now,
			}

			const product = Product.create(props).value();
			const order = Order.create({ ...props, product });

			expect(order.isOk()).toBeTruthy();
			const obj = order.value().toObject();
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

		class Name extends ValueObject<ValueA>{ }
		class Age extends ValueObject<ValueB>{ }

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

		class Profile extends Entity<PropsA>{ }
		interface PropsB {
			id?: UID;
			profile: Profile;
			isMarried: boolean;
			value: number;
			cite: string;
			createdAt: Date;
		}

		class Example extends Entity<PropsB>{ }

		const profile: PropsA = {
			age: Age.create({ value: 21 }).value(),
			data: 'lorem ipsum',
			name: Name.create({ value: 'Mille' }).value(),
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

		const props: PropsB = {
			cite: 'Lorem',
			isMarried: true,
			profile: Profile.create(profile).value(),
			value: 42,
			id: Id('valid-uuid-1'),
			createdAt: new Date('2023-01-05T18:20:41.916Z'),
		};

		const entity = Example.create(props).value();

		it('should convert object on entity to simple object', () => {
			const object = entity.toObject();
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
		it('should get value from entity attribute if instance of ID', () => {

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
				public static create(props: Props): Result<Sample> {
					return Ok(new Sample(props));
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

			const result = Sample.create({
				arr: [Id(t.arr[0]), Id(t.arr[1])],
				id: Id(t.id),
				some: 'sample',
				userId: Id(t.userId),
				createdAt: t.createdAt,
				updatedAt: t.updatedAt
			}).value()
			expect(result.toObject()).toEqual(t);
		});

		it('should get value from value object attribute if instance of ID', () => {

			interface Props {
				userId: UID;
				some: string;
				arr: UID[];
			}
			class Sample extends ValueObject<Props> {
				private constructor(props: Props) {
					super(props)
				}
				public static create(props: Props): Result<Sample> {
					return Ok(new Sample(props));
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

			const result = Sample.create({
				arr: [Id(t.arr[0]), Id(t.arr[1])],
				some: 'sample',
				userId: Id(t.userId)
			}).value()

			expect(result.toObject()).toEqual(t);
		});
	});

	describe('value-object', () => {
		interface Props1 { text: string };
		class Vo1 extends ValueObject<Props1>{
			private constructor(props: Props1) {
				super(props)
			}

			public static create(text: string): Result<Vo1, { e: string }> {
				return Ok(new Vo1({ text }));
			}
		};

		interface Props2 { text: string; vo1: Vo1, nullable: number | null };
		class Vo2 extends ValueObject<Props2>{
			private constructor(props: Props2) {
				super(props)
			}

			public static create(props: Props2): Result<Vo2, { e: string }> {
				return Ok(new Vo2(props));
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
		class Sample extends Entity<Props3>{
			private constructor(props: Props3) {
				super(props)
			}

			public static create(props: Props3): Result<Sample, { e: string }> {
				return Ok(new Sample(props));
			}
		}

		it('should transform in simple object when value object inside other', () => {
			const vo1 = Vo1.create('sub-object').value();
			const vo = Vo2.create({ text: 'example', vo1, nullable: 10 }).value();
			const obj = vo.toObject();
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
		it('should transform on entity', () => {
			const vo1 = Vo1.create('sub-object').value();
			const vo2 = Vo2.create({ text: 'example', vo1, nullable: null }).value();
			const date = new Date();

			const sample = Sample.create({
				level1: vo1,
				level3: vo2,
				nullable: null,
				simple: 'hey there',
				id: Id('8280c69f-be52-4918-ada9-f43d4703dbfe'),
				createdAt: date,
				updatedAt: date
			}).value();

			expect(sample.toObject()).toMatchInlineSnapshot(`
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
