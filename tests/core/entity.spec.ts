import {  Entity, Result } from "../../lib/core";
import { IResult } from "../../lib/types";

describe("entity", () => {

	describe("simple entity", () => {

		interface Props { id?: string, foo: string };
		
		class EntitySample extends Entity<Props> {
			private constructor(props: Props) {
				super(props);
			}

			public isValidValue(value: any): boolean {
				return value !== undefined;
			}

			public static create(props: Props): IResult<EntitySample> {
				return Result.success(new EntitySample(props))
			}
		}

		it('should get prototype', () => {
			const ent = EntitySample.create({ foo: 'bar' });
			
			ent.value().change('foo', 'changed');
			expect(ent.isSuccess()).toBeTruthy();	
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

		it('should clone entity with success', () => {
			const clone = entity.value().clone();
			expect(clone.value().id.value()).not.toBe(id);
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
			expect(result.isFailure()).toBeTruthy();
		});
	});


});
