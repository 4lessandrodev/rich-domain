import { IDomainEvent, IHandle } from "../types";

/**
 * @description Domain Event with state.
 */
 export class DomainEvent<T> implements IDomainEvent<T> {
	public aggregate!: T;
	public createdAt!: Date;
	public callback: IHandle<T>;
	constructor(aggregate: T, callback: IHandle<T>){
		this.aggregate = aggregate;
		this.createdAt = new Date();
		this.callback = callback;
	}
}

export default DomainEvent;
