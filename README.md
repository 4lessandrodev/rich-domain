# rich-domain
Build great app using domain driven design

<a href="https://www.npmjs.com/package/rich-domain" rel="nofollow" class="keychainify-checked">
 <img src="https://badgen.net/github/checks/4lessandrodev/rich-domain/main" 
 alt="checks" 
 style="max-width: 100%;">
</a>
<a href="https://www.npmjs.com/package/rich-domain" rel="nofollow" class="keychainify-checked">
 <img src="https://badgen.net/github/stars/4lessandrodev/rich-domain" 
 alt="stars" 
 style="max-width: 100%;">
</a>
<a href="https://www.npmjs.com/package/rich-domain" rel="nofollow" class="keychainify-checked">
 <img src="https://badgen.net/github/commits/4lessandrodev/rich-domain/main" 
 alt="commits" 
 style="max-width: 100%;">
</a>
<a href="https://www.npmjs.com/package/rich-domain" rel="nofollow" class="keychainify-checked">
 <img src="https://badgen.net/github/last-commit/4lessandrodev/rich-domain/main" 
 alt="last commit" 
 style="max-width: 100%;">
</a>
<a href="https://www.npmjs.com/package/rich-domain" rel="nofollow" class="keychainify-checked">
 <img src="https://badgen.net/github/license/4lessandrodev/rich-domain" 
 alt="license" 
 style="max-width: 100%;">
</a>
<a href="https://www.npmjs.com/package/rich-domain" rel="nofollow" class="keychainify-checked">
 <img src="https://badgen.net/github/dependabot/4lessandrodev/rich-domain" 
 alt="dependabot" 
 style="max-width: 100%;">
</a>
<a href="https://www.npmjs.com/package/rich-domain" rel="nofollow" class="keychainify-checked">
 <img src="https://badgen.net/github/tag/4lessandrodev/rich-domain" 
 alt="tags" 
 style="max-width: 100%;">
</a>
<a href="https://www.npmjs.com/package/rich-domain" rel="nofollow" class="keychainify-checked">
 <img src="https://badgen.net/github/closed-issues/4lessandrodev/rich-domain" 
 alt="issues" 
 style="max-width: 100%;">
</a>
<a href="https://github.com/4lessandrodev/rich-domain?branch=main" rel="nofollow" class="keychainify-checked">
 <img src="https://img.shields.io/codecov/c/github/dwyl/hapi-auth-jwt2.svg?maxAge=2592000" 
 alt="issues" 
 style="max-width: 100%;">
</a>

---

## About the lib

This package provide utils file and interfaces to assistant build a complex application as domain driving design and nodeJS with typescript.

### Simple App Example

A simple app example available on [link](https://github.com/4lessandrodev/ddd-app)

---
## Documentation

### Folders
Folders structure suggestion
Divided by

- Domain layer
- Application layer
- Infra layer

```shell
  $ tree
  .
  ├── package.json
  ├── README.md
  └── src
       ├── configs
       │    └── env
       │
       ├── shared
       │    └── infra
       │         └── server  
       │
       └── modules
            │ 
            └── [module-name]
                  │ 
                  │── domain
                  │     ├── value-objects
                  │     ├── entities
                  │     ├── aggregates
                  │     ├── events
                  │     ├── subscriptions
                  │     ├── adapter
                  │     ├── repository-interface
                  │     └── domain-services
                  │ 
                  ├── application
                  │     └── use-cases 
                  │ 
                  └── infra
                        ├── models
                        └── repository

```

---

## Core

---

<img src="./cover.png" alt="image" width="100%">

---

## 1. Ubiquitous language:

- Language and terms agreed upon by both business users and developers, within a bounded context
- Entities with the same name in a different context can have different behavior and data
- Bounded context helps in single responsibility for domain models

## 2. Rich domain model:

- Models (entities, value objects, aggregates) with rich behavior are preferred over anemic domain models (entities without behavior, which only keep data and represent the DB tables)
- Due to single responsibility principle (a class or method should have only one reason to change), non-cohesive behavior should be delegated to other classes (or even handled inside domain services) when necessary
- Model methods can also delegate the task to domain services by raising domain events

## 3. Thin domain service working on rich domain models:

- Domain services should not hold state (application services are not domain services, they are on the outer layer close to the UI layer, and can hold application/task state)
- Domain services have very little behavior and only which does not fit cohesively in any domain model
- Domain services sit in the core domain layer along with entities, value objects, aggregates and domain events, and expose domain models in their interfaces

## 4. Layers in a DDD application:

- Core domain layer (domain services, entities, value objects, aggregates and domain events)
- Core domain layer is surrounded by the UI/Application layer and Infrastructure layer
- UI/Application layer (UI and application service facade with messaging, JSON, XML capabilities, session, etc.)
- Infrastructure layer (persistence, file system, network, mail, logging, etc.)

## 5. Entities:

- Live longer than the application, should endure restarts, and are persisted and read from data sources (DB, file system, network, etc.)
- Have an id (preferably a GUID rather than a DB generated int because business transactions do not rely on persistence, can be persisted after other operations carried out in model's behavior)
- Have entity semantics (equality and `GetHashCode()` defined by class name + id)
- Behavior in an entity mostly orchestrates value objects for a use case
- Entity class should not have public property setters, setting a property should be a behavior method
- Entities should not have bidirectional relations (depending on the bounded context, either an egg can have a chicken or a chicken can have eggs, but not both)
- Entity relations should not reflect the complete set of DB foreign key relationships, should be bare down to the minimum for performing the behavior inside the bounded context
- Entity relations should not hold a reference to another entity class, it can only keep the id of another entity
- If a business transaction needs a reference to other entities in relation, aggregates should be used instead (aggregates can hold a reference to other aggregate roots, which are entity classes by definition)

## 6. Value objects:

- Are only identified by their values, not by their ids (for example money is a value object as long as we are not tracking individual banknotes, if we need to track individual banknotes then it should be a banknote entity)
- Can be used to measure or describe things (name, description, amount, height, date, time, range, address, etc.)
- You can combine other value types that usually go together into a new value object type, like address (city, street, country, postal code) or ...range, or ...type
- Prefer to put the behavior on value objects rather than on entities because value objects are immutable and do not have side effects (like changing their state or changing the state of any entity)
- Can be part of an entity
- Have value semantics (equality and `GetHashCode()` defined by property values)
- Should be immutable, behaviors should not change the state of a value object, but can rather create a new value object (should act similar to C# strings, structs, ints, and other value types)
- Can be persisted but only as part of an entity, not individually

## 7. Factories:

- Create, build aggregates and entities:
- Static Create...() factory method on a model class is used to guard against the construction of an invalid or incomplete model
- The model class should not have a public default constructor (however if it is to be persisted, for Entity Framework to work, it can have a protected or private default constructor)

## 8. Aggregates:

- Encapsulate and are composed of entity classes and value objects that change together in a business transaction
- Aggregates are a transactional graph of model objects
- Aggregate root should be an entity, an aggregate can even be a single entity
- Aggregate can keep a reference to other aggregate roots, but not to other entity classes which are not aggregate roots themselves
- Aggregate should not keep a reference to other aggregate root entity classes if those other entities do not change together with this aggregate root entity
- Aggregate can also keep the id of another entity, but keeping too many foreign key ids is a code smell (why?)
- If deleting an entity has a cascade effect on the other entities referenced by class in the object graph, these entities are part of the same aggregate, if not, they should not be inside this aggregate

## 9. Repositories:

- Persist and read aggregates to/from DB or file system
- Should have an interface close to a collection but should allow only the necessary operations needed for this aggregate (for example an aggregate might not need to be allowed to get updated or deleted)
- Should not be generic (should be specific for the aggregate type)
- Can have specific query methods if needed (like `FindByName()` etc.)
- Do not use lazy loading, instead use eager loading (use Include(...) in Entity Framework), else you can face "N+1 problem"s and excessive number of queries sent to DB
- Can have specific methods that only load some of the columns from a table
- Repository add/update/remove operation should commit to DB by itself (call Entity Framework ...Context.SaveChanges() at the end), because aggregate operations should be ACID transactions
- Repository interface sits inside Core domain layer, but implementations are inside Infrastructure layer
- Repositories are not used inside the domain models (entities, value objects, aggregates)

## 10. Shared kernel:

- Is where cross-cutting concerns or common types shared by all bounded contexts sit (like entity abstract base type, value object abstract base type, common value objects, authorization, etc.)

## 11. Domain events:

- Can be raised when a state change occurs in an entity
- Decouple models from each other
- Only used when an event needs to be handled inside a different model than the one raising this event, or handled inside a domain service or even an application service
- Are immutable classes, that represent past, named in the past tense, and cannot change (...Changed, ...Happened, etc.)
- Should include the time that this event was raised, as well as any other useful info for handling the event, as well as the id of the entity which raised the event
- Should not have behavior
- Domain events are subscribed to with a callback (lambda), or using pub sub interfaces, on a singleton or static event message bus
- Domain events implemented this way can be subscribed to and handled in the aggregate root of the entity which raised the event, or in domain services, or even in UI/Application layer
- Domain events are raised synchronously, if an asynchronous task needs to be carried out, it can be done inside the event handler (async-await pattern)
- Outside applications can also be triggered by using a message queue or an enterprise service bus (ESB) inside the domain event handler

## 12. Anti-corruption layer:

- Used to translate models from outside systems or legacy apps to models inside the bounded context and vice versa, and also to ease the communication with legacy services
- Can use service facades and model adapters



---

## 13 - Summary - Basic Usage

### Value Object

> A value object is a small, simple object that represents a single value or characteristic, such as a monetary amount or a date. It is characterized by having no identity of its own, meaning it is equal to another value object if its values are equal, regardless of its reference. Value objects are often used in domain-driven design to represent simple entities in the system.

#### Create a value object with business rules.

```ts

import { ValueObject, Ok, Fail, Result } from 'rich-domain';

interface Props {
    amount: number;
}

// simple example as monetary value object business behavior. 
// Extends ValueObject to inherit some behaviors, utils and helpers.
export default class Money extends ValueObject<Props> {
    
    // private constructor. Avoid public new.
    private constructor(props: Props) {
        super(props);
    }

    // any business rule behavior. Check if current amount is greater than x.
    public isGt(x: Money): boolean {
        const { number: Check } = this.validator;
        const xValue = x.get('amount');
        const currentValue = this.get('amount');
        return Check(xValue).isGreaterThan(currentValue);
    }

    // any business rule behavior. Calculate and sum x to current value.
    public sum(x: Money): Money {
        const { number: Calc } = this.util;
        const value = x.get('amount');
        const current = this.get('amount');
        const amount = Calc(current).sum(value);
        return new Money({ amount }); // immutable
    }

    // any business rule behavior. Calculate and subtract x from current value.
    public subtract(x: Money): Money {
        const { number: Calc } = this.util;
        const value = x.get('amount');
        const current = this.get('amount');
        const amount = Calc(current).subtract(value);
        return new Money({ amount }); // immutable
    }

    // any business rule to validate state. Value must be greater or equal 0
    public static isValidProps({ amount }: Props): boolean {
        const { number: Check } = this.validator;
        return Check(amount).isPositive();
    }

    // shortcut to create a zero value.
    public static zero(): Money {
        return new Money({ amount: 0 }); // immutable
    }

    // factory method to create an instance and validate value.
    public static create(amount: number): Result<Money> {

        const isValid = this.isValidProps({ amount });
        if(!isValid) return Fail("Invalid amount for money");

        return Ok(new Money({ amount }));
    }
}

```

How to use value object instance

```ts

// operation result
const resA = Money.create(500);

// check if provided a valid value
console.log(resA.isOk());

// > true


// money instance
const moneyA = resA.value();

moneyA.get("amount"); 

// 500

// using methods 
moneyA.isGt(Money.zero());

// > true

const moneyB = Money.create(100).value();

const moneyC = moneyA.sum(moneyB);

const value = moneyC.get('amount');

console.log(value); 

// > 600


```

---

### Entity

> An entity in domain-driven design is an object that represents a concept in the real world and has a unique identity and attributes. It is a fundamental building block used to model complex business domains.

#### Create an entity with business rules.

```ts

import { Entity, Ok, Fail, Result, UID } from 'rich-domain';

interface Props {
    id?: UID;
    total: Money;
    discount: Money;
    fees: Money;
}

// simple example as payment entity using money value object
// Extends Entity to inherit some behaviors, utils and helpers.
export default class Payment extends Entity<Props> {

    // private constructor
    private constructor(props: Props){
        super(props);
    }

    // any business rule behavior. Update total. Update object state.
    public applyFees(fees: Money): Payment {
        this.props.total = this.props.total.sum(fees);
        this.props.fees = fees;
        return this;
    }

    // any business rule behavior. Update object state.
    public applyDiscount(discount: Money): Payment {
        this.props.total = this.props.total.subtract(discount);
        this.props.discount = discount;
        return this;
    }

    // factory method to create a instance. Value must be positive.
    public static create(props: Props): Result<Payment> {
        return Ok(new Payment(props));
    }
}

```

How to use entity instance

```ts

// operation result
const total = Money.create(500).value();
const discount = Money.zero();
const fees = Money.zero();

// create a payment
const payment = Payment.create({ total, discount, fees }).value();

// create fee and discount
const fee = Money.create(17.50).value();
const disc = Money.create(170.50).value();

// apply fee and discount
const result = payment.applyFees(fee).applyDiscount(disc);

// get object from domain entity
console.log(result.toObject());

{
    "id": "d7fc98f5-9711-4ad8-aa16-70cb8a52244a",
    "total": 347,
    "discount": 170.50,
    "fees": 17.50,
    "createdAt":"2023-01-30T23:11:17.815Z",
    "updatedAt":"2023-01-30T23:11:17.815Z"
}

```

---

See also how to use Aggregate.

## Features

### Result

What is Result:

`Result` is a class that encapsulates the result of an operation and stores the success or failure state without throws the application.

#### Interface and Generic Types

- P = `Payload` optional default `void`
- E = `Error` optional default `string`
- M = `MetaData` optional default `{}`

```ts

IResult<P, E, M>;

```

You can import like example below

```ts

import { Result, Ok, Fail } from "rich-domain";

// Success use case

return Result.Ok();

// OR

return Ok();

// OR

return Ok(data);

// OR

return Ok<Payload>(data);

// Failure use case

return Result.fail('error message here');

// OR

return Fail('error message here');

// OR

return Fail<MyError>(myCustomError);


```

Example how to use generic types.
First let's create our interfaces to use as generic type.
- The type of data to be retrieved can be any type you want.


```tS

// Payload type
interface IData { data: string };

// Error type
interface IError { message: string };

// MetaData type. Optional
interface IMeta { arg: number };

```

Now let's implement a function that return the result below

```ts

IResult<IData, IError, IMeta>;

```
So let's implement that on a simple function.

```ts

const isEven = (value: number): Result<IData, IError, IMeta> => {

	const isEvenValue = value % 2 === 0;
	const metaData: IMeta = { arg: value };
	
	if (isEvenValue) {
		
		// success payload 
		const payload: IData = { data: `${value} is even` };

		// return success
		return Ok(payload, metaData);
	}

	// failure payload 
	const error: IError = { message: `${value} is not even` };

	// return failure
	return Fail(error, metaData);
};


```
Here we have a function that returns success if the value informed is even and returns failure if it is odd.

Success Case

```ts

const result = isEven(42);

console.log(result.isOk());

> true

console.log(result.value());

> 'Object { data: "42 is even" }'

console.log(result.metaData());

> 'Object { arg: 42 }'

console.log(result.error());

> null

```
Failure Case

```ts

const result = isEven(43);

console.log(result.isFail());

> true

console.log(result.error());

> 'Object { message: "43 is not even" }'

console.log(result.metaData());

> 'Object { arg: 43 }'

console.log(result.value());

> null

```

#### Void

The most simple void success example.<br>
Let's see the same example using void.

```ts

const checkEven = (value: number): Result<void> => {

	const isEven = value % 2 === 0;

	// success case
	if(isEven) return Ok(); 
	
	// failure case
	return Fail('not even');
}

```
Using the function as success example

```ts

const result: Result<void> = checkEven(42);

console.log(result.isOk());

> true

console.log(result.isFail());

> false

console.log(result.error());

> null

console.log(result.value());

> null

console.log(result.metaData());

> 'Object {}'

```

Fail example

```ts

const result: IResult<void> = checkEven(43);

console.log(result.isFail());

> true

console.log(result.isOk());

> false

console.log(result.error());

> "not even"

console.log(result.value());

> null

console.log(result.metaData());

> 'Object {}'

```

#### toObject method
you can get a summarized object with the properties of an instance of a `Result`

```ts

console.log(result.toObject());

> Object
`{
	"data": null, 
	"error": "not even", 
	"isFail": true, 
	"isOk": false, 
	"metaData": Object {}
 }`

```

#### Hooks

In the instances of a Result there are two hooks that allow the execution of a command according to the state.

```ts

class Command implements ICommand<void, void> {
	execute(): void {
		console.log("running command ...");
	}
}

const myCommand = new Command();

const result = Ok();

result.execute(myCommand).on('Ok');

> "running command ..."

```

You might also want to pass arguments to the command

```ts

class Command implements ICommand<string, void> {
	execute(error: string): void {
		console.log(error);
	}
}

const myCommand = new Command();

const result = Fail('something went wrong');

result.execute(myCommand).withData(result.error()).on('fail');

> "something went wrong"

```

#### Combine

You can use the static `combine` function of `Result` to check many instances if any are failed it will return the instance with error state.

Success example 

```ts

import { Ok, Combine } from "rich-domain";

const resultA = Ok();
const resultB = Ok();
const resultC = Ok();

const result = Combine([ resultA, resultB, resultC ]);

console.log(result.isOk());

> true

// OR 

import { Result } from "rich-domain";

const resultA = Result.Ok();
const resultB = Result.Ok();
const resultC = Result.Ok();

const result = Result.combine([ resultA, resultB, resultC ]);

console.log(result.isOk());

> true

```
Failure example 

```ts

const resultA = Ok();
const resultB = Fail('oops err');
const resultC = Ok();

const result = Combine([ resultA, resultB, resultC ]);

console.log(result.isOk());

> false

console.log(result.error());

> 'oops err'

```

---


### ID

What is ID:
A symbol which uniquely identifies an object or record.<br>
In this Lib all IDs are generated by domain and uses uuid v4.

#### Create New
Create a new uuid.

```ts

import { ID, Id } from "rich-domain";

const id = ID.create();

console.log(id.value());

> "eb9c563c-719d-4872-b303-0a82921351f7"

// OR as function

const id = Id();

```

#### Short New
Create a short id

```ts

const id = ID.short();

console.log(id.value());

> "EB9C563DB4872BF7"

```

#### Create Existing
Create a id with provided value

```ts

const id = ID.create('this-is-my-id-01');

console.log(id.value());

> "this-is-my-id-01"

// OR 

const id = Id('this-is-my-id-01');

```

#### Compare ids
The id instance has a method to compare two ids.

```ts

const idA = ID.short('id-01');
const idB = ID.short('id-02');

console.log(idA.equal(idB));

> false

console.log(idB.equal(idB));

> true

```

#### IsNew
Check if id instance is has a new value

```ts

const idA = ID.create('this-is-my-id-01');
const idB = ID.create();

console.log(idA.isNew());

> false

console.log(idB.isNew());

> true

// OR

const idA = Id('my-custom-id-01');

console.log(idA.isNew());

> false

const idB = Id();

console.log(idB.isNew());

> true

```

#### Type for ID
Define type for ID

```ts

import { UID, ID, Id } from 'rich-domain';

// UID type
let id: UID;

// ID value
id = ID.create();

// OR

id = Id();

```

---

### ValueObject

What is value object:

- Are only identified by their values, not by their ids (for example money is a value object as long as we are not tracking individual banknotes, if we need to track individual banknotes then it should be a banknote entity)
- Can be used to measure or describe things (name, description, amount, height, date, time, range, address, etc.)
- You can combine other value types that usually go together into a new value object type, like address (city, street, country, postal code) or ...range, or ...type
- Prefer to put the behavior on value objects rather than on entities because value objects are immutable and do not have side effects (like changing their state or changing the state of any entity)
- Can be part of an entity
- Should be immutable, behaviors should not change the state of a value object, but can rather create a new value object (should act similar to C# strings, structs, ints, and other value types)
- Can be persisted but only as part of an entity, not individually.


#### Simple Value Object.

Value objects extend to `ValueObject` class have private constructor and public static method called `create`.<br>
The `create` method receives the props which by default is an object with the key `value`.

the value object below is a base example without any kind of validation

```ts

import { Result, ValueObject } from "rich-domain";

export interface NameProps {
	value: string;
}

export class Name extends ValueObject<NameProps>{
	private constructor(props: NameProps) {
		super(props);
	}

	public static create(value: string): Result<Name> {
		return Result.Ok(new Name({ value }));
	}
}

export default Name;

```

Now that we have defined our value object class, we can create an instance.<br>
The `create` method returns an instance of Name encapsulated by the `Result`, so it is important to always assess whether the result is a success before getting the value.

```ts

const result = Name.create('Jane');

console.log(result.isOk());

> true

const name = result.value();

console.log(name.get('value'));

> "Jane"

```

Once we have an instance of a value object, we can use some methods that the library makes available.

By default setters are enabled

```ts

// do not use set to change value object value. create a new instance instead.

name.set('value').to('John');

console.log(name.get('value'));

> "John"

```

When you use the `set` or `change` function to modify the state, each change is saved in a history

```ts

console.log(name.history().count());

> 2

// back to old value on history
name.history().back();

console.log(name.get('value'));

> "Jane"

```

> **We don't advise you to use state change of a value object. Create a new one instead of changing its state. However the library will leave that up to you to decide.**

To disable the setters of a value object use the parameters below in the super.<br>
This property disables the set function of the value object.

```ts

constructor(props: NameProps){
	super(props, { disableSetters: true })
}

```

Now when trying to change the value using `set` or `change` it will not be modified.

```ts

console.log(name.get('value'));

> "John"

name.set('value').to('James');

console.log(name.get('value'));

> "John"

```

#### Using validation

Validation before create instance.<br>
A validator instance is available in the "Value Object" domain class.

```ts

import { IResult, Ok, Fail, ValueObject } from "rich-domain";

export interface NameProps {
	value: string;
}

export class Name extends ValueObject<NameProps>{
	private constructor(props: NameProps) {
		super(props);
	}

	public static isValidProps({ value }: NameProps): boolean {
		const { string } = this.validator;
		return string(value).hasLengthBetween(3, 30);
	}

	public static create(value: string): IResult<Name> {
		const message = 'name must have length min 3 and max 30 char';

		if (!this.isValidProps({ value })) return Fail(message);

		return Ok(new Name({ value }));
	}
}

export default Name;

```

Now when you try to instantiate a name, the value will be checked and if it doesn't meet the validation requirements, a `Result` will be returned with an error state.

```ts

const empty = '';

const result = Name.create(empty);

console.log(result.isFail());

> true

console.log(result.error());

> "name must have length min 3 and max 30 char"

console.log(result.value());

> null

```

#### Validation before set

The `isValidProps` Method validates properties when creating a new instance, but which method validates before modifying a value?
For this there is the method `validation`

The validation method takes two arguments, the first the `key` of props and the second the `value`.
So when calling the `set` or `change` function, this method will be called automatically to validate the value, if it doesn't pass the validation, the value is not changed.

> There must be a validation for each "props" key

```ts

validation<Key extends keyof Props>(value: Props[Key], key: Key): boolean {
	
	const { number } = this.validator;

	const options: IPropsValidation<Props> = {
		value: (value: number) => number.isBetween(0, 130),
	} 

	return options[key](value);
};

```

In case your value object has only one attribute you can simply use the already created static validation method.<br>
Let's see a complete example as below

```ts

import { Result, Ok, Fail, ValueObject } from "rich-domain";

export interface NameProps {
	value: string;
}

export class Name extends ValueObject<NameProps>{
	private constructor(props: NameProps) {
		super(props);
	}

	validation(value: string): boolean {
		return Name.isValidProps({ value });
	}

	public static isValidProps({ value }: NameProps): boolean {
		const { string } = this.validator;
		return string(value).hasLengthBetween(3, 30);
	}

	public static create(value: string): Result<Name> {
		const message = 'name must have length min 3 and max 30 char';
		const isValidProps = this.isValidProps({ value });
		if (!isValidProps) return Fail(message);

		return Ok(new Name({ value }));
	}
}

export default Name;

```

Let's test the instance and the validation method.<br>
Value is not modified if it does not pass validation.

```ts

const result = Name.create('Jane');

console.log(result.isOk());

> true

const name = result.value();

console.log(name.get('value'));

> "Jane"

const empty = '';

name.set('value').to(empty);

console.log(name.get('value'));

> "Jane"

name.set('value').to("Jack");

console.log(name.get('value'));

> "Jack"

```

#### toObject
This method transforms a complex object into a simple object or value.<br>
This method is useful for cases where you have value objects inside other value objects

```ts

const street = Street.create('Dom Juan').value();

const number = Number.create(42).value();

const result = Address.create({ street, number });

const address = result.value();

console.log(address.toObject());

> Object 
`{
	"street": "Dom Juan", 
	"number": 42,
 }`

```

#### Clone
This method creates a new instance with the same properties as the current value object.

```ts

const result = Name.create('Sammy');

const originalName = result.value();

console.log(originalName.value());

> "Sammy"

const clone = originalName.clone();

console.log(clone);

> "Sammy"

```

Clone being a new instance does not change the properties of the original value object

```ts

clonedName.change('value', 'Jones');

console.log(clonedName.value());

> "Jones"

console.log(originalName.value());

> "Sammy"

```

#### createMany

Sometimes you will need to create many instances of different value objects and for that there is static method available `createMany` on value objects, entity and aggregate.

```ts

const itemPrice = Class<PriceProps>(ProductPrice, { value: price });
const itemName = Class<NameProps>(ProductName, { value: name });
const itemQtd = Class<QtdProps>(ProductQtd, { value: qtd });

const { data, result } = ValueObject.createMany([ itemPrice, itemName, itemQtd ]);

// you check if all value objects are ok
if (result.isFail()) return Result.fail(result.error());

// you can get instances from iterator data. In the same order as the array
const price = data.next().value() as ProductPrice;  // index 0
const name = data.next().value() as ProductName;    // index 1
const quantity = data.next().value() as ProductQtd; // index 2

const product = Product.create({ name, price, quantity });

```

---

### Entity

What is value object:

- Live longer than the application, should endure restarts, and are persisted and read from data sources (DB, file system, network, etc.)
- Have an id (preferably a GUID rather than a DB generated int because business transactions do not rely on persistence, can be persisted after other operations carried out in model's behavior)
- Have entity semantics (equality and `GetHashCode()` defined by class name + id)
- Behavior in an entity mostly orchestrates value objects for a use case
- Entity class should not have public property setters, setting a property should be a behavior method
- Entities should not have bidirectional relations (depending on the bounded context, either an egg can have a chicken or a chicken can have eggs, but not both)
- Entity relations should not reflect the complete set of DB foreign key relationships, should be bare down to the minimum for performing the behavior inside the bounded context
- Entity relations should not hold a reference to another entity class, it can only keep the id of another entity
- If a business transaction needs a reference to other entities in relation, aggregates should be used instead (aggregates can hold a reference to other aggregate roots, which are entity classes by definition)

#### Simple Entity

Entities extend to `Entity` class, have private constructor and public static method called `create`.
The `create` method receives the props which by default is an object with the key `id`.

the entity below is a base example without any kind of validation

```ts

interface UserProps { id?: UID, name: Name, age: Age };

export class User extends Entity<UserProps>{
	private constructor(props: UserProps){
		super(props)
	}

	public static create(props: UserProps): IResult<User> {
		return Result.Ok(new User(props));
	}
}

export default User;

```

`id` is a reserved word and must have the type `UID` or `string`.

All attributes for an entity must be value object except id.

```ts

const nameAttr = Name.create('James');
const ageAttr = Name.create(21);

// always check if value objects are success
const results = Combine([ nameAttr, ageAttr ]);

console.log(results.isOk());

> true

const name = nameAttr.value();

const age = ageAttr.value();

// if you don't provide a value for the id it will be generated automatically
const result = User.create({ name, age });

console.log(result.isOk());

> true

```

#### toObject

when you extend entity class you get some methods from domain class, one of them is `toObject` method.<br>
In the entity, this method aims to transform a domain class into a simple object, that is, all value objects are transformed into simple attributes.

```ts

const user = result.value();

console.log(user.toObject());

> Object
`{
	age: 21,
	name: "James",
	createdAt: "2022-08-13T03:51:25.738Z",
	updatedAt: "2022-08-13T03:51:25.738Z"
	id: "0709220f-7c2f-41e2-b535-151926286893",
 }`

```

#### with id value

you can create an instance by entering an id

```ts

const name = nameAttr.value();

const id = Id('my-id-value-01');

const result = User.create({ id, age, name });

console.log(result.isOk());

> true 

const user = result.value();

console.log(user.toObject());

> Object
`{
	age: 21,
	name: "James",
	id: "my-id-value-01",
	createdAt: "2022-08-13T03:51:25.738Z",
	updatedAt: "2022-08-13T03:51:25.738Z"
 }`

```

#### isNew

Check if instance is a new entity.<br> if you do not provide an id the entity will be considered as a new created entity instance.

```ts

// no id provided
const newUserResult = User.create({ name, age });

cons newUser = newUserResult.value();

console.log(newUser.isNew());

> true

// id provided
const userResult = User.create({ id, name, age });

cons user = userResult.value();

console.log(user.isNew());

> false

```

#### isValidProps

Validating props before create an instance.<br> Here you can apply your business validation.

```ts

public static isValidProps({ name, age }: UserProps): boolean {
	
	// your business validation 
	const isValidName = doSomeBusinessValidation(name);
	const isValidAge = doSomeBusinessValidation(age);

	return isValidName && isValidAge;
}

```

Let's apply our props validation method to our entity class

```ts

interface UserProps { id?: UID, name: Name, age: Age };

export class User extends Entity<UserProps>{
	private constructor(props: UserProps){
		super(props)
	}

	public static isValidProps({ name, age }: UserProps): boolean {
		// your business validation 
		const isValidName = doSomeBusinessValidation(name);
		const isValidAge = doSomeBusinessValidation(age);

		return isValidName && isValidAge;
	}

	public static create(props: UserProps): IResult<User> {

		const isValidRules = User.isValidProps(props);
		if(!isValidRules) return Result.fail('invalid props');

		return Result.Ok(new User(props));
	}
}

export default User;

```

#### change

in entities you can easily change an attribute with `change` or `set` method

```ts

const result = Name.create('Larry');

const newName = result.value();

const changed = user.change("name", newName);

console.log(user.get("name").value());

> "Larry"

console.log(changed);

> true

```

#### Validation before change

The `isValidProps` Method validates properties when creating a new instance, but which method validates before modifying a value?<br>
For this there is the method `validation`

The validation method takes two arguments, the first the `key` of props and the second the `value`.
So when calling the `set` or `change` function, this method will be called automatically to validate the value, if it doesn't pass the validation, the value is not changed.

> There must be a validation for each "props" key

```ts

validation<Key extends keyof Props>(value: Props[Key], key: Key): boolean {

	const options: IPropsValidation<Props> = {
		name: (value: Name) => doSomeBusinessValidation(value),
		age: (value: Age) => doSomeBusinessValidation(value)
	} 

	return options[key](value);
};

```

Let's apply our validation method to our entity.<br> Now if the validation does not pass the value will not be changed.

```ts

interface UserProps { id?: UID, name: Name, age: Age };

export class User extends Entity<UserProps>{
	private constructor(props: UserProps){
		super(props)
	}

	validation<Key extends keyof Props>(value: Props[Key], key: Key): boolean {
		const options: IPropsValidation<Props> = {
			name: (value: Name) => doSomeBusinessValidation(value),
			age: (value: Age) => doSomeBusinessValidation(value)
		} 
		return options[key](value);
	};

	public static isValidProps({ name, age }: UserProps): boolean {
		// your business validation 
		const isValidName = doSomeBusinessValidation(name);
		const isValidAge = doSomeBusinessValidation(age);
		return isValidName && isValidAge;
	}

	public static create(props: UserProps): IResult<User> {

		const isValidRules = User.isValidProps(props);
		if(!isValidRules) return Result.fail('invalid props');

		return Result.Ok(new User(props));
	}
}

export default User;

```

#### disableSetters

To disable the setters of an entity use the parameters below in the super.<br>
This property disables the set function of the entity.

```ts

constructor(props: NameProps){
	super(props, { disableSetters: true })
}

```

#### clone entity

you can clone an entity and get a new instance

```ts

const result = User.create({ id, age, name });

console.log(result.isOk());

> true 

const user = result.value();

 const clonedUser = user.clone();

 const newNameResult = Name.create('Luke');

 const newName = newNameResult.value();

 const changed = clonedUser.set('name').to(newName);

 console.log(user.get('name').value());

 > "James"

 console.log(changed);

 > true

 console.log(clonedUser.get('name').value());

 > "Luke"

```

#### compare entities

You can compare two entities.

`isEqual` just check props values and id value for both instances.

```ts

const isEqual = user1.isEqual(user2);

console.log(isEqual);

> false


```

#### history

Each operation to change any entity state property generates a history.<br>
At any time you can return to a previous state

```ts

const result = User.create({ name, age });

const user = result.value();

console.log(user.toObject());

> Object
`{
	age: 21,
	name: "James",
	createdAt: "2022-08-13T03:51:25.738Z",
	updatedAt: "2022-08-13T03:51:25.738Z",
	id: "0709220f-7c2f-41e2-b535-151926286893"
 }`
 ```

---

### Aggregate

What is aggregate:

- Encapsulate and are composed of entity classes and value objects that change together in a business transaction
- Aggregates are a transactional graph of model objects
- Aggregate root should be an entity, an aggregate can even be a single entity
- Aggregate can keep a reference to other aggregate roots, but not to other entity classes which are not aggregate roots themselves
- Aggregate should not keep a reference to other aggregate root entity classes if those other entities do not change together with this aggregate root entity
- Aggregate can also keep the id of another entity, but keeping too many foreign key ids is a code smell (why?)
- If deleting an entity has a cascade effect on the other entities referenced by class in the object graph, these entities are part of the same aggregate, if not, they should not be inside this aggregate

The aggregate has the same methods already mentioned in the entity.
And in addition to the entity methods, there is another one that is responsible for managing the `domain's events`.

#### Simple Aggregate

```ts

export interface ProductProps {
	id?: UID;
	name: ProductName;
	price: ProductPrice;
	createdAt?: Date;
	updatedAt?: Date;
}

// extends to Aggregate
export class Product extends Aggregate<ProductProps>{
	private constructor(props: ProductProps) {
		super(props);
	}

	public static create(props: ProductProps): IResult<Product> {
		return Result.Ok(new Product(props));
	}
}

export default Product;

```

#### Domain Event

Let's create an aggregate instance and see how to add domain event to it.
Events are stored in memory and are deleted after being triggered.

```ts

const result = Product.create({ name, price });

const product = result.value();

product.addEvent('eventName', (product) => {
	console.log(product.toObject())
});

// dispatch from aggregate instance

product.dispatchEvent("eventName");

```
---
### Adapter

How to adapt the data from persistence to domain or from domain to persistence.

```ts

// from domain to data layer
class MyAdapterToInfra implements IAdapter<DomainUser, DataUser>{
	build(target: DomainUser): Result<DataUser> {
		// ...
	}
}

// from data layer to domain
class MyAdapterToDomain implements IAdapter<DataUser, DomainUser>{
	build(target: DataUser): Result<DomainUser> {
		// ...
	}
}

// You can use adapter instance in toObject function
const myAdapter = new MyAdapterToInfra();

const dataUser = domainUser.toObject<DataUser>(myAdapter);

```
