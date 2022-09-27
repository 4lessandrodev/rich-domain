import { IResult } from "../types";
import Result from "./result";

/**
 * @description Create an instance of Result as failure state.
 * @param error generic type E
 * @param metaData generic type M
 * @returns instance of Result as failure state
 * 
 * @augments E generic type for error.
 * @default string.
 * 
 * @argument M generic type for metaData.
 * @default Object empty object {}.
 * 
 * @argument P generic type for payload.
 * @default void as no state.
 */
function Fail(): IResult<string, string, {}>;

/**
 * @description Create an instance of Result as failure state.
 * @param error generic type E
 * @param metaData generic type M
 * @returns instance of Result as failure state
 * 
 * @augments E generic type for error.
 * @default string.
 * 
 * @argument M generic type for metaData.
 * @default Object empty object {}.
 * 
 * @argument P generic type for payload.
 * @default void as no state.
 */
function Fail<E, M extends {} = {}, P = void>(error: E extends void ? null : E, metaData?: M): IResult<P, E extends void ? string : E, M>;

/**
 * @description Create an instance of Result as failure state.
 * @param error generic type E
 * @param metaData generic type M
 * @returns instance of Result as failure state
 * 
 * @augments E generic type for error.
 * @default string.
 * 
 * @argument M generic type for metaData.
 * @default Object empty object {}.
 * 
 * @argument P generic type for payload.
 * @default void as no state.
 */
function Fail<E = string, M extends {} = {}, P = void>(error?: E extends void ? null : E, metaData?: M): IResult<P, E extends void ? string : E, M> {
	const _error = (typeof error !== 'undefined' && error !== null) ? error : 'void error. no message!';
	return Result.fail(_error as any, metaData);
}

export default Fail;
export { Fail };
