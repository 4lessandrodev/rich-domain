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
export const Fail = <E = string, M extends {} = {}, P = void>(error: E extends void ? null : E, metaData?: M): IResult<P, E, M> => {
	return Result.fail(error ?? 'void error' as E, metaData);
}

export default Fail;
