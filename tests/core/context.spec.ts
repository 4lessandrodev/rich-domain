import { Aggregate, Ok, Result, Context } from "../../lib/core";
import { EventHandler } from "../../lib/types";

describe('context', () => {

    it('user instance should dispatch global event', () => {

        // ------------------
        // Any Other Context 

        const context = Context.events();

        context.addEvent('REGISTER', (user: { name: string }) => {
            console.log(user);
        });

        // ------------------
        // User Account Context

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

        const user = User.signUp('Jane Doe');

        context.dispatchEvent('REGISTER', user.toObject());

        expect(1).toBe(1);

    });


    it('another possibility, dispatch to global event on handler', () => {

        // ------------------
        // Any Other Context 

        const contextX = Context.events();

        contextX.addEvent('SIGNUP', (arg) => {
            console.log(arg);
        });


        // ------------------
        // User Account Context

        type Props = { name: string };

        class User extends Aggregate<Props>{
            private constructor(props: Props) {
                super(props);
            }

            public static signUp(name: string): User {
                const user = new User({ name });
                user.addEvent(new SigNupEvent());
                return user;
            }

            public static create(props: Props): Result<User> {
                return Ok(new User(props));
            }
        }

        const contextY = Context.events();

        class SigNupEvent extends EventHandler<User> {
            constructor() {
                super({ eventName: 'SIGNUP' })
            }

            dispatch(user: User): void {
                contextY.dispatchEvent(this.params.eventName, user.toObject());
            };
        }

        const user = User.signUp('John Doe');
        
        user.dispatchEvent('SIGNUP');

        expect(1).toBe(1);

    });

});
