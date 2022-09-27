import { ICommand, IIterator, IResult, IResultExecute, IResultHook, IResultObject, IResultOptions } from "../types";
import Iterator from "./iterator";


/**
 * @summary The result is used to returns a operation result instead the own value.
 * @interface IResult<T, D, M>;
 * @classdesc on `T` refer to type of the value and `D` type of the error and `M` metaData type.
 * @default D is string.
 * @default M is empty object {}.
 */
export class Result<T = void, D = string, M = {}> implements IResult<T, D, M> {

	private readonly _isSuccess: boolean;
	private readonly _isFailure: boolean;
	private readonly _data: T | null;
	private readonly _error: D | null;
	private readonly _metaData: M;

	private constructor(isSuccess: boolean, data?: T, error?: D, metaData?: M) {
		this._isSuccess = isSuccess;
		this._isFailure = !isSuccess;
		this._data = data ?? null;
		this._error = error ?? null;
		this._metaData = metaData ?? {} as M;
	}

	/**
	 * @description Create an instance of Result as success state.
	 * @returns instance of Result<void>.
	 */
	public static Ok(): Result<void>;
	/**
	 * @description Create an instance of Result as success state with data and metadata to payload.
	 * @param data as T to payload.
	 * @param metaData as M to state.
	 * @returns instance of Result.
	 */
	public static Ok<T, M = {}, D = string>(data: T, metaData?: M): Result<T, D, M>;
	/**
	 * @description Create an instance of Result as success state with data and metadata to payload.
	 * @param data as T to payload.
	 * @param metaData as M to state.
	 * @returns instance of Result.
	 */
	public static Ok<T, M = {}, D = string>(data?: T, metaData?: M): Result<T, D, M> {
		const _data = typeof data === 'undefined' ? null : data;
		return new Result(true, _data, null, metaData) as unknown as Result<T, D, M>;
	}

	/**
	 * @description Create an instance of Result as failure state with error and metadata to payload.
	 * @param error as D to payload.
	 * @param metaData as M to state.
	 * @returns instance of Result.
	 */
	public static fail<D = string, M = {}, T = void>(error?: D, metaData?: M): Result<T, D, M> {
		const _error = typeof error !== 'undefined' && error !== null ? error : 'void error. no message!';
		return new Result(false, null, _error, metaData) as unknown as Result<T, D, M>;
	}
	/**
	 * @description Create an instance of Iterator with array of Results on state.
	 * @param results as array of Results
	 * @returns instance of Iterator.
	 */
	public static iterate<A, B, M>(results?: Array<Result<A, B, M>>): IIterator<Result<A, B, M>> {
		return Iterator.create<Result<A, B, M>>({ initialData: results, returnCurrentOnReversion: true });
	}

	/**
	 * @description Check all results instances status. Returns the first failure or returns the first success one.
	 * @param results arrays with results instance.
	 * @returns instance of result.
	 * @default returns failure if provide a empty array.
	 */
	public static combine<A, B, M>(results: Array<Result<A, B, M>>): Result<A, B, M> {
		const iterator = this.iterate(results);
		if (iterator.isEmpty()) return Result.fail<B, M, A>('No results provided on combine param' as unknown as B);
		while (iterator.hasNext()) {
			const currentResult = iterator.next();
			if (currentResult.isFail()) return currentResult;
		}
		return iterator.first();
	}

	/**
	 * @description Execute any command on fail or success.
	 * @param command instance of command that implements ICommand interface.
	 * @returns Command result as payload.
	 */
	execute<X, Y>(command: ICommand<X | void, Y>): IResultExecute<X, Y> {
		return {
			/**
			 * @description Use this option the command does not require arguments.
			 * @param option `Ok` or `fail`
			 * @returns command payload or undefined.
			 */
			on: (option: IResultOptions): Y | undefined => {
				if (option === 'Ok' && this.isOk()) return command.execute();
				if (option === 'fail' && this.isFail()) return command.execute();
			},
			/**
			 * @description Use this option the command require arguments.
			 * @param data the same type your command require.
			 * @returns on function.
			 */
			withData: (data: X): IResultHook<Y> => {
				return {
					/**
					 * @description Use this option the command does not require arguments.
					 * @param option `Ok` or `fail`
					 * @returns command payload or undefined.
					 */
					on: (option: IResultOptions): Y | undefined => {
						if (option === 'Ok' && this.isOk()) return command.execute(data);
						if (option === 'fail' && this.isFail()) return command.execute(data);
					}
				}
			}
		};
	}

	/**
	 * @description Get the instance value.
	 * @returns `data` T or `null` case result is failure.
	 */
	value(): T {
		return this._data as T;
	}
	/**
	 * @description Get the instance error.
	 * @returns `error` D or `null` case result is success.
	 */
	error(): D {
		return this._error as D;
	}

	/**
	 * @description Check if result instance is failure.
	 * @returns `true` case result instance failure or `false` case is success one.
	 */
	isFail(): boolean {
		return this._isFailure;
	}

	/**
	 * @description Check if result instance is success.
	 * @returns `true` case result instance success or `false` case is failure one.
	 */
	isOk(): boolean {
		return this._isSuccess;
	}

	/**
	 * @description Get the instance metadata.
	 * @returns `metadata` M or `{}` result in case of empty object has no metadata value.
	 */
	metaData(): M {
		return this._metaData;
	}

	/**
	 * @description Get result state as object.
	 * @returns result state.
	 * @example 
	 * {
	 * 	isOk: boolean;
	 * 	isFail: boolean;
	 * 	data: T | null;
	 * 	error: D | null;
	 * 	metaData: M | {};
	 * }
	 */
	toObject(): IResultObject<T, D, M> {
		return {
			isOk: this._isSuccess,
			isFail: this._isFailure,
			data: this._data as T | null,
			error: this._error as D | null,
			metaData: this._metaData as M
		}
	}
}

export default Result;
