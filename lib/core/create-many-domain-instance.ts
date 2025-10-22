import { IClass, CreateManyDomain, CreateManyResult, _ManyData } from "../types";
import validator from "../utils/validator";
import Iterator from "./iterator";

/**
 * @description Helper function to create a data structure for constructing domain instances.
 * Use this function to pair a domain class with its corresponding properties 
 * before calling `createManyDomainInstances`.
 * 
 * @param domainClass The domain class that implements a static `create` method.
 * @param props The properties needed to create an instance of `domainClass`.
 * @returns An `_ManyData` object containing the class and props to be used by `createManyDomainInstances`.
 */
export const Class = <Props>(domainClass: IClass, props: Props): _ManyData => {
	return {
		class: domainClass,
		props
	}
}

/**
 * @description Creates multiple domain instances at once from an array of class-property pairs.
 * Each element in the input data should contain a domain class and the props required to create an instance of it.
 * 
 * - If the domain class does not have a static `create` method, a failure result is returned for that class.
 * - Otherwise, `createManyDomainInstances` attempts to create each instance, collecting the results.
 * 
 * @param data An array of objects, each containing a domain class and properties for instance creation.
 * @returns A `CreateManyResult` object containing:
 *  - `data`: An iterator over the results of each instance creation attempt.
 *  - `result`: A combined `Promise` indicating if all instances were created successfully or if any failed.
 * 
 * @example
 * ```typescript
 * const classes = [
 *   Class(User, { name: "Alice", age: 30 }),
 *   Class(Product, { title: "Book", price: 9.99 }),
 *   Class(Order, { userId: "some-user-id", items: [] })
 * ];
 * 
 * const { data, result } = createManyDomainInstances(classes);
 * result.then(res => {
 *   if(res) {
 *     const userResult = data.next();
 *     const productResult = data.next();
 *     const orderResult = data.next();
 *   }
 * })
 * 
 * ```
 */
export const createManyDomainInstances = (data: CreateManyDomain): CreateManyResult => {

	const promises: Array<Promise<any | null>> = [];

	if (validator.isArray(data) && data.length > 0) {
		for (let index = 0; index < data.length; index++) {
			const domainInfo = data[index];
			const domainClass = domainInfo.class;
			const existsCreateMethod = typeof domainClass?.create === 'function';

			if (!existsCreateMethod) {
				console.log(`No static 'create' method found in class ${domainClass?.name}.`);
				promises.push(Promise.resolve(null));
				continue;
			}

			const payload = domainClass.create(domainInfo.props);
			promises.push(payload);
		}
	} else {
        const iterator = Iterator.create({ initialData: [], returnCurrentOnReversion: true });
        return { data: iterator, result: Promise.resolve(null) };
    }

	const iterator = Iterator.create({ initialData: promises, returnCurrentOnReversion: true });
	
	const combinedPromise = Promise.all(promises).then(results => {
		const failed = results.some(r => r === null);
		if(failed) return null;
		return results;
	});

	return { data: iterator, result: combinedPromise };
}

export default createManyDomainInstances;