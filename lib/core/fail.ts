import { _Result } from "../types";
import Result from "./result";

/**
 * @description Creates a `Result` instance representing a failure state.
 * 
 * The `Fail` function returns a result indicating that an operation has failed,
 * and can optionally include an error message and additional metadata.
 * 
 * @typeParam E - The error type. Defaults to `string`.
 * @typeParam M - The metadata type. Defaults to an empty object `{}`.
 * 
 * @param error The error information. If not provided, defaults to a generic error message.
 * @param metaData Optional metadata providing additional context about the error.
 * 
 * @returns A `Result` instance with error payload or (`null`) and an error state. The `error` and `metaData` 
 * types are inferred from the provided arguments.
 */
 function Fail(): Result<string, string, {}>;

/**
 * @description Creates a `Result` instance representing a failure state.
 * 
 * The `Fail` function returns a result indicating that an operation has failed,
 * and can optionally include an error message and additional metadata.
 * 
 * @typeParam E - The error type. Defaults to `string`.
 * @typeParam M - The metadata type. Defaults to an empty object `{}`.
 * 
 * @param error The error information. If not provided, defaults to a generic error message.
 * @param metaData Optional metadata providing additional context about the error.
 * 
 * @returns A `Result` instance with error payload or (`null`) and an error state. The `error` and `metaData` 
 * types are inferred from the provided arguments.
 */
function Fail(): _Result<string, string, {}>;

/**
 * @description Creates a `Result` instance representing a failure state.
 * 
 * The `Fail` function returns a result indicating that an operation has failed,
 * and can optionally include an error message and additional metadata.
 * 
 * @typeParam E - The error type. Defaults to `string`.
 * @typeParam M - The metadata type. Defaults to an empty object `{}`.
 * 
 * @param error The error information. If not provided, defaults to a generic error message.
 * @param metaData Optional metadata providing additional context about the error.
 * 
 * @returns A `Result` instance with error payload or (`null`) and an error state. The `error` and `metaData` 
 * types are inferred from the provided arguments.
 */
 function Fail<E, M extends {} = {}, P = void>(error: E extends void ? null : E, metaData?: M): Result<P, E extends void ? string : E, M>;


/**
 * @description Creates a `Result` instance representing a failure state.
 * 
 * The `Fail` function returns a result indicating that an operation has failed,
 * and can optionally include an error message and additional metadata.
 * 
 * @typeParam E - The error type. Defaults to `string`.
 * @typeParam M - The metadata type. Defaults to an empty object `{}`.
 * 
 * @param error The error information. If not provided, defaults to a generic error message.
 * @param metaData Optional metadata providing additional context about the error.
 * 
 * @returns A `Result` instance with error payload or (`null`) and an error state. The `error` and `metaData` 
 * types are inferred from the provided arguments.
 */
function Fail<E, M extends {} = {}, P = void>(error: E extends void ? null : E, metaData?: M): _Result<P, E extends void ? string : E, M>;

/**
 * @description Creates a `Result` instance representing a failure state.
 * 
 * The `Fail` function returns a result indicating that an operation has failed,
 * and can optionally include an error message and additional metadata.
 * 
 * @typeParam E - The error type. Defaults to `string`.
 * @typeParam M - The metadata type. Defaults to an empty object `{}`.
 * 
 * @param error The error information. If not provided, defaults to a generic error message.
 * @param metaData Optional metadata providing additional context about the error.
 * 
 * @returns A `Result` instance with error payload or (`null`) and an error state. The `error` and `metaData` 
 * types are inferred from the provided arguments.
 */
function Fail<E = string, M extends {} = {}, P = void>(error?: E extends void ? null : E, metaData?: M): _Result<P, E extends void ? string : E, M> {
	const _error = (typeof error !== 'undefined' && error !== null) ? error : 'void error. no message!';
	return Result.fail(_error as any, metaData);
}

export default Fail;
export { Fail };
