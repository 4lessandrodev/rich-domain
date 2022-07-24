import { AutoMapper, Entity, ID, Iterator, ValueObject } from "../../lib/core";
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
			
			expect(result).toBe('hello');

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

			const vo = StringVo.create({ value: 'hello', notes: [1,2,3,4,5,6,7] });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo.value());
			
			expect(result).toEqual({ value: 'hello', notes: [1,2,3,4,5,6,7] });

		});

		it('should get array from value object', () => {

			class StringVo extends ValueObject<{ value: string }> {
				private constructor(props: { value: string }) {
					super(props);
				}
			}

			const vo = StringVo.create({ value: [1,2,3,4,5,6,7] });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo.value());
			
			expect(result).toEqual([1,2,3,4,5,6,7]);

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
			
			expect(result).toBe('3c5738cf-825e-48b7-884d-927be849b0b6');

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
			
			const vo = StringVo.create({ value:  IDS });

			const autoMapper = new AutoMapper();

			const result = autoMapper.valueObjectToObj(vo.value());
			
			expect(result).toEqual(["927be849b0b1", "927be849b0b2", "927be849b0b3"]);

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
			}

			class SimpleEntity extends Entity<Props>{
				private constructor(props: Props, config?: any) {
					super(props, config);
				}
			}

			const age = AgeVo.create({ value: 21 }).value();
			const name = NameVo.create({ value: 'some value' }).value();
			const agg = SimpleEntity.create({ id: "1519cb69-9904-4f2b-84e1-e6e95431cf24", age, name, notes: [1,2,3] });

			const user = agg.value();

			expect(user.id.value()).toBe('1519cb69-9904-4f2b-84e1-e6e95431cf24');

			const autoMapper = new AutoMapper<Props>();

			const obj = autoMapper.entityToObj(user);
			
			expect(obj.id).toBe('1519cb69-9904-4f2b-84e1-e6e95431cf24');
			expect(obj.age).toBe(21);
			expect(obj.name).toBe('some value');
			expect(obj.createdAt).toBeInstanceOf(Date);
			expect(obj.updatedAt).toBeInstanceOf(Date);
			expect(obj.notes).toEqual([1,2,3]);

		});

	});

});
