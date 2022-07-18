import {  Entity, Result } from "../../lib/core/index";
import { IResult } from "../../lib/index.types";

describe("entity", () => {

	describe("simple entity", () => {

		interface Props { foo: string };
		
		class EntitySample extends Entity<Props> {
			private constructor(props: Props, id?: string) {
				super(props, id);
			}

			public isValidValue(value: any): boolean {
				return value !== undefined;
			}

			public static create(props: Props, id?: string): IResult<EntitySample> {
				return Result.success(new EntitySample(props, id))
			}
		}

		it('should get prototype', () => {
			const ent = EntitySample.create({ foo: 'bar' });
			
			ent.value().change('foo', 'changed');
			expect(ent.isSuccess()).toBeTruthy();	
		});
	});

});
