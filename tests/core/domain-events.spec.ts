import { Aggregate, DomainEvent, DomainEvents } from '../../lib/core';
import { EventHandler, IDomainEvent, IHandle } from '../../lib/types';

describe('domain-events', () => {

	interface Props {
		id?: string;
		name: string;
	}

	class User extends Aggregate<Props>{
		private constructor(props: Props) {
			super(props)
		}
	}

	class Handle implements IHandle<User> {
		eventName: string = 'Handler';
		dispatch(event: IDomainEvent<User>, handler: EventHandler<User, void>): void | Promise<void> {
			console.log(event.aggregate.hashCode().value());
			const { aggregate } = event;
			const eventName = this.eventName;
			handler.execute({ aggregate, eventName });
		}	
	}

	const user = User.create({ name: 'Jane' }).value();

	const event = new DomainEvent<User>(user, new Handle());

	it('should add domain event with success', () => {

		DomainEvents.addEvent({ event, replace: true });

		DomainEvents.addEvent({ event, replace: true });

		expect(DomainEvents.events.total()).toBe(1);

		DomainEvents.dispatch({ eventName: 'Handler', id: user.id });

		expect(DomainEvents.events.total()).toBe(0);
	});

	it('should add domain and do not replace event with success', () => {

		DomainEvents.addEvent({ event, replace: false });

		DomainEvents.addEvent({ event, replace: false });

		expect(DomainEvents.events.total()).toBe(2);

		DomainEvents.dispatch({ eventName: 'Handler', id: user.id });

		expect(DomainEvents.events.total()).toBe(0);
	});

	it('should dispatch all by id', () => {

		DomainEvents.addEvent({ event, replace: false });

		DomainEvents.addEvent({ event, replace: false });

		expect(DomainEvents.events.total()).toBe(2);

		DomainEvents.dispatchAll(user.id);

		expect(DomainEvents.events.total()).toBe(0);
	});
});
