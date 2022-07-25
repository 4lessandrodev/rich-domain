import { EntityProps, IAggregate, IHandle, IReplaceOptions, IResult, ISettings, UID } from "../types";
import DomainEvent from "./domain-event";
import Entity from "./entity";
import DomainEvents from "./events";
import ID from "./id";
import Result from "./result";

/**
 * @description Aggregate identified by an id
 */
 export class Aggregate<Props extends EntityProps> extends Entity<Props> implements IAggregate<Props> {

	constructor(props: Props, config?: ISettings) { 
		super(props, config);
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
	 * @description Add event to aggregate
	 * @param event Event to be dispatched
	 * @param replace 'REPLACE_DUPLICATED' option to remove old event with the same name and id
	 */
	addEvent(event: IHandle<Aggregate<Props>>, replace?: IReplaceOptions): void {
		DomainEvents.addEvent({ event: new DomainEvent(this, event), replace: replace === 'REPLACE_DUPLICATED' })
	}

	deleteEvent(eventName: string): void {
		DomainEvents.deleteEvent({ eventName, id: this.id });
	}

	/**
	 * 
	 * @param props params as Props
	 * @param id optional uuid as string, second arg. If not provided a new one will be generated.
	 * @returns instance of result with a new Aggregate on state if success.
	 * @summary result state will be `null` case failure.
	 */
	public static create(props: any): IResult<Aggregate<any>, any, any> {
		if(!this.isValidProps(props)) return Result.fail('Invalid props to create an instance of ' + this.name);
		return Result.success(new this(props));
	};
}
export default Aggregate;
