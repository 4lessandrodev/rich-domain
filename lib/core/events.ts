import { IAggregate, IDispatchOptions, IDomainEvent, IEvent, IIterator } from "../types";
import Iterator from "./iterator";

/**
 * @description Domain Events manager.
 */
 export abstract class DomainEvents {
	public static events: IIterator<IDomainEvent<IAggregate<any>>> = Iterator.create();

	/**
	 * @description Add event to state.
	 * @param param event to be added.
	 */
	public static addEvent({ event, replace }: IEvent<IAggregate<any>>) {
		const target = Reflect.getPrototypeOf(event.callback);
		const eventName = event.callback?.eventName ?? target?.constructor.name as string;
		if (!!replace) this.deleteEvent({ eventName, id: event.aggregate.id });
		event.callback.eventName = eventName;
		DomainEvents.events.addToEnd(event);
	}

	/**
	 * @description Dispatch event for a provided name and an aggregate id.
	 * @param options params to find event to dispatch it.
	 * @returns promise void.
	 */
	public static async dispatch(options: IDispatchOptions): Promise<void> {
		const eventsToDispatch: Array<IDomainEvent<IAggregate<any>>> = [];
		this.events.toFirst();
		while (this.events.hasNext()) {
			const event = this.events.next();
			if (event.aggregate.id.equal(options.id) && event.callback.eventName === options.eventName) {
				this.events.toFirst();
				eventsToDispatch.push(event);
				this.events.removeItem(event);
			}
		}
		eventsToDispatch.forEach((agg) => agg.callback.dispatch(agg));
	}

	/**
	 * @description Delete an event from state.
	 * @param options to find event to be deleted.
	 */
	public static deleteEvent(options: IDispatchOptions): void {
		this.events.toFirst();
		while (this.events.hasNext()) {
			const event = this.events.next();
			const target = Reflect.getPrototypeOf(event.callback);
			const eventName = event.callback?.eventName ?? target?.constructor.name;
			
			if (event.aggregate.id.equal(options.id) && options.eventName === eventName) {
				this.events.toFirst();
				this.events.removeItem(event);
			}
		}
	}
}

export default DomainEvents;
