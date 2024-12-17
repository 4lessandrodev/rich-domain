import { EventHandler, _Result, Settings, Options, UID } from "../types";
import { EntityProps, EventMetrics, Handler, _Aggregate } from "../types";
import TsEvent from "./events";
import Entity from "./entity";
import ID from "./id";
import Result from "./result";
import Context from "./context";
import { EventManager } from "../types";

/**
 * @description Represents an aggregate identified by a unique ID, extending entity functionalities.
 * It manages domain events internally, facilitates event dispatching, and provides metrics 
 * on event-related operations.
 */
export class Aggregate<Props extends EntityProps> extends Entity<Props> implements _Aggregate<Props> {
	private _domainEvents: TsEvent<this>;
	private _dispatchEventsAmount: number;

	constructor(props: Props, config?: Settings, events?: TsEvent<_Aggregate<Props>>) {
		super(props, config);
		this._dispatchEventsAmount = 0;
		this._domainEvents = new TsEvent(this);
		if (events) this._domainEvents = events as unknown as TsEvent<this>;
	}

	/**
	 * @description Generates a unique hash code for the aggregate, combining the class name and its ID.
	 * Useful for identification in logs or diagnostic information.
	 * @example
	 * `[Aggregate@ClassName]:UUID`
	 * @summary Class name is determined at runtime from the prototype.
	 * @returns A `UID<string>` representing the aggregate's hash code.
	 */
	public hashCode(): UID<string> {
		const name = Reflect.getPrototypeOf(this);
		return ID.create(`[Aggregate@${name?.constructor.name}]:${this.id.value()}`);
	}

	/**
	 * @description Returns the global event manager for the current context, enabling 
	 * the registration (subscribe) and dispatching of events at the application level.
	 * @returns The application's `EventManager` instance.
	 */
	public context(): EventManager {
		return Context.events();
	}

	/**
	 * @description Provides event-related metrics for the aggregate.
	 * @property current - The number of currently stored (undispatched) events.
	 * @property total - The total number of events, including those already dispatched.
	 * @property dispatch - The number of events already dispatched by the aggregate.
	 * @returns An `EventMetrics` object containing event metrics.
	 */
	get eventsMetrics(): EventMetrics {
		return {
			current: this._domainEvents.metrics.totalEvents(),
			total: this._domainEvents.metrics.totalEvents() + this._dispatchEventsAmount,
			dispatch: this._dispatchEventsAmount
		}
	}

	/**
	 * @description Creates a new aggregate instance based on the current one.
	 * Allows overriding some properties. If no `id` is provided in the new properties,
	 * a new one will be generated.
	 * @param props Optional partial properties to override for the new instance.
	 * The `copyEvents` property can be used to copy current events to the new instance.
	 * @returns A new aggregate instance with updated properties.
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
	 * @description Dispatches a specific event from the aggregate, incrementing the count of dispatched events.
	 * @param eventName The name of the event to dispatch.
	 * @param args Additional arguments passed to the event handler.
	 * @returns `void` or `Promise<void>` if the event is asynchronous.
	 */
	dispatchEvent(eventName: string, ...args: any[]): void | Promise<void> {
		this._domainEvents.dispatchEvent(eventName, args);
		this._dispatchEventsAmount++;
	}

	/**
	 * @description Dispatches all currently stored events in the aggregate, marking them as dispatched
	 * and updating the total count of dispatched events.
	 * @returns A Promise that resolves to `void` after all events are dispatched.
	 */
	async dispatchAll(): Promise<void> {
		const current = this._domainEvents.metrics.totalEvents();
		await this._domainEvents.dispatchEvents();
		this._dispatchEventsAmount += current;
	};

	/**
	 * @description Removes all currently stored events in the aggregate.
	 * @param config Optional configuration. If `resetMetrics` is `true`, 
	 * the count of previously dispatched events is reset to zero.
	 * @returns `void`.
	 */
	clearEvents(config = { resetMetrics: false }): void {
		if (config.resetMetrics) this._dispatchEventsAmount = 0;
		this._domainEvents.clearEvents();
	};

	/**
	 * @description Adds a new event to the aggregate.
	 * @param event The event object containing the event name, handler, and options.
	 */
	addEvent(event: EventHandler<this>): void;

	/**
	 * @description Adds a new event to the aggregate.
	 * @param eventName The name of the event.
	 * @param handler The event handler function.
	 * @param options Additional options for the event.
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
	 * @description Removes all events matching the provided event name.
	 * @param eventName The name of the event to remove.
	 * @returns The number of events removed.
	 */
	deleteEvent(eventName: string): number {
		const totalBefore = this._domainEvents.metrics.totalEvents();
		this._domainEvents.removeEvent(eventName);
		return totalBefore - this._domainEvents.metrics.totalEvents();
	}

	public static create(props: any): Result<any, any, any>;
	/**
	 * @description Creates a new aggregate instance wrapped inside a `Result` object.
	 * If the provided properties are invalid, returns a failure `Result`.
	 * 
	 * @param props Properties used to create the aggregate.
	 * @param id (optional) A UUID to assign to the aggregate. If not provided, a new one will be generated.
	 * @returns A `Result` instance containing the new aggregate if successful. On failure, returns a `Result` with null state.
	 * 
	 * @example
	 * ```typescript
	 * const result = MyAggregate.create({ name: "example" });
	 * if (result.isFailure) {
	 *   console.error(result.error); // More explicit error message guiding the user to fix invalid properties
	 * } else {
	 *   const aggregate = result.getValue();
	 *   // Use the aggregate
	 * }
	 * ```
	 * 
	 * @summary On failure, the error message clearly instructs the user to ensure all required properties
	 * are provided and have valid values.
	 */
	public static create(props: {}): Result<any, any, any> {
		if (!this.isValidProps(props)) return Result.fail(
			`Failed to create an instance of ${this.name} due to invalid properties. ` +
			`Please ensure that all required fields are provided and that the values are valid.`
		);
		return Result.Ok(new this(props));
	};
}
export default Aggregate;
