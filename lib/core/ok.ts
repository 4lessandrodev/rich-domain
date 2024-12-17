import { _Result } from "../types";
import Result from "./result";

/**
 * @description Creates a `Result` instance representing a success state.
 * 
 * The `Ok` function returns a result indicating that an operation has succeeded.
 * Optionally, it can include a payload (`data`) representing the successful result
 * and additional metadata (`metaData`) providing context or supplementary information.
 * 
 * @typeParam P - The payload type. Defaults to `void` if not provided.
 * @typeParam E - The error type. Defaults to `string`.
 * @typeParam M - The metadata type. Defaults to an empty object `{}`.
 * 
 * @param data An optional payload that represents the successful operation's result.
 * If no data is provided, defaults to `null` if `P` is `void`.
 * @param metaData Optional metadata providing additional context about the success.
 * 
 * @returns A `Result` instance in a success state with the given payload and metadata.
 */
 function Ok(): Result<void, string, {}>;

/**
 * @description Creates a `Result` instance representing a success state.
 * 
 * The `Ok` function returns a result indicating that an operation has succeeded.
 * Optionally, it can include a payload (`data`) representing the successful result
 * and additional metadata (`metaData`) providing context or supplementary information.
 * 
 * @typeParam P - The payload type. Defaults to `void` if not provided.
 * @typeParam E - The error type. Defaults to `string`.
 * @typeParam M - The metadata type. Defaults to an empty object `{}`.
 * 
 * @param data An optional payload that represents the successful operation's result.
 * If no data is provided, defaults to `null` if `P` is `void`.
 * @param metaData Optional metadata providing additional context about the success.
 * 
 * @returns A `Result` instance in a success state with the given payload and metadata.
 */
function Ok(): _Result<void, string, {}>;

/**
 * @description Creates a `Result` instance representing a success state.
 * 
 * The `Ok` function returns a result indicating that an operation has succeeded.
 * Optionally, it can include a payload (`data`) representing the successful result
 * and additional metadata (`metaData`) providing context or supplementary information.
 * 
 * @typeParam P - The payload type. Defaults to `void` if not provided.
 * @typeParam E - The error type. Defaults to `string`.
 * @typeParam M - The metadata type. Defaults to an empty object `{}`.
 * 
 * @param data An optional payload that represents the successful operation's result.
 * If no data is provided, defaults to `null` if `P` is `void`.
 * @param metaData Optional metadata providing additional context about the success.
 * 
 * @returns A `Result` instance in a success state with the given payload and metadata.
 */
function Ok<P, M extends {} = {}, E = string>(data: P extends void ? null : P, metaData?: M): Result<P, E, M>;

/**
 * @description Creates a `Result` instance representing a success state.
 * 
 * The `Ok` function returns a result indicating that an operation has succeeded.
 * Optionally, it can include a payload (`data`) representing the successful result
 * and additional metadata (`metaData`) providing context or supplementary information.
 * 
 * @typeParam P - The payload type. Defaults to `void` if not provided.
 * @typeParam E - The error type. Defaults to `string`.
 * @typeParam M - The metadata type. Defaults to an empty object `{}`.
 * 
 * @param data An optional payload that represents the successful operation's result.
 * If no data is provided, defaults to `null` if `P` is `void`.
 * @param metaData Optional metadata providing additional context about the success.
 * 
 * @returns A `Result` instance in a success state with the given payload and metadata.
 */
 function Ok<P, M extends {} = {}, E = string>(data: P extends void ? null : P, metaData?: M): _Result<P, E, M>;

/**
 * @description Creates a `Result` instance representing a success state.
 * 
 * The `Ok` function returns a result indicating that an operation has succeeded.
 * Optionally, it can include a payload (`data`) representing the successful result
 * and additional metadata (`metaData`) providing context or supplementary information.
 * 
 * @typeParam P - The payload type. Defaults to `void` if not provided.
 * @typeParam E - The error type. Defaults to `string`.
 * @typeParam M - The metadata type. Defaults to an empty object `{}`.
 * 
 * @param data An optional payload that represents the successful operation's result.
 * If no data is provided, defaults to `null` if `P` is `void`.
 * @param metaData Optional metadata providing additional context about the success.
 * 
 * @returns A `Result` instance in a success state with the given payload and metadata.
 */
function Ok<P, M extends {} = {}, E = string>(data?: P extends void ? null : P, metaData?: M): _Result<P, E, M> {
	return Result.Ok(data as P, metaData);
}

export default Ok;
export { Ok };
