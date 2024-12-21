import { ICommand, _Iterator, _Result, ResultExecute, ResultHook, ResultObject, IResultOptions } from "../types";
import Iterator from "./iterator";

/**
 * @description The `Result` class represents the outcome of an operation, encapsulating both the success or failure state.
 * A `Result` instance can contain a payload (`data`), an error, and optional metadata for additional context.
 * This pattern encourages explicit handling of operation success or failure, making your code more robust and expressive.
 * 
 * @typeParam T - The type of the payload when the result is successful.
 * @typeParam D - The type of the error when the result is a failure. Defaults to `string`.
 * @typeParam M - The type of the metadata object. Defaults to an empty object `{}`.
 * 
 * @example
 * ```typescript
 * // Creating a success result with data
 * const successResult = Result.Ok({ name: "Alice" });
 * if (successResult.isOk()) {
 *   console.log("Success data:", successResult.value());
 * }
 * 
 * // Creating a failure result with a custom error message
 * const failResult = Result.fail("An error occurred");
 * if (failResult.isFail()) {
 *   console.error("Error:", failResult.error());
 * }
 * ```
 */
export class Result<T = void, D = string, M = {}> implements _Result<T, D, M> {

	#isOk: Readonly<boolean>;
	#isFail: Readonly<boolean>;
	#data: Readonly<T | null>;
	#error: Readonly<D | null>;
	#metaData: Readonly<M>;

	private constructor(isSuccess: boolean, data?: T, error?: D, metaData?: M) {
		this.#isOk = isSuccess;
		this.#isFail = !isSuccess;
		this.#data = data ?? null;
		this.#error = error ?? null;
		this.#metaData = metaData ?? {} as M;
	}

	/**
	 * @description Creates a success `Result` instance, optionally containing data and metadata.
	 * 
	 * @returns A `Result` instance representing success.
	 */
	public static Ok(): Result<void>;
	public static Ok(): _Result<void>;
	public static Ok<T, M = {}, D = string>(data: T, metaData?: M): Result<T, D, M>;
	public static Ok<T, M = {}, D = string>(data: T, metaData?: M): _Result<T, D, M>;
	public static Ok<T, M = {}, D = string>(data?: T, metaData?: M): _Result<T, D, M> {
		const _data = typeof data === 'undefined' ? null : data;
		const ok = new Result(true, _data, null, metaData) as unknown as _Result<T, D, M>;
		return Object.freeze(ok) as _Result<T, D, M>;
	}

	/**
	 * @description Creates a failure `Result` instance, optionally containing an error and metadata.
	 * 
	 * @returns A `Result` instance representing failure.
	 */
	public static fail<D = string, M = {}, P = void>(error?: D, metaData?: M): Result<P, D, M>;
	public static fail<D = string, M = {}, T = void>(error?: D, metaData?: M): _Result<T, D, M> {
		const _error = (typeof error !== 'undefined' && error !== null) ? error : 'void error. no message!';
		const fail = new Result(false, null, _error, metaData) as unknown as _Result<T, D, M>;
		return Object.freeze(fail) as _Result<T, D, M>;
	}

	/**
	 * @description Creates an iterator over a collection of `Result` instances. This allows sequential processing of multiple results.
	 * @param results An array of `Result` instances.
	 * @returns An iterator over the provided results.
	 */
	public static iterate<A, B, M>(results?: Array<_Result<A, B, M>>): _Iterator<_Result<A, B, M>> {
		return Iterator.create<_Result<A, B, M>>({ initialData: results, returnCurrentOnReversion: true });
	}

	/**
	 * @description Combines multiple `Result` instances into a single `Result`. 
	 * If any of the provided results is a failure, the combined `Result` is a failure.
	 * If all results are successful, the combined `Result` is considered a success.
	 * 
	 * @param results An array of `Result` instances to combine.
	 * @returns A `Result` instance representing the combined outcome.
	 */
	public static combine<A = any, B = any, M = any>(results: Array<_Result<any, any, any>>): _Result<A, B, M> {
		const iterator = Result.iterate(results);
		if (iterator.isEmpty()) return Result.fail('No results provided on combine param' as B) as unknown as _Result<A, B, M>;
		while (iterator.hasNext()) {
			const currentResult = iterator.next();
			if (currentResult.isFail()) return currentResult as _Result<A, B, M>;
		}
		return iterator.first() as _Result<A, B, M>;
	}

	/**
	 * @description Executes a command based on the result state. You can specify whether the command executes on success, failure, or both.
	 * Optionally, you can provide data to the command if required.
	 * 
	 * @param command An object implementing `ICommand` interface.
	 * @returns An object with methods to configure command execution based on the `Result` state.
	 */
	execute<X, Y>(command: ICommand<X | void, Y>): ResultExecute<X, Y> {
		return {
			on: (option: IResultOptions): Y | undefined => {
				if (option === 'Ok' && this.isOk()) return command.execute();
				if (option === 'fail' && this.isFail()) return command.execute();
			},
			withData: (data: X): ResultHook<Y> => {
				return {
					on: (option: IResultOptions): Y | undefined => {
						if (option === 'Ok' && this.isOk()) return command.execute(data);
						if (option === 'fail' && this.isFail()) return command.execute(data);
					}
				}
			}
		};
	}

	/**
	 * @description Retrieves the payload of the `Result`. If the `Result` is a failure, `value()` returns `null`.
	 * @returns The payload `T` or `null` if the result is a failure.
	 */
	value(): T {
		return this.#data as T;
	}

	/**
	 * @description Retrieves the error of the `Result`. If the `Result` is a success, `error()` returns `null`.
	 * @returns The error `D` or `null` if the result is a success.
	 */
	error(): D {
		return this.#error as D;
	}

	/**
	 * @description Determines if the `Result` represents a failure state.
	 * @returns `true` if the result is a failure, `false` if it is a success.
	 */
	isFail(): boolean {
		return this.#isFail;
	}

	/**
	 * @description Checks if the `Result` payload is `null`. 
	 * This can be useful for confirming the presence or absence of a value before proceeding.
	 * @returns `true` if the payload is `null`, `false` otherwise.
	 */
	isNull(): boolean {
		return this.#data === null || this.#isFail;
	}

	/**
	 * @description Determines if the `Result` represents a success state.
	 * @returns `true` if the result is a success, `false` if it is a failure.
	 */
	isOk(): boolean {
		return this.#isOk;
	}

	/**
	 * @description Retrieves the metadata associated with the `Result`.
	 * @returns The metadata object `M`, or `{}` if no metadata was provided.
	 */
	metaData(): M {
		const metaData = this.#metaData;
		return Object.freeze(metaData);
	}

	/**
	 * @description Converts the `Result` instance into a plain object for easier logging or serialization.
	 * @returns An object containing `isOk`, `isFail`, `data`, `error`, and `metaData`.
	 */
	toObject(): ResultObject<T, D, M> {
		const metaData = {
			isOk: this.#isOk,
			isFail: this.#isFail,
			data: this.#data as T | null,
			error: this.#error as D | null,
			metaData: this.#metaData as M
		}

		return Object.freeze(metaData);
	}
}

export default Result;
export const Combine = Result.combine;
