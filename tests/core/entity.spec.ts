import { Entity, Id, Ok, Result, ValueObject } from "../../lib/core";
import { IResult, UID } from "../../lib/types";

describe("entity", () => {

	describe("simple entity", () => {

		interface Props { id?: string, foo: string };

		class EntitySample extends Entity<Props> {
			private constructor(props: Props) {
				super(props);
			}

			public isValidProps(value: any): boolean {
				return value !== undefined;
			}

			public static create(props: Props): IResult<EntitySample> {
				return Result.Ok(new EntitySample(props))
			}
		}

		it('should get prototype', () => {
			const ent = EntitySample.create({ foo: 'bar' });

			ent.value().change('foo', 'changed');
			expect(ent.isOk()).toBeTruthy();
		});
	});

	describe('toObject', () => {

		class En extends Entity<{ key: string }>{
			private constructor(props: { key: string }) {
				super(props)
			}
		}

		const id = '973e6c78-6771-4a86-ba55-f759a1e68f8c';

		const entity = En.create(
			{
				id,
				key: 'value',
				createdAt: new Date('2022-07-20T15:46:54.373Z'),
				updatedAt: new Date('2022-07-20T15:46:54.373Z')
			}
		);

		it('should get object with success', () => {
			expect(entity.value().toObject()).toEqual({
				id,
				key: 'value',
				createdAt: new Date('2022-07-20T15:46:54.373Z'),
				updatedAt: new Date('2022-07-20T15:46:54.373Z')
			});
		});

		it('should get hash code with success', () => {
			expect(entity.value().hashCode().value()).toBe('[Entity@En]:973e6c78-6771-4a86-ba55-f759a1e68f8c');
		});

		it('should clone entity with success and keep the same id', () => {
			const clone = entity.value().clone();
			expect(clone.id.value()).toBe(id);
			expect(clone.get('key')).toBe('value');
		});

		it('should return fail if provide null props', () => {
			const result = En.create(null);
			expect(result.isFail()).toBeTruthy();
		});
	});

	describe("should accept validation without error", () => {
		interface Props { id?: string, foo: string };

		class EntitySample extends Entity<Props> {
			private constructor(props: Props) {
				super(props);
			}

			validation<Key extends keyof Props>(_value: Props[Key], _key: Key): boolean {
				return _key === 'foo';
			}

			public isValidProps(value: any): boolean {
				return value !== undefined;
			}

			public static create(props: Props): IResult<EntitySample> {
				return Result.Ok(new EntitySample(props))
			}
		}

		it('should get prototype', () => {
			const ent = EntitySample.create({ foo: 'bar' });

			ent.value().change('foo', 'changed');
			expect(ent.isOk()).toBeTruthy();

			ent.value().change('id', 'changed');
			expect(ent.value().id.value()).not.toBe('changed');
		});

		it('should set prototype', () => {
			const ent = EntitySample.create({ foo: 'bar' });
			expect(ent.isOk()).toBeTruthy();
			expect(ent.value().get('foo')).toBe('bar');
			ent.value().set('foo').to('changed');
			expect(ent.value().get('foo')).toBe('changed');
		});

		it('should create many entities', () => {
			const payload = EntitySample.createMany([]);
			expect(payload.result.isFail()).toBeTruthy();
		});
	});

	describe('compare', () => {

		interface Val {
			name: string;
		}

		interface Props {
			id?: UID;
			key: number;
			values: Array<Val>;
		}

		class EntityExample extends Entity<Props>{
			private constructor(props: Props) {
				super(props)
			}

			public static create(props: Props): Result<EntityExample> {
				return Ok(new EntityExample(props));
			}
		}

		it("should to be equal", () => {

			const props = { key: 200, values: [{ name: 'abc' }, { name: 'def' }] } satisfies Props;
			const id = Id();

			const a = EntityExample.create({ ...props, id }).value();
			const b = EntityExample.create({ ...props, id }).value();

			expect(a.isEqual(b)).toBeTruthy();
		});

		it("should to be equal", () => {

			const id = Id();
			const props = { key: 200, values: [{ name: 'abc' }, { name: 'def' }] } satisfies Props;

			const a = EntityExample.create({ ...props, id }).value();
			const b = a.clone();

			expect(a.isEqual(b)).toBeTruthy();
		});

		it("should not to be equal if change state", () => {

			const id = Id();
			const props = { key: 200, values: [{ name: 'abc' }, { name: 'def' }] } satisfies Props;

			const a = EntityExample.create({ ...props, id }).value();
			const b = a.clone();
			b.set('key').to(201);

			expect(a.isEqual(b)).toBeFalsy();
		});

		it("should not to be equal if state is different", () => {

			const id = Id();
			const propsA = { id, key: 200, values: [{ name: 'abc' }, { name: 'def' }] } satisfies Props;
			const propsB = { id, key: 200, values: [{ name: 'abc' }, { name: 'dif' }] } satisfies Props;

			const a = EntityExample.create(propsA).value();
			const b = EntityExample.create(propsB).value();

			expect(a.isEqual(b)).toBeFalsy();
		});

		it("should not to be equal if id is different", () => {

			const propsA = { key: 200, values: [{ name: 'abc' }, { name: 'def' }] } satisfies Props;
			const propsB = { key: 200, values: [{ name: 'abc' }, { name: 'dif' }] } satisfies Props;

			const a = EntityExample.create(propsA).value();
			const b = EntityExample.create(propsB).value();

			expect(a.isEqual(b)).toBeFalsy();
		});

		it("should compare null and undefined", () => {

			const propsA = { key: 200, values: [{ name: 'abc' }, { name: 'def' }] } satisfies Props;
			const a = EntityExample.create(propsA).value();
			expect(a.isEqual(null as unknown as EntityExample)).toBeFalsy();
			expect(a.isEqual(undefined as unknown as EntityExample)).toBeFalsy();
		});
	});
	describe("util", () => {

		interface Props { id?: string, foo: string };

		class ValSamp extends Entity<Props> {
			private constructor(props: Props) {
				super(props);
			}

			public static isValidProps(value: string): boolean {
				return this.validator.string(value).hasLengthBetween(3, 50);
			}

			RemoveSpace(): string {
				return this.util.string(this.props.foo).removeSpaces();
			}

			public static create(props: Props): IResult<ValSamp> {
				const isValid = this.isValidProps(props.foo);
				if (!isValid) return Result.fail('Erro');
				return Result.Ok(new ValSamp(props))
			}
		}

		it('should fail if provide an invalid value', () => {
			const ent = ValSamp.create({ foo: '' });
			expect(ent.isFail()).toBeTruthy();
		});

		it('should remove space from value', () => {
			const ent = ValSamp.create({ foo: ' Some Value With Spaces ' });
			expect(ent.isOk()).toBeTruthy();
			expect(ent.value().RemoveSpace()).toBe('SomeValueWithSpaces');
		});
	});

	describe('toObject', () => {
		it('should infer types to aggregate on toObject method', () => {

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

			class Product extends Entity<Props>{
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

			const object = orange.toObject();
			expect(object.additionalInfo).toEqual(['from brazil']);
			expect(object.name).toBe('orange');
			expect(object.price).toBe(10);
		});
	});
});
