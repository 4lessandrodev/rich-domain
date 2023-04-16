import { IClass, ICreateManyDomain, ICreateManyResult, IManyData, IResult, OBJ } from "../types";
import validator from "../utils/validator";
import Iterator from "./iterator";
import Result from "./result";

export const Class = <Props extends OBJ = {}>(domainClass: IClass, props: Props): IManyData => {
	return {
		class: domainClass,
		props
	}
}

export const createManyDomainInstances = (data: ICreateManyDomain): ICreateManyResult => {

	const results: Array<IResult<any, any, any>> = [];

	if (validator.isArray(data)) {
		for (let index = 0; index < data.length; index++) {

			const existsCreateMethod = typeof data[index]?.class?.create === 'function';

			if (!existsCreateMethod) {
				results.push(Result.fail(`there is no static method create in ${data[index].class?.name} class`));
				continue;
			};

			const payload = data[index].class.create(data[index].props);
			results.push(payload);
		}
	}

	const iterator = Iterator.create({ initialData: results, returnCurrentOnReversion: true });
	const result = Result.combine(results);

	return { data: iterator, result };
}

export default createManyDomainInstances;
