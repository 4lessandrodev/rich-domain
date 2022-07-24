# Rich Domain

## A lib to build a rich domain with typescript

This lib provide some useful utilities to build a rich domain.

### Value Object

Use value-object as attributes for your entities and aggregates.
Can be used to measure or describe things (name, description, amount, height, date, time, range, address, etc.)

Example:

Use Case: I need a property as number that represents a human age.
The business case: It must be greater than 0 and less than 130.

```ts

import { ValueObject, Result, IResult } from 'rich-domain';

interface Props { value: number };

export class HumanAge extends ValueObject<Props> {
	private constructor(props){
		super(props);
	}

	public static isValidProps({ value }: Props): boolean {
		// validator instance is available on value object instance
		return this.validator.number(value).isBetween(0, 130);
	}

	public static create(props: Props): IResult<ValueObject<Props>> {
		
		const message = `${props.value} is an invalid value`;

		// your business validation
		if(!this.isValidProps(props)) return Result.fail(message);

		return Result.success(new HumanAge(props));
	}
}

```

### Value Object methods

Success methods

```ts

const result = HumanAge.create({ value: 21 });

console.log(result.isSuccess());

> true

const age = result.value();

console.log(age.get('value'));

> 21

age.set('value').to(18);

console.log(age.get('value'));

> 18

console.log(age.history().count());

> 2

// back to old value on history
age.history().back();

console.log(age.get('value'));

> 21

```

Failure methods

```ts

const result = HumanAge.create({ value: 1000 });

console.log(result.isSuccess());

> false

console.log(result.isFailure());

> true

console.log(result.value());

> null 

console.log(result.error());

> "1000 is an invalid value"

```

### Entity

Have an id (preferably a GUID rather than a DB generated int because business transactions do not rely on

```ts

import { Entity, Result, IResult, UID } from 'rich-domain';

// id must be defined on props as optional string or UID. 
// If not provided a new one will be generated.
interface Props { id?: UID; name: Name; age: Age; };

export class User extends Entity<Props> {
	private constructor(props: Props){
		super(props);
	}

	public static create(props: Props): IResult<User> {
		
		// your business validation
		return Result.success(new User(props));
	}
}

```

How to instantiate an entity

```ts

// create entity attributes

const attrAge = Age.create({ value: 21 });
const attrName = Name.create({ value: 'Jane Doe' });

// validate attributes for all value objects
const result = Result.combine([ attrAge, attrName ]);

console.log(result.isSuccess());

> true

const age = attrAge.value();
const name = attrName.value();

const user = User.create({ age, name });

console.log(user.value().toObject());

> Object
{ 
	age: 21 ,
	name: "Jane Doe", 
	createdAt: "2022-07-17T18:06:35.986Z",
	updatedAt: "2022-07-17T18:06:35.986Z",
	id: "51ac507e-78e3-433e-8c72-c807d4ee6c4c"
}

```

### Aggregate

Encapsulate and are composed of entity classes and value objects that change together in a business transaction.

```ts

import { Aggregate, Result, IResult, UID } from 'rich-domain';

// id must be defined on props as optional string or UID. 
// If not provided a new one will be generated.
interface Props { id?: UID; name: Name; price: Currency }

export class Product extends Aggregate<Props> {
	private constructor(props: Props){
		super(props);
	}

	public static create(props: Props): IResult<Product> {
		
		// your business validation
		return Result.success(new Product(props));
	}
}

```

### Domain Events

You can add event to the aggregates.
Events are stored in memory and deleted after dispatch.

```ts

import { DomainEvents, IHandle } from 'rich-domain';

class ProductCreated implements IHandle<Product> {
	// optional custom name. default is the className
	eventName: string = 'CustomEventName';

	async dispatch(event: IDomainEvent<Product>): Promise<void> {

		// logic goes here. do something important
		console.log(event);
	}
}

const result = Product.create({ name, price });

const product = result.value();

const event = new ProductCreated();

product.addEvent(event);

// dispatch event
DomainEvents.dispatch({ eventName: 'CustomEventName', id: product.id });

```

### Result

Ensure application never throws

Return success

```ts

Result<Payload, Error, MetaData>

let result: Result<string, string, { foo: string }>;

result = Result.success("hello world", { foo: 'bar' });

// Check status
console.log(result.isSuccess());

> true

console.log(result.value());

> "hello world"

console.log(result.metaData());

> Object { foo: "bar" }

// if success, the error will be null

console.log(result.error());

> null

```

Return failure

```ts


result = Result.fail("something went wrong!", { foo: 'bar' });

// Check status
console.log(result.isFailure());

> true

console.log(result.metaData());

> Object { foo: "bar" }

console.log(result.error());

> "something went wrong!"

// if failure, the payload data will be null

console.log(result.value());

> null


```


Hooks on fail or success:

```ts

import { ICommand, Result } from 'rich-domain';

class Logger implements ICommand<string, void> {
	execute(message: string): void {
		console.log(message);
	}
}

const logger = new Logger();

const result = Result.fail('Something went wrong!');

result.execute(logger).withData(result.error()).on('fail');

> "Something went wrong!"


```

### ID

Id use uuid or short uuid. the type of ID is UID

```ts

const id = ID.create();

console.log(id.value());

> "8fbe674f-d31f-4769-850f-2815f485fe89"

// If you provide a value a id will be generated with

const id2 = ID.create(id.value());

console.log(id2.value());

> "8fbe674f-d31f-4769-850f-2815f485fe89"

// Compare

console.log(id.equal(id2))

> true

```

### Short ID

16bytes based on uuid. the type of Short ID is UID

```ts

const id = ID.createShort();

console.log(id.value());

> "LO123RE3MID0193T"

```

### Adapter

How to adapt the data from persistence to domain or from domain to persistence.

```ts

import { IAdapter, Result } from 'rich-domain';

// from domain to data layer
class MyAdapterA implements IAdapter<DomainUser, DataUser>{
	build(target: DomainUser): Result<DataUser> {
		// ...
	}
}

// from data layer to domain
class MyAdapterB implements IAdapter<DataUser, DomainUser>{
	build(target: DataUser): Result<DomainUser> {
		// ...
	}
}

// you also may use adapter in toObject function.

const myAdapter = new MyAdapterA();

domainUser.toObject<Model>(myAdapter);

```

### Advanced concepts

How to validate props on set value.

```ts

import { ValueObject, IPropsValidation, Result } from 'rich-domain';

interface Props { value: number };

// Here we have a super smart value object
class HumanAge extends ValueObject<Props> {
	private constructor(props: Props){
		super(props);
	}

	// the "set" function automatically will use this method to validate value before set it.
	validation<Key extends keyof Props>(key: Key, value: Props[Key]): boolean {

		// validator instance is available on value object instance
		const { isNumber, number } = this.validator;

		const options: IPropsValidation<Props> = {
			value: (value: number) => isNumber(value) && number.isBetween(0, 130),
		} 

		return options[key](value);
	};

	// the "create" function must use this method to validate props before instantiate.
	public static isValidProps({ value }: Props): boolean {

		// validator instance is available on value object instance
		const { isNumber, number } = this.validator;

		return isNumber(value) && number.isBetween(0, 130),
	}

	public static create(props: Props): IResult<ValueObject<Props>> {
		
		const message = `${props.value} is an invalid value`;

		// your business validation
		if(!this.isValidProps(props)) return Result.fail(message);

		return Result.success(new HumanAge(props));
	}
}

```

Using value objects with advanced validations

```ts

// example how to use.

const failExample = HumanAge.create({ value: 1000 });

console.log(failExample.isFailure());

> true

console.log(failExample.value());

> null

const successExample = HumanAge.create({ value: 21 });

console.log(successExample.isSuccess());

> true

const age = successExample.value();

console.log(age.get('value'));

> 21

// do nothing on try set an invalid value

age.set('value').to(720);

console.log(age.get('value'));

> 21

// change if provide a valid value

age.set('value').to(72);

console.log(age.get('value'));

> 72

```

### How to disable getters and setters

Disable getters for all keys on instance.
On try to get a value for any key the value will be null.

```ts

import { ISettings, ValueObject } from 'rich-domain';

const options: ISettings = {
	disableGetters: true, 
	disableSetters: true
}

class HumanAge extends ValueObject<Props> {
	private constructor(props: Props){
		super(props, options);
	}
}

```

How to disable setter for a specific key.
Just provide false for prop you want to disable on `validation`

```ts

import { ISettings, ValueObject } from 'rich-domain';

interface Props { value: number; birthDay: Date };

class HumanAge extends ValueObject<Props> {
	private constructor(props: Props){
		super(props);
	}

	// the "set" function automatically will use this method to validate value before set it.
	validation<Key extends keyof Props>(key: Key, value: Props[Key]): boolean {

		const { isDate } = this.validator;

		const options: IPropsValidation<Props> = {
			// on define false to the prop, It never will be set.
			value: _ => false,
			birthDay: (date) => isDate(date)
		} 

		return options[key](value);
	};

	public static create(props: Props): IResult<ValueObject<Props>> {			
		return Result.success(new HumanAge(props));
	}
}

```

Example

```ts

const result = HumanAge.create({ value: 21, birthDay: new Date('2001-07-24T14:46:35.808Z') });

const age = result.value();

console.log(age.get('value'));

> 21

console.log(age.get('birthDay'));

> "2001-07-24T14:46:35.808Z"

// if try to change value...

age.set('value').to(55);

console.log(age.get('value'));

> 21 // no changes

// but if you try to change the birthDay attribute...

age.set('birthDay').to(new Date());

console.log(age.get('birthDay'));

> "2022-07-24T14:46:35.808Z" // changes

```
