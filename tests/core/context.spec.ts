import { Aggregate, Ok, Result, Context } from "../../lib/core";
import { EventHandler } from "../../lib/types";

describe('context', () => {

    // Define User class outside of test blocks for reusability
    type Props = { name: string };

    class User extends Aggregate<Props> {
        private constructor(props: Props) {
            super(props);
        }

        public static signUp(name: string): User {
            return new User({ name });
        }

        public static create(props: Props): Result<User> {
            return Ok(new User(props));
        }
    }

    // Define SigNupEvent class outside of test blocks for reusability
    const contextY = Context.events();

    class SignUpEvent extends EventHandler<User> {
        constructor() {
            super({ eventName: 'CONTEXT:HANDLER' })
        }

        dispatch(user: User): void {
            contextY.dispatchEvent(this.params.eventName, user.toObject());
        };
    }

    it('should dispatch global event when user signs up', () => {
        // Mock event handler
        const mockEventHandler = jest.fn();

        // Subscribe to REGISTER event
        const context = Context.events();
        context.subscribe('CONTEXT:REGISTER', mockEventHandler);

        // User signs up
        const user = User.signUp('Jane Doe');

        const model = user.toObject();

        // Dispatch REGISTER event with user data
        context.dispatchEvent('CONTEXT:REGISTER', model);

        // Expect event handler to have been called
        expect(mockEventHandler).toHaveBeenCalledWith({ detail: [model] });
    });

    it('should dispatch global event on handler when user signs up', () => {
        // Mock event handler
        const mockGlobalEventHandler = jest.fn();

        // Subscribe to SIGNUP event in global context
        const contextX = Context.events();
        contextX.subscribe('CONTEXT:SIGNUP', mockGlobalEventHandler);

        // User signs up
        const user = User.signUp('John Doe');

        const model = user.toObject();

        Context.events().dispatchEvent('CONTEXT:SIGNUP', model);

        // Expect event handler to have been called
        expect(mockGlobalEventHandler).toHaveBeenCalledWith({ detail: [model] });
    });

    it('should dispatch global event on handler when user signs up', () => {
        // Mock event handler
        const mockGlobalEventHandler = jest.fn();

        // Subscribe to SIGNUP event in global context
        const contextX = Context.events();
        contextX.subscribe('CONTEXT:HANDLER', mockGlobalEventHandler);

        // User signs up
        const user = User.signUp('John Doe');
        user.addEvent(new SignUpEvent());

        const model = user.toObject();

        user.dispatchEvent('CONTEXT:HANDLER');

        // Expect event handler to have been called
        expect(mockGlobalEventHandler).toHaveBeenCalledWith({ detail: [model] });
    });

    it('should segregate events by contexts', () => {

        let callTimes = 0;
        const mockGlobalEventHandler = () => {
            callTimes = callTimes + 1;
        };

        const context = Context.events();

        context.subscribe('Context-A:SIGNUP', mockGlobalEventHandler);
        context.subscribe('Context-B:SIGNUP', mockGlobalEventHandler);
        context.subscribe('Context-C:SIGNUP', mockGlobalEventHandler);
        context.subscribe('Context-B:NOTIFY', mockGlobalEventHandler);
        context.subscribe('Context-B:SEND-EMAIL', mockGlobalEventHandler);

        callTimes = 0;
        context.dispatchEvent('Context-B:SIGNUP');
        expect(callTimes).toBe(1);

        callTimes = 0;
        context.dispatchEvent('*:SIGNUP');
        expect(callTimes).toBe(3);

        callTimes = 0;
        context.dispatchEvent('*:*');
        expect(callTimes).toBe(5);

        callTimes = 0;
        context.dispatchEvent('Context-B:*');
        expect(callTimes).toBe(3);
    });

    it('should throws if provide an invalid event name', () => {
        const context = Context.events();
        const err = () => context.subscribe('invalid-name', () => { });
        expect(err).toThrowError('Validation failed: Event name must follow the pattern "contextName:EventName". Please ensure to include a colon (":") in the event name to separate the context name and the event name itself.')
    });

    it('should throws if provide an invalid event name', () => {
        const context = Context.events();
        const err = () => context.dispatchEvent('invalid-name', () => { });
        expect(err).toThrowError('Validation failed: Event name must follow the pattern "contextName:EventName". Please ensure to include a colon (":") in the event name to separate the context name and the event name itself.')
    });
});
