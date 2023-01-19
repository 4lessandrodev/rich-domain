import {  Entity, Id, Ok, Result } from "../../lib/core";
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
			expect(clone.value().id.value()).toBe(id);
			expect(clone.value().get('key')).toBe('value');
		});

		it('should snapshot entity', () => {
			expect(entity.value().history().count()).toBe(1);
			entity.value().history().snapshot();
			expect(entity.value().history().count()).toBe(2);
		});

		it('should return last history if try to go next and it does not exists', () => {
			const step1 = entity.value().history().forward();
			const step2 = entity.value().history().forward();
			const step3 = entity.value().history().forward();
			const step4 = entity.value().history().forward();

			expect(step1).not.toBeNull();
			expect(step2).not.toBeNull();
			expect(step3).not.toBeNull();
			expect(step4).not.toBeNull();
		});

		it('should list history', () => {
			const history = entity.value().history().list();
			expect(Array.isArray(history)).toBeTruthy();
			expect(history).toHaveLength(2);
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

			const props = { key: 200, values:[ {name: 'abc'},{name: 'def'}] } satisfies Props;
			const id = Id();

			const a = EntityExample.create({...props, id }).value();
			const b = EntityExample.create({...props, id}).value();
			
			expect(a.isEqual(b)).toBeTruthy();
		});

		it("should to be equal", () => {

			const id = Id();
			const props = { key: 200, values:[ {name: 'abc'},{name: 'def'}] } satisfies Props;

			const a = EntityExample.create({...props, id}).value();
			const b = a.clone().value();
			
			expect(a.isEqual(b)).toBeTruthy();
		});

		it("should not to be equal if change state", () => {

			const id = Id();
			const props = { key: 200, values:[ {name: 'abc'},{name: 'def'}] } satisfies Props;

			const a = EntityExample.create({...props, id}).value();
			const b = a.clone().value();
			b.set('key').to(201);
			
			expect(a.isEqual(b)).toBeFalsy();
		});

		it("should not to be equal if state is different", () => {

			const id = Id();
			const propsA = { id, key: 200, values:[ {name: 'abc'},{name: 'def'}] } satisfies Props;
			const propsB = { id, key: 200, values:[ {name: 'abc'},{name: 'dif'}] } satisfies Props;

			const a = EntityExample.create(propsA).value();
			const b = EntityExample.create(propsB).value();

			expect(a.isEqual(b)).toBeFalsy();
		});

		it("should not to be equal if id is different", () => {

			const propsA = { key: 200, values:[ {name: 'abc'},{name: 'def'}] } satisfies Props;
			const propsB = { key: 200, values:[ {name: 'abc'},{name: 'dif'}] } satisfies Props;

			const a = EntityExample.create(propsA).value();
			const b = EntityExample.create(propsB).value();

			expect(a.isEqual(b)).toBeFalsy();
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
				if(!isValid) return Result.fail('Erro');
				return Result.Ok(new ValSamp(props))
			}
		}

		it('should fiail if provide an invalid value', () => {
			const ent = ValSamp.create({ foo: '' });
			expect(ent.isFail()).toBeTruthy();
		});

		it('should remove space from value', () => {
			const ent = ValSamp.create({ foo: ' Some Value With Spaces ' });
			expect(ent.isOk()).toBeTruthy();
			expect(ent.value().RemoveSpace()).toBe('SomeValueWithSpaces');
		});
	});
});
