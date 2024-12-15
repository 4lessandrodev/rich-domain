import { AutoMapperSerializer, EntityMapperPayload, _AutoMapper, _Entity, _ValueObject } from "../types";
import { Validator } from "../utils";
import ID from "./id";

/**
 * @description The AutoMapper class is responsible for transforming domain resources (entities, value objects) 
 * into plain objects or primitive values. It provides methods to recursively process nested value objects, IDs, 
 * entities, and arrays, ensuring all complex data structures are serialized into a consistent object format.
 */
export class AutoMapper<Props> implements _AutoMapper<Props> {
	private validator: Validator = Validator.create();

	/**
	 * @description Converts a value object into a plain object or a primitive value. 
	 * This method handles multiple scenarios, including:
	 * - Null values
	 * - Symbol values
	 * - ID values
	 * - Simple data types (strings, numbers, booleans, dates, objects)
	 * - Nested value objects
	 * - Arrays containing complex data
	 * @param valueObject An instance representing a value object to be transformed.
	 * @returns A plain object, primitive value, or serialized structure derived from the given value object.
	 */
	valueObjectToObj(valueObject: _ValueObject<Props>): AutoMapperSerializer<Props> {
		// Handle null or special cases
		if (valueObject === null) return null as any;
		if (typeof valueObject === 'undefined') return undefined as any;
		if (this.validator.isSymbol(valueObject)) return (valueObject as unknown as Symbol).description as any;
		if (this.validator.isID(valueObject)) return (valueObject as any)?.value();

		// Check if the object is a simple value (e.g., boolean, number, string, date)
		const isSimpleValue = this.validator.isBoolean(valueObject) ||
			this.validator.isNumber(valueObject) ||
			this.validator.isString(valueObject) ||
			this.validator.isDate(valueObject);

		const isSimpleObject = this.validator.isObject(valueObject);
		// check each object key-value
		if (isSimpleObject) {
			let result = {};
			const keys = Object.keys(valueObject);
			keys.forEach((key) => {
				const value = this.entityToObj(valueObject[key]);
				result = { ...result, [key]: value };
			});
			return result as any;
		}

		if (isSimpleValue) return valueObject as AutoMapperSerializer<Props>;

		// At this point, treat it as a potential value object with props
		const voProps = valueObject?.['props'];

		const isSimpleProp = this.validator.isBoolean(voProps) ||
			this.validator.isNumber(voProps) ||
			this.validator.isString(voProps) ||
			this.validator.isDate(voProps);

		if (isSimpleProp) return voProps;

		if (this.validator.isSymbol(voProps)) {
			return (voProps as unknown as Symbol).description as any;
		}

		if (this.validator.isArray(valueObject)) {
			const result = Object.keys(valueObject).map((key) => {
				return this.valueObjectToObj(valueObject[key])
			});
			return result as any;
		}

		// If voProps is an object, recursively convert each property
		if (this.validator.isObject(voProps)) {

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
				if (this.validator.isSymbol(voProps?.[key])) return (voProps?.[key] as Symbol)?.description;

				const isID = this.validator.isID(voProps?.[key]);
				if (isID) return (voProps?.[key] as ID<string>).value();

				const isArray = this.validator.isArray(voProps?.[key]);
				if (isArray) {
					const arr: Array<any> = voProps?.[key] as Array<any>;
					const results: Array<any> = [];
					arr.forEach((data) => {
						const result = this.valueObjectToObj(data);
						results.push(result);
					});
					return results;
				}
			});

			// If props are array-like, return as an array of values; otherwise, rebuild as an object
			if (this.validator.isArray(voProps)) return values as any;

			let props = {} as { [key in keyof Props]: any };
			values.forEach((value, i) => {
				props = Object.assign({}, { ...props }, { [keys[i]]: value });
			});

			return props as any;
		}
		return this.entityToObj(voProps);
	}

	/**
	 * @description Transforms an entity into a plain object, including its associated meta properties 
	 * (`id`, `createdAt`, `updatedAt`). This method:
	 * - Resolves IDs to their primitive value forms.
	 * - Recursively converts nested entities, aggregates, and value objects to plain objects.
	 * - Preserves arrays and transforms their elements as needed.
	 * @param entity The entity instance to be transformed into a plain object.
	 * @returns A plain object representing the entity, including its metadata and serialized properties.
	 */
	entityToObj(entity: _Entity<Props>): AutoMapperSerializer<Props> & EntityMapperPayload {
		if (this.validator.isID(entity)) return (entity as any)?.value();
		if (this.validator.isSymbol(entity)) return (entity as unknown as Symbol)?.description as any;

		let result = {} as { [key in keyof Props]: any };

		const isEntity = this.validator.isEntity(entity);
		const isAggregate = this.validator.isAggregate(entity);
		const props = entity?.['props'] ?? {};
		const isValueObject = this.validator.isValueObject(entity);

		// If it's a value object return calling conversion
		if (isValueObject) return this.valueObjectToObj(entity as any) as any;

		const isSimpleValue = this.validator.isBoolean(entity) ||
			this.validator.isNumber(entity) ||
			this.validator.isString(entity) ||
			this.validator.isDate(entity) ||
			entity === null;

		// If it's a simple value or a value object, directly convert
		if (isSimpleValue) return entity as any;

		const isSimpleObject = this.validator.isObject(entity);
		// check each object key-value
		if (isSimpleObject) {
			let result = {};
			const keys = Object.keys(entity);
			keys.forEach((key) => {
				const value = this.entityToObj(entity[key]);
				result = { ...result, [key]: value };
			});
			return result as any;
		}

		if (this.validator.isArray(entity)) {

			const result = Object.keys(entity).map((key) => {
				return this.valueObjectToObj(entity[key])
			});
			return result as any;
		}

		// If it's an entity or an aggregate, extract meta properties and iterate over its props
		if (isEntity || isAggregate) {
			const id = entity?.id?.value();
			const createdAt = entity['props']['createdAt'];
			const updatedAt = entity['props']['updatedAt'];

			result = Object.assign({}, { ...result }, { id, createdAt, updatedAt });

			const keys: Array<keyof Props> = Object.keys(props) as Array<keyof Props>;
			keys.forEach((key) => {
				const value = props[key as any];
				const isArray = this.validator.isArray(value);

				// Handle IDs
				if (this.validator.isID(value)) {
					result = Object.assign({}, { ...result }, { [key]: value?.value() });
				}

				// Handle arrays
				if (isArray) {
					const arr: Array<any> = value as Array<any> ?? [];
					const subProps = arr.map((item) => this.entityToObj(item as any));
					result = Object.assign({}, { ...result }, { [key]: subProps });
				}

				// Check if it's simple or a nested entity/value object
				const isSimple = this.validator.isValueObject(value) ||
					this.validator.isBoolean(value) ||
					this.validator.isNumber(value) ||
					this.validator.isString(value) ||
					this.validator.isObject(value) ||
					this.validator.isDate(value) ||
					value === null;

				const isEntity = this.validator.isEntity(value);

				if (isEntity) {
					const data = this.entityToObj(value as any);
					result = Object.assign({}, { ...result }, { [key]: data });
				} else if (isSimple) {
					const data = this.valueObjectToObj(value as any);
					result = Object.assign({}, { ...result }, { [key]: data });
				} else if (this.validator.isSymbol(props)) {
					const description = (props as Symbol)?.description ?? '';
					result = { ...result, [key]: description }
				}
			});
		}

		return result as any;
	}
}

export default AutoMapper;
