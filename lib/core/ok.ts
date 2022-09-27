import { IResult } from "../types";
import Result from "./result";

/**
 * @description Create an instance of Result as success state.
 * @param data generic type P
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
function Ok(): IResult<void, string, {}>;

/**
 * @description Create an instance of Result as success state.
 * @param data generic type P
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
function Ok<P, M extends {} = {}, E = string>(data: P extends void ? null : P, metaData?: M): IResult<P, E, M>;

/**
 * @description Create an instance of Result as success state.
 * @param data generic type P
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
function Ok<P, M extends {} = {}, E = string>(data?: P extends void ? null : P, metaData?: M): IResult<P, E, M> {
	return Result.Ok(data as P, metaData);
}

export default Ok;
export { Ok };
