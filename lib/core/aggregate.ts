import { EventHandler, IResult, ISettings, Options, UID } from "../types";
import { EntityProps, EventMetrics, Handler, IAggregate } from "../types";
import TsEvent from "./events";
import Entity from "./entity";
import ID from "./id";
import Result from "./result";
import Context from "./context";
import { EventManager } from "../types";

/**
 * @description Aggregate identified by an id
 */
export class Aggregate<Props extends EntityProps> extends Entity<Props> implements IAggregate<Props> {
	private _domainEvents: TsEvent<this>;
	private _dispatchEventsAmount: number;

	constructor(props: Props, config?: ISettings, events?: TsEvent<IAggregate<Props>>) {
		super(props, config);
		this._dispatchEventsAmount = 0;
		this._domainEvents = new TsEvent(this);
		if (events) this._domainEvents = events as unknown as TsEvent<this>;
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
	 * @description Manager Contexts Events
	 * @returns Event Manger to subscribe or dispatch global events
	 */
	public context(): EventManager {
		return Context.events();
	}

	/**
	 * @description Get aggregate metrics
	 * @access current events as number representing total of events in state for aggregate
	 * @access total as number representing total events for aggregate including dispatched
	 * @access dispatch total of events already dispatched
	 */
	get eventsMetrics(): EventMetrics {
		return {
			current: this._domainEvents.metrics.totalEvents(),
			total: this._domainEvents.metrics.totalEvents() + this._dispatchEventsAmount,
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
		const _props = props ? { ...this.props, ...props } : { ...this.props };
		const _events = (props && !!props.copyEvents) ? this._domainEvents : null;
		const instance = Reflect.getPrototypeOf(this);
		const args = [_props, this.config, _events];
		const aggregate = Reflect.construct(instance!.constructor, args);
		return aggregate;
	}

	/**
	 * @description Dispatch event added to aggregate instance
	 * @param eventName optional event name as string.
	 * @returns Promise void as executed event
	 */
	dispatchEvent(eventName: string, ...args: any[]): void | Promise<void> {
		this._domainEvents.dispatchEvent(eventName, args);
		this._dispatchEventsAmount++;
	}

	/**
	 * @description Dispatch all events for current aggregate.
	 * @param handler as EventHandler.
	 * @returns promise void.
	 */
	async dispatchAll(): Promise<void> {
		const current = this._domainEvents.metrics.totalEvents();
		await this._domainEvents.dispatchEvents();
		this._dispatchEventsAmount = this._dispatchEventsAmount + current;
	};

	/**
	 * @description Delete all events in current aggregate instance.
	 * @param config.resetMetrics reset info about events dispatched.
	 * @returns void.
	 */
	clearEvents(config = { resetMetrics: false }): void {
		if (config.resetMetrics) this._dispatchEventsAmount = 0;
		this._domainEvents.clearEvents();
	};

	/**
	 * Adds a new event.
	 * @param event - The event object containing the event name, handler, and options.
	 */
	addEvent(event: EventHandler<this>): void;

	/**
	 * Adds a new event.
	 * @param eventName - The name of the event.
	 * @param handler - The event handler function.
	 * @param options - The options for the event.
	 */
	addEvent(eventName: string, handler: Handler<this>, options?: Options): void;

	addEvent(eventNameOrEvent: string | EventHandler<this>, handler?: Handler<this>, options?: Options): void {
		if (typeof eventNameOrEvent === 'string' && handler) {
			this._domainEvents.addEvent(eventNameOrEvent, handler! ?? null, options);
			return;
		}
		const _options = (eventNameOrEvent as EventHandler<this>)?.params?.options;
		const eventName = (eventNameOrEvent as EventHandler<this>)?.params?.eventName;
		const eventHandler = (eventNameOrEvent as EventHandler<this>)?.dispatch;
		this._domainEvents.addEvent(eventName, eventHandler! ?? null, _options);
	}
	/**
	 * @description Delete event match with provided name
	 * @param eventName event name as string
	 * @returns number of deleted events
	 */
	deleteEvent(eventName: string): number {
		const totalBefore = this._domainEvents.metrics.totalEvents();
		this._domainEvents.removeEvent(eventName);
		return totalBefore - this._domainEvents.metrics.totalEvents();
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
