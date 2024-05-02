import { AutoMapperSerializer, EntityMapperPayload, IAutoMapper, IEntity, IValueObject } from "../types";
import { Validator } from "../utils";
import ID from "./id";

/**
 * @description Auto Mapper transform a domain resource into object.
 */
export class AutoMapper<Props> implements IAutoMapper<Props> {
	private validator: Validator = Validator.create();

	/**
	 * @description Transform a value object into a simple value.
	 * @param valueObject as instance.
	 * @returns an object or a value object value.
	 */
	valueObjectToObj(valueObject: IValueObject<Props>): AutoMapperSerializer<Props> {
		// internal state
		if (valueObject === null) return null as any;
		if (this.validator.isSymbol(valueObject)) return (valueObject as unknown as Symbol).description as any;
		if (this.validator.isID(valueObject)) return (valueObject as any)?.value();

		let props = {} as { [key in keyof Props]: any };

		const isSimpleValue = this.validator.isBoolean(valueObject) ||
			this.validator.isNumber(valueObject) ||
			this.validator.isString(valueObject) ||
			this.validator.isObject(valueObject) || // primitive object
			this.validator.isDate(valueObject);
		if (isSimpleValue) return valueObject as AutoMapperSerializer<Props>

		const isID = this.validator.isID(valueObject);

		const id: ID<any> = valueObject as unknown as ID<any>;

		if (isID) return id?.value() as any;

		// props
		const voProps = valueObject?.['props'];

		const isSimp = this.validator.isBoolean(voProps) ||
			this.validator.isNumber(voProps) ||
			this.validator.isString(voProps) ||
			this.validator.isDate(voProps);

		if (isSimp) return voProps;

		if (this.validator.isSymbol(voProps)) return (voProps as unknown as Symbol).description as any;

		const keys: Array<keyof Props> = Object.keys(voProps) as Array<keyof Props>;

		const values = keys.map((key) => {

			const isVo = this.validator.isValueObject(voProps?.[key]);

			if (isVo) return this.valueObjectToObj(voProps?.[key] as any);

			const isSimpleValue = this.validator.isBoolean(voProps?.[key]) ||
				this.validator.isNumber(voProps?.[key]) ||
				this.validator.isString(voProps?.[key]) ||
				this.validator.isObject(voProps?.[key]) ||
				this.validator.isDate(voProps?.[key]) ||
				voProps?.[key] === null;

			if (isSimpleValue) return voProps?.[key];

			const isID = this.validator.isID(voProps?.[key]);

			const id: ID<string> = voProps?.[key] as unknown as ID<string>;

			if (isID) return id.value();

			const isArray = this.validator.isArray(voProps?.[key]);

			if (isArray) {
				let arr: Array<any> = voProps?.[key] as unknown as Array<any>;
				const results: Array<any> = [];

				arr.forEach((data) => {
					const result = this.valueObjectToObj(data);
					results.push(result);
				});

				return results;
			}

		});


		if (this.validator.isArray(voProps)) return values as any;
		props = {} as { [key in keyof Props]: any };

		values.forEach((value, i) => {
			props = Object.assign({}, { ...props }, { [keys[i]]: value })
		});

		return props as any;
	}

	/**
	 * @description Transform a entity into a simple object.
	 * @param entity instance.
	 * @returns a simple object.
	 */
	entityToObj(entity: IEntity<Props>): AutoMapperSerializer<Props> & EntityMapperPayload {

		if (this.validator.isID(entity)) return (entity as any)?.value();

		let result = {} as { [key in keyof Props]: any };

		const isEntity = this.validator.isEntity(entity);

		const isAggregate = this.validator.isAggregate(entity);

		const props = entity?.['props'] ?? {};

		const isValueObject = this.validator.isValueObject(entity);

		const isSimpleValue = this.validator.isBoolean(entity) ||
			this.validator.isNumber(entity) ||
			this.validator.isString(entity) ||
			this.validator.isDate(entity) ||
			entity === null;

		if (isSimpleValue) return entity as any;

		if (isValueObject) return this.valueObjectToObj(entity as any) as any;

		if (isEntity || isAggregate) {

			const id = entity?.id?.value();

			const createdAt = entity['props']['createdAt'];

			const updatedAt = entity['props']['updatedAt'];

			result = Object.assign({}, { ...result }, { id, createdAt, updatedAt });

			const keys: Array<keyof Props> = Object.keys(props) as Array<keyof Props>;

			keys.forEach((key) => {

				const isArray = this.validator.isArray(props?.[key as any]);

				if (this.validator.isID(props?.[key as any])) {
					result = Object.assign({}, { ...result }, { [key]: props[key]?.value() });
				}

				if (isArray) {
					const arr: Array<any> = props?.[key as any] as unknown as Array<any> ?? [];

					const subProps = arr.map(
						(item) => this.entityToObj(item as any)
					);

					result = Object.assign({}, { ...result }, { [key]: subProps });
				}

				const isSimple = this.validator.isValueObject(props?.[key as any]) ||
					this.validator.isBoolean(props?.[key as any]) ||
					this.validator.isNumber(props?.[key as any]) ||
					this.validator.isString(props?.[key as any]) ||
					this.validator.isObject(props?.[key as any]) ||
					this.validator.isDate(props?.[key as any]) ||
					this.validator.isSymbol(props) ||
					props?.[key] === null;

				const isEntity = this.validator.isEntity(props?.[key as any]);

				if (isEntity) {
					const data = this.entityToObj(props[key as any] as any);

					result = Object.assign({}, { ...result }, { [key]: data });
				} else if (isSimple) {
					const data = this.valueObjectToObj(props[key as any] as any);

					result = Object.assign({}, { ...result }, { [key]: data });
				}
			});
		}

		return result as any;
	}
}

export default AutoMapper;
