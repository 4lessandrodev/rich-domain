import { EntityProps, EventHandler, EventMetrics, IAggregate, IDomainEvent, IHandle, IReplaceOptions, IResult, ISettings, UID } from "../types";
import DomainEvent from "./domain-event";
import Entity from "./entity";
import ID from "./id";
import Result from "./result";

/**
 * @description Aggregate identified by an id
 */
export class Aggregate<Props extends EntityProps> extends Entity<Props> implements IAggregate<Props> {
	private _domainEvents: Array<IDomainEvent<IAggregate<Props>>>;
	private _dispatchEventsAmount: number;

	constructor(props: Props, config?: ISettings, events?: Array<IDomainEvent<IAggregate<Props>>>) {
		super(props, config);
		this._dispatchEventsAmount = 0;
		this._domainEvents = Array.isArray(events) ? events : [];
	}

	/**
	 * @description Get hash to identify the aggregate.
	 * @returns Aggregate hash as ID instance.
	 * @example 
	 * `[Aggregate@ClassName]:UUID`
	 * 
	 * @summary className is defined on constructor config param
	 */
	public hashCode(): UID<string> {
		const name = Reflect.getPrototypeOf(this);
		return ID.create(`[Aggregate@${name?.constructor.name}]:${this.id.value()}`);
	}

	/**
	 * @description Get aggregate metrics
	 * @access current events as number representing total of events in state for aggregate
	 * @access total as number representing total events for aggregate including dispatched
	 * @access dispatch total of events already dispatched
	 */
	get eventsMetrics(): EventMetrics {
		return {
			current: this._domainEvents.length,
			total: this._domainEvents.length + this._dispatchEventsAmount,
			dispatch: this._dispatchEventsAmount
		}
	}

	/**
	 * @description Get a new instanced based on current Aggregate.
	 * @summary if not provide an id a new one will be generated.
	 * @param props as optional Aggregate Props.
	 * @param copyEvents as boolean. default: false.
	 * @returns new Aggregate instance.
	 */
	clone(props?: Partial<Props> & { copyEvents?: boolean }): this {
		const _props = props ? { ...this.props, ...props } : this.props;
		const _events = (props && !!props.copyEvents) ? this._domainEvents : [];
		const instance = Reflect.getPrototypeOf(this);
		const args = [_props, this.config, _events];
		const aggregate = Reflect.construct(instance!.constructor, args);
		return aggregate;
	}

	/**
	 * @description Dispatch event added to aggregate instance
	 * @param eventName optional event name as string. If provided only event match name is called.
	 * @returns Promise void as executed event
	 */
	dispatchEvent(eventName?: string, handler?: EventHandler<IAggregate<any>, void>): void {
		if (!eventName) return this.dispatchAll(handler);

		const callback = handler || ({ execute: (): void => { } });
		for (const event of this._domainEvents) {
			if (event.aggregate.id.equal(this.id) && event.callback.eventName === eventName) {
				this._dispatchEventsAmount++;
				event.callback.dispatch(event, callback);
				this.deleteEvent(eventName!);
			}
		}
	}

	/**
	 * @description Dispatch all events for current aggregate.
	 * @param handler as EventHandler.
	 * @returns promise void.
	 */
	dispatchAll(handler?: EventHandler<this, void>) {
		const callback = handler || ({ execute: (): void => { } });
		for (const event of this._domainEvents) {
			if (event.aggregate.id.equal(this.id)) {
				this._dispatchEventsAmount++;
				event.callback.dispatch(event, callback);
			}
		}
		this._domainEvents = [];
	};

	/**
	 * @description Delete all events in current aggregate instance.
	 * @param config.resetMetrics reset info about events dispatched.
	 * @returns void.
	 */
	clearEvents(config = { resetMetrics: false }): void {
		this._dispatchEventsAmount = config.resetMetrics ? 0 : this._dispatchEventsAmount;
		this._domainEvents = [];
	};

	/**
	 * @description Add event to aggregate instance.
	 * @param eventToAdd Event to be dispatched.
	 * @param replace 'REPLACE_DUPLICATED' option to remove old event with the same name and id.
	 * @emits dispatch to aggregate instance. Do not use event using global event manager as DomainEvent.dispatch
	 */
	addEvent(eventToAdd: IHandle<this>, replace?: IReplaceOptions): void {
		const doReplace = replace === 'REPLACE_DUPLICATED';
		const event = new DomainEvent(this, eventToAdd);
		const target = Reflect.getPrototypeOf(event.callback);
		const eventName = event.callback?.eventName ?? target?.constructor.name as string;
		event.callback.eventName = eventName;
		if (!!doReplace) this.deleteEvent(eventName);
		this._domainEvents.push(event);
	}

	/**
	 * @description Delete event match with provided name
	 * @param eventName event name as string
	 * @returns number of deleted events
	 */
	deleteEvent(eventName: string): number {
		let deletedEventsAmount = this._domainEvents.length;

		this._domainEvents = this._domainEvents.filter(
			domainEvent => (domainEvent.callback.eventName !== eventName)
		);

		return deletedEventsAmount - this._domainEvents.length;
	}

	public static create(props: any): IResult<any, any, any>;
	/**
	 * 
	 * @param props params as Props
	 * @param id optional uuid as string, second arg. If not provided a new one will be generated.
	 * @returns instance of result with a new Aggregate on state if success.
	 * @summary result state will be `null` case failure.
	 */
	public static create(props: {}): Result<any, any, any> {
		if (!this.isValidProps(props)) return Result.fail('Invalid props to create an instance of ' + this.name);
		return Result.Ok(new this(props));
	};
}
export default Aggregate;
