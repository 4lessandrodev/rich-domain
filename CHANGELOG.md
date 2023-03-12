# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

---

### [1.17.2] - 2022-03-12

### Added

- added: event handler callback

```ts

user.dispatchEvent('EventName', handler);

```

---

### [1.17.1] - 2022-01-27

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

### [1.17.0] - 2022-01-21

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

### [1.16.3] - 2022-01-20

### Added

- Util: added method date. [pull request 32](https://github.com/4lessandrodev/rich-domain/pull/32)

---

### [1.16.2] - 2022-01-19

### Added

- Aggregate, Entity, ValueObject: added `util` method to instance.
- Util: added class to domain with some utils functions. [pull request 31](https://github.com/4lessandrodev/rich-domain/pull/31)

---

### [1.16.1] - 2022-01-18

### Added

- Aggregate: added method `dispatchEvent` to handle domain events from aggregate instance.
- Validator: added method `isSpecialChar` and `hasSpecialChar` to check special character.

---

### [1.16.0] - 2022-01-12

### Added

- Entity: added method `isEqual` to compare current instance with another one.
- ValueObject: added method `isEqual` to compare current instance with another one. [Issue 27](https://github.com/4lessandrodev/rich-domain/issues/27)

---
### [1.15.2] - 2022-01-05

### Fixed

- toObject method on entity: fix error on process simple object on entity [issue #25](https://github.com/4lessandrodev/rich-domain/issues/25)

---
### [1.15.1] - 2022-01-03

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

- AutoMapper: fix convertion for aggregate
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
