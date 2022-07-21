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

	public static create(props: Props): IResult<HumanAge> {
		
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

import { Entity, Result, IResult } from 'rich-domain';

interface Props { name: Name; age: Age; };

export class User extends Entity<Props> {
	private constructor(props: Props, id?: string){
		super(props, id);
	}

	public static create(props: Props, id?: string): IResult<User> {
		
		// your business validation
		return Result.success(new User(props, id));
	}
}

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

import { Aggregate, Result, IResult } from 'rich-domain';

interface Props { name: Name, price: Currency }

export class Product extends Aggregate<Props> {
	private constructor(props: Props, id?: string){
		super(props, id);
	}

	public static create(props: Props, id?: string): IResult<Product> {
		
		// your business validation
		return Result.success(new Product(props, id));
	}
}

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

// if success error will be null

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

// if failure payload data will be null

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

Id use uuid or short uuid

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

16bytes based on uuid

```ts

const id = ID.createShort();

console.log(id.value());

> "LO123RE3MID0193T"

```
