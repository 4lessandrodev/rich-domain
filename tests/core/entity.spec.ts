import { Entity, Fail, Id, Ok, Result, ValueObject } from "../../lib/core";
import { Adapter, IResult, UID } from "../../lib/types";

describe("entity", () => {

	describe("simple entity", () => {

		interface Props { id?: string, foo: string };

		class EntitySample extends Entity<Props> {
			private constructor(props: Props) {
				super(props);
			}

			public isValidProps(value: any): boolean {
				return value !== undefined;
			}

			public static create(props: Props): IResult<EntitySample | null> {
				if(!props) return Fail('props is required')
				return Result.Ok(new EntitySample(props))
			}
		}

		it('should get prototype', () => {
			const ent = EntitySample.create({ foo: 'bar' });

			ent.value()?.change('foo', 'changed');
			expect(ent.isOk()).toBeTruthy();
		});
	});

	describe('toObject', () => {

		class En extends Entity<{ key: string }> {
			private constructor(props: { key: string }) {
				super(props)
			}
		}

		const id = '973e6c78-6771-4a86-ba55-f759a1e68f8c';

		const entity = En.create(
			{
				id,
				key: 'value',
				createdAt: new Date('2022-07-20T15:46:54.373Z'),
				updatedAt: new Date('2022-07-20T15:46:54.373Z')
			}
		);

		it('should get object with success', () => {
			expect(entity.value().toObject()).toEqual({
				id,
				key: 'value',
				createdAt: new Date('2022-07-20T15:46:54.373Z'),
				updatedAt: new Date('2022-07-20T15:46:54.373Z')
			});
		});

		it('should get hash code with success', () => {
			expect(entity.value().hashCode().value()).toBe('[Entity@En]:973e6c78-6771-4a86-ba55-f759a1e68f8c');
		});

		it('should clone entity with success and keep the same id', () => {
			const clone = entity.value().clone();
			expect(clone.id.value()).toBe(id);
			expect(clone.get('key')).toBe('value');
		});

		it('should return fail if provide null props', () => {
			const result = En.create(null);
			expect(result.isFail()).toBeTruthy();
		});
	});


	describe('toObject -> playing with prototypes', () => {
		interface PersonProps {
			name: Username
			age: Age
			married: boolean
		}
		class Username extends ValueObject<string> { }
		class Age extends ValueObject<number> { }
		class Person extends Entity<PersonProps> { }

		let person: Person

		beforeEach(() => {
			person = new Person({
				age: new Age(20),
				married: false,
				name: new Username('John Doe')
			})
		})
		it('should access resolved primitive values prototype', () => {
			/**
			 * Since we have access to the resolved primitive value
			 * returned by the `toObject` method, we can access the
			 * prototype of the resolved value and manipulate it.
			 * 
			 * Point here is that if we can consume it prototype that means typescript is infering the correct type.
			 */
			const personObject = person.toObject();

			const defaultPersonName = 'John Doe';
			const personObjectName = personObject.name

			expect(personObjectName).toBe(defaultPersonName);
			expect(personObjectName.length).toBe(defaultPersonName.length);
			expect(personObjectName.concat('2')).toBe('John Doe2');
			expect(personObjectName.includes('John')).toBeTruthy();
			expect(personObjectName.indexOf('Doe')).toBe(5);
			expect(personObjectName.lastIndexOf('Doe')).toBe(5);
			expect(personObject.age.toExponential()).toBe('2e+1');
			expect(personObject.age.toFixed()).toBe('20');
			expect(personObject.age.toPrecision()).toBe('20');
			expect(personObject.age.toString()).toBe('20');
			expect(personObject.age.valueOf()).toBe(20);

			expect(personObject.married.valueOf()).toBe(false);



		})
	})

	describe('toObject -> Deep nested readonly properties', () => {
		interface PersonProps {
			fullname: Fullname
			skills: Skill[]
			age: number
		}
		class Skill extends ValueObject<string> { }
		class Fullname extends ValueObject<{ firstName: Username, lastName: Username }> { }
		class Username extends ValueObject<string> { }
		class Person extends Entity<PersonProps> { }

		let person: Person

		beforeEach(() => {
			person = new Person({
				age: 20,
				skills: [new Skill('JS'), new Skill('TS')],
				fullname: new Fullname({
					firstName: new Username('John'),
					lastName: new Username('Doe')
				})
			})
		})

		it('should not be able to mutate any level of data on personObject', () => {
			/**
			 * Typescript it self already infered an DeepReadonly type on any level of the object.
			 * So, at type checking level you cant even try to set a new value to any property.
			 * 
			 * BUT, at runtime, we should still have the same behavior. That means we'll check if 
			 * the object is really immutable.
			 */
			const personObject = person.toObject();
			expect(Object.isFrozen(personObject)).toBeTruthy();
			expect(Object.isFrozen(personObject.fullname)).toBeTruthy();
			expect(Object.isFrozen(personObject.skills)).toBeTruthy();


			expect(() => (personObject as any).age = 22).toThrowError();
			expect(() => (personObject as any).fullname = 'new value').toThrowError();
			expect(() => (personObject as any).fullname.firstName = 'new value').toThrowError();
			expect(() => (personObject as any).fullname.lastName = 'new value').toThrowError();
			expect(() => (personObject as any).skills = []).toThrowError();
			expect(() => (personObject as any).skills[0] = 'new value').toThrowError();
			expect(() => (personObject as any).skills.push('PYTHON')).toThrowError();


		});
	})
	describe('toObject -> Entity with value objects of different types, arrays, dates, strings, objects, etc.', () => {
		class ActivitiesName extends ValueObject<string> { }
		class Description extends ValueObject<string> { }
		class CorporateName extends ValueObject<string> { }
		class FantasyName extends ValueObject<string> { }

		// NESTED VALUE OBJECT
		class Activities extends ValueObject<{
			name: ActivitiesName
			done: boolean
		}> { }

		class User extends Entity<{
			name: string
			age: number
		}> { }
		class Company extends Entity<{
			corporateName: CorporateName
			fantasyName: FantasyName
		}> { }
		interface LeadProps {
			crmId: string
			user: User
		}
		class Lead extends Entity<LeadProps> { }
		interface ProposalProps {
			description: Description // value object
			activities: Activities[] // list of value objects
			lead: Lead // entity inside entity which has another entity inside
			companies: Company[] // list of entities
			deadline: Date // object
			budget: number // primitive number
			isApproved: boolean // primitive boolean
			//...
		}

		class Proposal extends Entity<ProposalProps> { }

		let proposal: Proposal

		beforeEach(() => {
			const activities = [
				new Activities({ name: new ActivitiesName('Activity 1'), done: true, }),
				new Activities({ name: new ActivitiesName('Activity 2'), done: false, })
			]

			const user = new User({ name: 'John Doe', age: 20, })

			const lead = new Lead({ crmId: '123', user })

			const companies = [
				new Company({ corporateName: new CorporateName('Company 1'), fantasyName: new FantasyName('Fantasy 1') }),
				new Company({ corporateName: new CorporateName('Company 2'), fantasyName: new FantasyName('Fantasy 2') })
			]

			proposal = new Proposal({
				activities,
				companies,
				budget: 2000,
				deadline: new Date(),
				description: new Description('Proposal description'),
				isApproved: false,
				lead
			})
		})

		it('should return object with all values', () => {
			const proposalObject = proposal.toObject();
			expect(proposalObject).toEqual({
				id: expect.any(String),
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),

				activities: [
					{ name: 'Activity 1', done: true },
					{ name: 'Activity 2', done: false }
				],
				companies: [
					{
						corporateName: 'Company 1',
						fantasyName: 'Fantasy 1',
						createdAt: expect.any(Date),
						updatedAt: expect.any(Date),
						id: expect.any(String)
					},
					{
						corporateName: 'Company 2',
						fantasyName: 'Fantasy 2',
						createdAt: expect.any(Date),
						updatedAt: expect.any(Date),
						id: expect.any(String)
					}
				],
				budget: 2000,
				deadline: expect.any(Date),
				description: 'Proposal description',
				isApproved: false,
				lead: {
					id: expect.any(String),
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),

					crmId: '123',
					user: {
						id: expect.any(String),
						createdAt: expect.any(Date),
						updatedAt: expect.any(Date),
						name: 'John Doe',
						age: 20,
					}
				}
			});
		});


		describe('should access props', () => {
			it('should access activities', () => {
				const proposalObject = proposal.toObject();
				expect(proposalObject.activities).toEqual([
					{ name: 'Activity 1', done: true },
					{ name: 'Activity 2', done: false }
				]);

				expect(proposalObject.activities[0].name).toBe('Activity 1');
				expect(proposalObject.activities[0].done).toBe(true);
			})

			it('should access companies', () => {
				const proposalObject = proposal.toObject();
				expect(proposalObject.companies).toEqual([
					{
						corporateName: 'Company 1',
						fantasyName: 'Fantasy 1',
						createdAt: expect.any(Date),
						updatedAt: expect.any(Date),
						id: expect.any(String)
					},
					{
						corporateName: 'Company 2',
						fantasyName: 'Fantasy 2',
						createdAt: expect.any(Date),
						updatedAt: expect.any(Date),
						id: expect.any(String)
					}
				]);
				expect(proposalObject.companies[0].corporateName).toBe('Company 1');
				expect(proposalObject.companies[0].fantasyName).toBe('Fantasy 1');
			})

			it('should access lead', () => {
				const proposalObject = proposal.toObject();
				expect(proposalObject.lead).toEqual({

					id: expect.any(String),
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
					crmId: '123',
					user: {
						id: expect.any(String),
						createdAt: expect.any(Date),
						updatedAt: expect.any(Date),
						name: 'John Doe',
						age: 20,
					}
				});

				expect(proposalObject.lead.crmId).toBe('123');
				expect(typeof proposalObject.lead.user.id).toBe('string');
				expect(proposalObject.lead.user.name).toBe('John Doe');
				expect(proposalObject.lead.user.age).toBe(20);
				expect(proposalObject.lead.user.createdAt).toEqual(expect.any(Date));
			})

			it('should access primitive props and plain objects', () => {
				const proposalObject = proposal.toObject();
				expect(proposalObject.budget).toBe(2000);
				expect(proposalObject.deadline).toEqual(expect.any(Date));
				expect(proposalObject.description).toBe('Proposal description');
				expect(proposalObject.isApproved).toBe(false);
			})
		});
	})

	describe('toObject -> Entity with single value object', () => {
		interface PersonProps {
			name: string
			age: number
			married: boolean
			skills: string[]
		}
		class Person extends Entity<PersonProps> { }

		let person: Person

		beforeEach(() => {
			person = new Person({ age: 20, married: false, name: 'John Doe', skills: ['JS', 'TS'] })
		})

		it('should return object with all values', () => {
			const personObject = person.toObject();
			expect(personObject).toEqual({
				id: expect.any(String),
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
				age: 20,
				married: false,
				name: 'John Doe',
				skills: ['JS', 'TS']
			});
		});

		it('should access props', () => {
			const personObject = person.toObject();
			expect(personObject.age).toBe(20);
			expect(personObject.married).toBe(false);
			expect(personObject.name).toBe('John Doe');
			expect(personObject.skills).toEqual(['JS', 'TS']);
		});
	})
	describe('toObject -> Entity with multiple value objects, and each value object with more than one attribute.', () => {
		interface PersonProps {
			name: Fullname
			address: Address
		}
		class Fullname extends ValueObject<{
			firstName: string
			lastName: string
		}> { }
		class Address extends ValueObject<{
			street: string
			city: string
			zip: string
		}> { }
		class Person extends Entity<PersonProps> { }

		let person: Person

		beforeEach(() => {
			person = new Person({
				address: new Address({ city: 'New York', street: '5th Ave', zip: '10001' }),
				name: new Fullname({ firstName: 'John', lastName: 'Doe' })
			})
		})

		it('should return object with all values', () => {
			const personObject = person.toObject();
			expect(personObject).toEqual({
				id: expect.any(String),
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
				address: { city: 'New York', street: '5th Ave', zip: '10001' },
				name: { firstName: 'John', lastName: 'Doe' }
			});
		});

		it('should access props', () => {
			const personObject = person.toObject();
			expect(personObject.address).toEqual({ city: 'New York', street: '5th Ave', zip: '10001' });
			expect(personObject.name).toEqual({ firstName: 'John', lastName: 'Doe' });

			expect(personObject.address.city).toBe('New York');
			expect(personObject.address.zip).toBe('10001');
			expect(personObject.address.street).toBe('5th Ave');
			expect(personObject.name.firstName).toBe('John');
			expect(personObject.name.lastName).toBe('Doe');
		});
	})
	describe('toObject -> Entity with more than one value object, and each value object with a single attribute.', () => {
		interface PersonProps {
			name: Username
			age: Age
			married: boolean
		}
		class Username extends ValueObject<string> { }
		class Age extends ValueObject<number> { }
		class Person extends Entity<PersonProps> { }

		let person: Person

		beforeEach(() => {
			person = new Person({
				age: new Age(20),
				married: false,
				name: new Username('John Doe')
			})
		})

		it('should return object with all values', () => {
			const personObject = person.toObject();
			expect(personObject).toEqual({
				id: expect.any(String),
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
				age: 20,
				married: false,
				name: 'John Doe'
			});
		});

		it('should access props', () => {
			const personObject = person.toObject();
			expect(personObject.age).toBe(20);
			expect(personObject.married).toBe(false);
			expect(personObject.name).toBe('John Doe');
		});
	})

	describe("should accept validation without error", () => {
		interface Props { id?: string, foo: string };

		class EntitySample extends Entity<Props> {
			private constructor(props: Props) {
				super(props);
			}

			validation<Key extends keyof Props>(_value: Props[Key], _key: Key): boolean {
				return _key === 'foo';
			}

			public isValidProps(value: any): boolean {
				return value !== undefined;
			}

			public static create(props: Props): IResult<EntitySample> {
				return Result.Ok(new EntitySample(props))
			}
		}

		it('should get prototype', () => {
			const ent = EntitySample.create({ foo: 'bar' });

			ent.value().change('foo', 'changed');
			expect(ent.isOk()).toBeTruthy();

			const throws = () => ent.value().change('id', 'changed');
			expect(throws).toThrowError();
		});

		it('should set prototype', () => {
			const ent = EntitySample.create({ foo: 'bar' });
			expect(ent.isOk()).toBeTruthy();
			expect(ent.value().get('foo')).toBe('bar');
			ent.value().set('foo').to('changed');
			expect(ent.value().get('foo')).toBe('changed');
		});

		it('should create many entities', () => {
			const payload = EntitySample.createMany([]);
			expect(payload.result.isFail()).toBeTruthy();
		});
	});

	describe('compare', () => {

		interface Val {
			name: string;
		}

		interface Props {
			id?: UID;
			key: number;
			values: Array<Val>;
		}

		class EntityExample extends Entity<Props> {
			private constructor(props: Props) {
				super(props)
			}

			public static create(props: Props): Result<EntityExample> {
				return Ok(new EntityExample(props));
			}
		}

		it("should to be equal", () => {

			const props: Props = { key: 200, values: [{ name: 'abc' }, { name: 'def' }] };
			const id = Id();

			const a = EntityExample.create({ ...props, id }).value();
			const b = EntityExample.create({ ...props, id }).value();

			expect(a.isEqual(b)).toBeTruthy();
		});

		it("should to be equal", () => {

			const id = Id();
			const props: Props = { key: 200, values: [{ name: 'abc' }, { name: 'def' }] };

			const a = EntityExample.create({ ...props, id }).value();
			const b = a.clone();

			expect(a.isEqual(b)).toBeTruthy();
		});

		it("should not to be equal if change state", () => {

			const id = Id();
			const props: Props = { key: 200, values: [{ name: 'abc' }, { name: 'def' }] };

			const a = EntityExample.create({ ...props, id }).value();
			const b = a.clone();
			b.set('key').to(201);

			expect(a.isEqual(b)).toBeFalsy();
		});

		it("should not to be equal if state is different", () => {

			const id = Id();
			const propsA: Props = { id, key: 200, values: [{ name: 'abc' }, { name: 'def' }] };
			const propsB: Props = { id, key: 200, values: [{ name: 'abc' }, { name: 'dif' }] };

			const a = EntityExample.create(propsA).value();
			const b = EntityExample.create(propsB).value();

			expect(a.isEqual(b)).toBeFalsy();
		});

		it("should not to be equal if id is different", () => {

			const propsA: Props = { key: 200, values: [{ name: 'abc' }, { name: 'def' }] }
			const propsB: Props = { key: 200, values: [{ name: 'abc' }, { name: 'dif' }] }

			const a = EntityExample.create(propsA).value();
			const b = EntityExample.create(propsB).value();

			expect(a.isEqual(b)).toBeFalsy();
		});

		it("should compare null and undefined", () => {

			const propsA: Props = { key: 200, values: [{ name: 'abc' }, { name: 'def' }] };
			const a = EntityExample.create(propsA).value();
			expect(a.isEqual(null as unknown as EntityExample)).toBeFalsy();
			expect(a.isEqual(undefined as unknown as EntityExample)).toBeFalsy();
		});
	});
	describe("util", () => {

		interface Props { id?: string, foo: string };

		class ValSamp extends Entity<Props> {
			private constructor(props: Props) {
				super(props);
			}

			public static isValidProps(value: string): boolean {
				return this.validator.string(value).hasLengthBetween(3, 50);
			}

			RemoveSpace(): string {
				return this.util.string(this.props.foo).removeSpaces();
			}

			public static create(props: Props): IResult<ValSamp | null> {
				const isValid = this.isValidProps(props.foo);
				if (!isValid) return Result.fail('Erro');
				return Result.Ok(new ValSamp(props))
			}
		}

		it('should fail if provide an invalid value', () => {
			const ent = ValSamp.create({ foo: '' });
			expect(ent.isFail()).toBeTruthy();
		});

		it('should remove space from value', () => {
			const ent = ValSamp.create({ foo: ' Some Value With Spaces ' });
			expect(ent.isOk()).toBeTruthy();
			expect(ent.value()?.RemoveSpace()).toBe('SomeValueWithSpaces');
		});
	});

	describe('toObject', () => {
		it('should infer types to aggregate on toObject method', () => {

			class Name extends ValueObject<{ value: string }> {
				private constructor(props: { value: string }) {
					super(props)
				}

				public static create(value: string): Result<Name> {
					return Ok(new Name({ value }));
				}
			}

			interface Props {
				id?: UID;
				price: number;
				name: Name;
				additionalInfo: string[];
				createdAt?: Date;
				updatedAt?: Date;
			};

			class Product extends Entity<Props> {
				private constructor(props: Props) {
					super(props)
				}
				public static create(props: Props): Result<Product> {
					return Ok(new Product(props));
				}
			}

			const name = Name.create('orange').value();
			const props: Props = { name, additionalInfo: ['from brazil'], price: 10 };
			const orange = Product.create(props).value();

			const object = orange.toObject();
			expect(object.additionalInfo).toEqual(['from brazil']);
			expect(object.name).toEqual({ value: 'orange' });
			expect(object.price).toBe(10);
			expect(object.name.value).toBe('orange');
		});
	});

	describe('clone', () => {

		interface Props {
			id?: UID;
			price: number;
			additionalInfo: string[];
			createdAt?: Date;
			updatedAt?: Date;
		};

		class Product extends Entity<Props> {
			private constructor(props: Props) {
				super(props)
			}
			public static init(props: Props): Product {
				return new Product(props);
			}
		}

		class User extends Entity<string> {
			private constructor(props: string) {
				super(props)
			}
			public static init(name: string): User {
				return new User(name);
			}
		}

		it('should clone string with success', () => {
			const product = Product.init({
				additionalInfo: ['lorem'],
				price: 20,
				id: Id('c77ef877-7ce1-4fa0-9d98-394762d58ce8'),
				createdAt: new Date('2024-05-01T19:07:45.698Z'),
				updatedAt: new Date('2024-05-01T19:07:45.698Z')
			});
			const copy = product.clone({ price: 21 });
			expect(copy.toObject()).toMatchInlineSnapshot(`
Object {
  "additionalInfo": Array [
    "lorem",
  ],
  "createdAt": 2024-05-01T19:07:45.698Z,
  "id": "c77ef877-7ce1-4fa0-9d98-394762d58ce8",
  "price": 21,
  "updatedAt": 2024-05-01T19:07:45.698Z,
}
`);
		});

		it('should clone string with success', () => {
			const product = Product.init({
				additionalInfo: ['lorem'],
				price: 20,
				id: Id('c77ef877-7ce1-4fa0-9d98-394762d58ce8'),
				createdAt: new Date('2024-05-01T19:07:45.698Z'),
				updatedAt: new Date('2024-05-01T19:07:45.698Z')
			});
			const copy = product.clone({ additionalInfo: ['TESTING...'] });
			expect(copy.toObject()).toMatchInlineSnapshot(`
Object {
  "additionalInfo": Array [
    "TESTING...",
  ],
  "createdAt": 2024-05-01T19:07:45.698Z,
  "id": "c77ef877-7ce1-4fa0-9d98-394762d58ce8",
  "price": 20,
  "updatedAt": 2024-05-01T19:07:45.698Z,
}
`);
		});

		it('should clone string with success', () => {
			const product = Product.init({
				additionalInfo: ['lorem'],
				price: 20,
				id: Id('c77ef877-7ce1-4fa0-9d98-394762d58ce8'),
				createdAt: new Date('2024-05-01T19:07:45.698Z'),
				updatedAt: new Date('2024-05-01T19:07:45.698Z')
			});
			const copy = product.clone();
			expect(copy.toObject()).toMatchInlineSnapshot(`
Object {
  "additionalInfo": Array [
    "lorem",
  ],
  "createdAt": 2024-05-01T19:07:45.698Z,
  "id": "c77ef877-7ce1-4fa0-9d98-394762d58ce8",
  "price": 20,
  "updatedAt": 2024-05-01T19:07:45.698Z,
}
`);
		});

		it('should throw an error if props is not object for entities', () => {
			const build = () => User.init('Jane');
			expect(build).toThrowError();
		});
	});

	describe('init', () => {
		type Props = { name: string };
		class User extends Entity<Props> {
			private constructor(props: Props) {
				super(props);
			}

			public static init(props: Props): User {
				if (props.name.length < 2) throw new Error('invalid name');
				return new User(props);
			}
		}

		class UAdapter implements Adapter<User, Props> {
			adaptOne(item: User): Props {
				return { name: item.get('name') }
			}
		}

		it('should init a new user', () => {
			const user = User.init({ name: 'Jane' });
			const model = user.toObject(new UAdapter());
			expect(model).toEqual({ name: 'Jane' });
		});

		it('should throw an error', () => {
			const init = () => User.init({ name: '' });
			expect(init).toThrowError();
		});
	});

	describe('native init', () => {
		class User extends Entity<string> { };

		it('should throw if method is not implemented', () => {
			const init = () => User.init('Jane');
			expect(init).toThrowError('method not implemented: init');
		});

	});
});
