import { Aggregate, Ok, Result, Context } from "../../lib/core";
import { EventHandler } from "../../lib/types";

describe('context', () => {

    // Define User class outside of test blocks for reusability
    type Props = { name: string };

    class User extends Aggregate<Props>{
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
            super({ eventName: 'HANDLER' })
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
        context.subscribe('REGISTER', mockEventHandler);

        // User signs up
        const user = User.signUp('Jane Doe');

        const model = user.toObject();

        // Dispatch REGISTER event with user data
        context.dispatchEvent('REGISTER', model);

        // Expect event handler to have been called
        expect(mockEventHandler).toHaveBeenCalledWith({ detail: [model] });
    });

    it('should dispatch global event on handler when user signs up', () => {
        // Mock event handler
        const mockGlobalEventHandler = jest.fn();

        // Subscribe to SIGNUP event in global context
        const contextX = Context.events();
        contextX.subscribe('SIGNUP', mockGlobalEventHandler);

        // User signs up
        const user = User.signUp('John Doe');

        const model = user.toObject();

        Context.events().dispatchEvent('SIGNUP', model);

        // Expect event handler to have been called
        expect(mockGlobalEventHandler).toHaveBeenCalledWith({ detail: [model] });
    });

   
    it('should dispatch global event on handler when user signs up', () => {
        // Mock event handler
        const mockGlobalEventHandler = jest.fn();

        // Subscribe to SIGNUP event in global context
        const contextX = Context.events();
        contextX.subscribe('HANDLER', mockGlobalEventHandler);

        // User signs up
        const user = User.signUp('John Doe');
        user.addEvent(new SignUpEvent());

        const model = user.toObject();

        user.dispatchEvent('HANDLER');

        // Expect event handler to have been called
        expect(mockGlobalEventHandler).toHaveBeenCalledWith({ detail: [model] });
    }); 

});
