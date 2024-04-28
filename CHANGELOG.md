# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

---

## Released

---

### Updates

---


### [1.23.0] - 2024-04-28

#### Changes

- Removed the `set` method from value object instances.
- Changed the way the `toObject` method works. Path shortcutting of property access has been removed when props have only one attribute.
- Implemented some improvements in how value objects handle primitive values.

#### Migrate from v1.22.1 to v1.23.0

- **Break Change**

If you are using the `toObject` method in production to create a model from Aggregate, Entity, or Value Object domain instances, it is important to note that the property access path is no longer shortened. 

Now the model object follows exactly the contract defined in `props`. 

For example:

If an object is defined in `props`, even if props contains only one property, if it is an object, the `toObject` method will generate a model according to `props`.

#### Before v1.22.1

```ts

type Props = { value: number };

class Price extends ValueObject<Props>{};

const price = new Price({ value: 200 });

console.log(price.toObject());

// > 200

```

#### After v1.23.0


```ts

type Props = { value: number };

class Price extends ValueObject<Props>{};

const price = new Price({ value: 200 });

console.log(price.toObject());

// > { value: 200 }

```

If you want to maintain the return with primitive value without it being an object, use `props` of primitive type.

```ts

class Price extends ValueObject<number>{};

const price = new Price(200);

console.log(price.toObject());

// > 200

```

Another alternative is to use an adapter.

```ts

class Adapter implements IAdapter<Domain, Model> {
    adapt(domain: Domain): Result<Model> {
        //...
    }
}

price.toObject(new Adapter());

```

---

### [1.22.1] - 2024-04-21

#### Features Added

- Added types inference to method "toObject" on entities and value objects
- Added method `getRaw` to getters-and-setters instance to expose props object

[#146](https://github.com/4lessandrodev/rich-domain/pull/146) Special thanks and credits to @hikinine

---

### Updates

### [1.22.0] - 2024-04-13

#### Features Added

- Added feature to segregate events by contexts.

Implementation Details:

- Implemented a mechanism to subscribe to events under different contexts.
- Implemented the ability to dispatch events to specific contexts based on the event name pattern.
- Introduced validation to ensure that event names follow the pattern "contextName:EventName".

```ts

// Example Usage
const context = Context.events();

const handler = (event) => console.log(event);

// Subscribing to events under different contexts
context.subscribe('Context-A:SIGNUP', handler);
context.subscribe('Context-B:SIGNUP', handler);
context.subscribe('Context-C:SIGNUP', handler);
context.subscribe('Context-B:NOTIFY', handler);
context.subscribe('Context-B:SEND-EMAIL', handler);

// Dispatching events to specific contexts
// Dispatches the SIGNUP event to Context-B
context.dispatchEvent('Context-B:SIGNUP');
// Dispatches the SIGNUP event to all contexts
context.dispatchEvent('*:SIGNUP');
// Dispatches all events to all contexts. Not recommended
context.dispatchEvent('*:*');
// Dispatches all events under Context-B
context.dispatchEvent('Context-B:*');

```

---

### [1.21.0] - 2024-04-11

#### Features Added

- Added Context Communication: Implemented a feature for inter-context communication within the library, enabling seamless interaction between different contexts within a project.

- Introduced Custom Events: Custom events can now be dispatched both globally and within specific aggregates, providing flexibility in event handling and propagation.

- Compatibility with Browser and Node.js: Maintained compatibility between browser and server environments by utilizing CustomEvents in the DOM for browser compatibility and standard event handling for Node.js.

- Aggregate Event Management: Aggregates retain event management methods, allowing for the encapsulation of business rules within specific contexts.

#### Known Issues

- Investigating potential chain reactions of lambda functions in certain scenarios.

#### Future Considerations

- Strong Typing: Consideration for enhancing typing support for event parameters to provide better developer guidance and error checking.

- Further Investigation: Continue investigating potential implications of fanning-out from a single lambda function to ensure robustness in complex scenarios.

#### Usage Examples

```ts

        // implement extending to EventHandler
        class Handler extends EventHandler<Product> {
            constructor() { super({ eventName: 'sample' }) };

            dispatch(product: Product, args_1: [DEvent<Product>, any[]]): void | Promise<void> {
                const model = product.toObject();
                const [event, args] = args_1;

                console.log(model);
                console.log(event);
                console.log(event.eventName);
                console.log(event.options);
                // custom params provided on call dispatchEvent
                console.log(args);
            }
        }

        // Listening global events
        contextX.subscribe('ACCOUNT:USER_REGISTERED', (arg) => {
            console.log(arg);
        });


        // ------------------
        // User Account as Context Y

        type Props = { name: string };

        class User extends Aggregate<Props>{
            private constructor(props: Props) {
                super(props);
            }

            public static signUp(name: string): User {
                const user = new User({ name });
                // add handler according to business rule
                user.addEvent(new SignUpEvent());
                return user;
            }

            public static create(props: Props): Result<User> {
                return Ok(new User(props));
            }
        }

        const contextY = Context.events();

        class SignUpEvent extends EventHandler<User> {
            constructor() {
                super({ eventName: 'SIGNUP' })
            }

            dispatch(user: User): void {
                // dispatch to global context event manager
                user.context().dispatchEvent("ACCOUNT:USER_REGISTERED", user.toObject());
            };
        }

        const user = User.signUp('John Doe');
        
        // dispatch to call handler
        user.dispatchEvent('SIGNUP');

```

### Bug Fixes
Fixed an issue with the event dispatching mechanism.
Notes
This version introduces significant changes to the event handling system, enhancing the flexibility and usability of the Aggregate class.

---

### [1.21.0] - 2024-04-11

#### Features Added

- Added Context Communication: Implemented a feature for inter-context communication within the library, enabling seamless interaction between different contexts within a project.

- Introduced Custom Events: Custom events can now be dispatched both globally and within specific aggregates, providing flexibility in event handling and propagation.

- Compatibility with Browser and Node.js: Maintained compatibility between browser and server environments by utilizing CustomEvents in the DOM for browser compatibility and standard event handling for Node.js.

- Aggregate Event Management: Aggregates retain event management methods, allowing for the encapsulation of business rules within specific contexts.

#### Known Issues

- Investigating potential chain reactions of lambda functions in certain scenarios.

#### Future Considerations

- Strong Typing: Consideration for enhancing typing support for event parameters to provide better developer guidance and error checking.

- Further Investigation: Continue investigating potential implications of fanning-out from a single lambda function to ensure robustness in complex scenarios.

#### Usage Examples

```ts

        import { Aggregate, Ok, Result, Context, EventHandler } from 'rich-domain';

        // ------------------
        // Some Context X

        const contextX = Context.events();

        // Listening global events
        contextX.subscribe('USER_REGISTERED', (arg) => {
            console.log(arg);
        });


        // ------------------
        // User Account as Context Y

        type Props = { name: string };

        class User extends Aggregate<Props>{
            private constructor(props: Props) {
                super(props);
            }

            public static signUp(name: string): User {
                const user = new User({ name });
                // add handler according to business rule
                user.addEvent(new SignUpEvent());
                return user;
            }

            public static create(props: Props): Result<User> {
                return Ok(new User(props));
            }
        }

        const contextY = Context.events();

        class SignUpEvent extends EventHandler<User> {
            constructor() {
                super({ eventName: 'SIGNUP' })
            }

            dispatch(user: User): void {
                // dispatch to global context event manager
                user.context().dispatchEvent("USER_REGISTERED", user.toObject());
            };
        }

        const user = User.signUp('John Doe');
        
        // dispatch to call handler
        user.dispatchEvent('SIGNUP');

```

#### Acknowledgments

thanks to @mmmoli for contributions and inspirations


---

### [1.20.3] - 2024-03-25

### Fix

- fix bind window.crypto to browser context

---

### [1.20.2] - 2024-03-25

### Changed

- Improved UUID generation function to ensure better atomicity and performance.
- Enhanced environment detection for browser and Node.js environments.
- Refactored UUID generation logic to eliminate potential race conditions and ensure thread safety.
- Updated UUID generation algorithm to utilize native environment resources more efficiently.
- Added support for generating UUIDs in both browser and Node.js environments, leveraging appropriate platform-specific methods.
- Enhanced UUID generation function to follow standard UUID format (8-4-4-4-12) using hexadecimal characters.
- Ensured backward compatibility with existing usage patterns while delivering significant improvements in reliability and efficiency.

---

### [1.20.1] - 2024-03-24

### Fixed

- Added context binding (this.bind(this)) to the EventHandler class constructor to ensure proper access to class properties and methods within event handlers.

---

### [1.20.0] - 2024-03-17

### Changed

- change: modify the to add and dispatch event on aggregate
- added: Implemented a new instance of the event management class, allowing for better event handling and organization.

**Details:**
Introduced a new method to create an event management instance for the aggregate.
Improved event handling and organization, enhancing the overall performance and efficiency of event management.
Enabled easier integration and usage of event management features in various applications.

```ts

import { TsEvents } from 'rich-domain';

/**
 * Create a new instance of the event management class
 * Pass the aggregate as a parameter
 * Return an event management instance for the aggregate
 */
const events = new TsEvents(aggregate);

events.addEvent('eventName', (...args) => {
    console.log(args);
});

// dispatch all events
await events.dispatchEvents();

// OR dispatch a specific event
events.dispatchEvent('eventName');

```


Implemented a new event handling mechanism using the Handler class.
Example:

```ts

// implement extending to EventHandler
class Handler extends EventHandler<Product> {
  
    constructor() { 
      super({ eventName: 'sample' });
    };

    dispatch(product: Product, params: [DEvent<Product>, any[]]): void | Promise<void> {
        const model = product.toObject();
        const [event, args] = params;

        console.log(model);
        console.log(event);

        // custom params provided on call dispatchEvent
        console.log(args);
    }
}

const event = new Handler();

aggregate.addEvent(event);

aggregate.dispatchEvent('sample', { custom: 'params' });

await aggregate.dispatchAll();

```

### Bug Fixes
Fixed an issue with the event dispatching mechanism.
Notes
This version introduces significant changes to the event handling system, enhancing the flexibility and usability of the Aggregate class.

### Migrating from v1.19.x

Change event handler implementation


```ts
// use extends to EventHandler
class Handler extends EventHandler<Product> {
  
    constructor() { 
      super({ eventName: 'sample' });
    };

    // aggregate as first param
    dispatch(product: Product): void | Promise<void> {
      // your implementation
    }
}

```

Remove imports `DomainEvents` and use events from aggregate instance

```ts

aggregate.addEvent(event);

aggregate.dispatchEvent('eventName');

```



---

## Released

---

### [1.19.2] - 2024-03-15

### Changed

- change: added support to nodejs v21 

---

### [1.19.1] - 2023-12-15

### Changed

- change: update deps

---

### [1.19.0] - 2023-09-30

### Changed

- changed: remove history (`snapshot`) deprecated method. removed to improve performance and save memory usage.
- change: update deps

---

### [1.18.4] - 2023-07-23

### Fixed

- fixed: ensure compare null or undefined using `isEqual` method on value-object, entity and aggregate instance.
- fixed: ensure create props copy on clone domain entities.
- added: create a shortcut to `isEqual` method on id instance to compare values.
- changed: mark history (`snapshot`) method as deprecated. Will be removed on next version to improve performance.
- change: update deps

---

### [1.18.3] - 2023-07-30

### Fixed

- fixed: ensure custom payload error to adapter

---
### [1.18.2] - 2023-07-09

### Fixed

- fixed: ensure provide null value when call toObject function on entity, aggregate and value objects
- fixed: ensure custom payload type on create method

---
### [1.18.1] - 2023-06-30

### Fixed

- fixed: check if exists some id before transform to a simple value on execute toObject method.

---
### [1.18.0] - 2023-03-15

### Changed

- changed: move event manager to instance of aggregate #50 by [Paulo Santana](https://github.com/hikinine)

The user will still have the option of using the global event handler using `DomainEvents` class, however when adding an event using an instance of an aggregate, the event can only handle from the instance of the aggregate

```ts

// add event to instance of aggregate - OK
user.addEvent(event);

// dispatch from aggregate instance - OK
user.dispatchEvent('EventName', handler);

/** 
 * if you try dispatch the event globally It will not works, because the events was added to aggregate * instance specifically
 * The Event does not exists globally.
*/
DomainEvents.dispatch({ eventName: 'EventName', id: user.id }); 

// to dispatch global
// add the event globally
DomainEvents.addEvent({ /* ... */ });

// so dispatch it globally. Works!
DomainEvents.dispatch({ /* ... */});

```

- changed: Result properties to private using # to do not serialize private keys
- changed: Types for create method: Entity, Aggregate and ValueObject
- changed: Clone method in Entity and Aggregate instance. Now It accepts optional props.

```ts

// create a copy of user instance and also copy domain events from original aggregate user.
const userCopy = user.clone({ copyEvents: true });

// create a copy and apply a new name value
const userCopy = user.clone({ name });

```

---

### [1.17.3] - 2023-03-12

### Update

- update build

---
### [1.17.2] - 2023-03-12

### Added

- added: event handler callback

```ts

user.dispatchEvent('EventName', handler);

```

---

### [1.17.1] - 2023-01-27

### Fix

- utils.number: fix precision on calculation and infinity case

```ts

// Example using fractionDigits
// Default fractionDigits is 5

util.number(0.03).divideBy(0.09, { fractionDigits: 4 });

> 0.3333

```

```ts

// Example Infinity case now returns 0
// 0 / 1 = Infinity

util.number(0).divideBy(1);

> 0

```

---

### [1.17.0] - 2023-01-21

### Changed
- Rename methods
- Change payload

### Breaking Change
- ValueObject, Entity, Aggregate: `clone` method now returns an instance instead `Result`
- ValueObject, Entity, Aggregate: `set` and `change` method now returns `true` if the value has changed and returns `false` if the value has not changed.

```ts

// Example using set now

const changed = user.set("name").to(age);

console.log(changed);

> true

```

```ts

// Example using clone now

const copy = user.clone();

console.log(copy.get("name").get("value"))

> "Jane Doe"

```

---

### [1.16.3] - 2023-01-20

### Added

- Util: added method date. [pull request 32](https://github.com/4lessandrodev/rich-domain/pull/32)

---

### [1.16.2] - 2023-01-19

### Added

- Aggregate, Entity, ValueObject: added `util` method to instance.
- Util: added class to domain with some utils functions. [pull request 31](https://github.com/4lessandrodev/rich-domain/pull/31)

---

### [1.16.1] - 2023-01-18

### Added

- Aggregate: added method `dispatchEvent` to handle domain events from aggregate instance.
- Validator: added method `isSpecialChar` and `hasSpecialChar` to check special character.

---

### [1.16.0] - 2023-01-12

### Added

- Entity: added method `isEqual` to compare current instance with another one.
- ValueObject: added method `isEqual` to compare current instance with another one. [Issue 27](https://github.com/4lessandrodev/rich-domain/issues/27)

---
### [1.15.2] - 2023-01-05

### Fixed

- toObject method on entity: fix error on process simple object on entity [issue #25](https://github.com/4lessandrodev/rich-domain/issues/25)

---
### [1.15.1] - 2023-01-03

### Changed

- node version: update requirements. node version required >=16 and < 19

---
### [1.15.0] - 2022-12-25

### Changed

- value-object: mark set function as deprecated
- value-object: mark change function as deprecated
- validator: change methods for string (hasLengthBetween - now validate only interval)
- validator: rename method isPair to isEven

### Added

- validator - string added method hasLengthBetweenOrEqual
- validator - number isBetweenOrEqual

The function still works, but it is marked as deprecated. show warning if using.

---
### [1.14.6] - 2022-11-27

### Fixed

- AutoMapper: fix conversion for aggregate
- Now its possible to convert entity on aggregate

---
### [1.14.5] - 2022-11-25

### Fixed

- Domain Events: fix iteration to domain id
- Combine: fix iterator not defined

### Added

- dispatchAll: added fn to dispatch all event by aggregate id

---
### [1.14.4] - 2022-11-22

### Changed

- Types: update types for Result

---
### [1.14.3] - 2022-11-22

### Changed

- Result: change to type any result arg on combine function
### Added

- Result: added Combine function as single import
- Types: added Payload type as Result type

---
### [1.14.2] - 2022-11-22

### Added

- validator: added method to validate if all chars in string is number

---
### [1.14.1] - 2022-10-03

### Updated

- result: ensure result props to be read only

---
### [1.14.0] - 2022-09-27

### Change

- refactor: Fail
- refactor: Ok
- refactor: Result.Ok
- refactor: Result.fail

Change generic types order for `Result.fail` and `Result.Ok`

Now each method has your own order
Example: 

```ts

// for implementation: 
IResult<Payload, Error, MetaData>;

// before the generic order was the same for both method.
// now for 
Result.Ok

// the generic order is 
Result.Ok<Payload, MetaData, Error>(payload metaData);

// for 
Result.fail 

//the generic order is 
Result.fail<Error, MetaData, Payload>(error, metaData);

```

Changes made on Ok

```ts

import { Ok } from 'rich-domain';

// simple use case for success. no arg required
return Ok();

// arg required 

return Ok<string>('my payload');

// arg and metaData required 

interface MetaData {
  arg: string;
}

return Ok<string, MetaData>('payload', { arg: 'sample' })
```

Changes made on Fail

```ts

import { Fail } from 'rich-domain';

// simple use case for success. no arg required
return Fail();

// arg required 

return Fail<string>('my payload');

// arg and metaData required 

interface MetaData {
  arg: string;
}

return Fail<string, MetaData>('payload', { arg: 'sample' })
```
---
### [1.13.0] - 2022-09-26

### Added

- feat: implement function Fail
- feat: implement function Ok

---
### [1.12.0] - 2022-09-14

### Fixed

fix: implement support for native randomUUID

---
### [1.11.2] - 2022-09-03

### Changed

chore: updated dependencies
- typescript to version 4.8.2
- @types/jest to 28.1.8
- jest 28.1.3

fix: update some types error on update typescript

---
### [1.11.1] - 2022-08-14

### Added

chore: added license
ci: added dependa bot
ci: added build and test step on merge
docs: added full documentation to readme

---

### [1.11.0] - 2022-08-10

### Changed

- changed validation method args position

Now second arg is optional. The key is not required

```ts

  // from
  validation<Key extends keyof Props>(key: Key, value: Props[Key]): boolean {};

  // to
  validation<Key extends keyof Props>(value: Props[Key], key: Key): boolean {};

```

---
### [1.10.0] - 2022-08-07

### Added

- createMany method on domain entity and value objects

```ts


const { result, data } = ValueObject.createMany([
  Class<AgeProps>(Age, props),
  Class<PriceProps>(Price, props),
  Class<NameProps>(Name, props)
]);

result.isOk() // true

const age = data.next() as IResult<Age>;
const price = data.next() as IResult<Price>;
const name = data.next() as IResult<Name>;

age.value().get('value') // 21

```

### Change

### Result:

- from `isOK()` to `isOk()`
- from `OK()` to `Ok()`

---

### [1.9.0]-beta - 2022-08-06

### Change

- Result: now you may return Result<void>

```ts

const result: Result<void> = Result.Ok();

```
- Rename methods:

### Result:

- from `isFailure()` to `isFail()`
- from `isSuccess()` to `isOK()`
- from `isShortID()` to `isShort()`
- from `success()` to `OK()`
- from `createShort()` to `short()`

---
