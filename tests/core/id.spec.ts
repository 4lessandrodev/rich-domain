import { ID, Id, id } from "../../lib/core"

describe('ID', () => {
	describe('UUID', () => {
		it('should create a new uuid if not provide value', () => {
			const uuid = ID.create();
			expect(uuid).toBeDefined();
			expect(uuid.isNew()).toBeTruthy();
		});

		it('should create different ids', () => {
			const uuid1 = ID.create();
			const uuid2 = ID.create();

			expect(uuid1).not.toEqual(uuid2);
			expect(uuid1.equal(uuid2)).toBeFalsy();
			expect(uuid1.deepEqual(uuid2)).toBeFalsy();
		});

		it('should create a new short id', () => {
			const shortID = ID.short();
			expect(shortID.isNew()).toBeTruthy();
			expect(shortID.isShort()).toBeTruthy();
			expect(shortID.value()).toHaveLength(16);
		});

		it('should create a id with provided value', () => {
			const value = 'UIASA46-ASD5A-ASD54-ASD5GFJS05D';
			const id = ID.create(value);

			expect(id.value()).toBe(value);
			expect(id.isNew()).toBeFalsy();
			expect(id.isShort()).toBeFalsy();
		});

		it('should clone a existing id with success', () => {
			const uuid1 = ID.create();
			const uuid2 = uuid1.clone();
			expect(uuid1.equal(uuid2)).toBeTruthy();
		});

		it('should define short id to 16bytes', () => {
			const shortId = ID.short('shorter');
			expect(shortId.createdAt()).toBeDefined();
			expect(shortId.value()).toHaveLength(16);
		});

		it('should convert number to string', () => {
			const shortId = ID.short(1234567891011124);
			expect(typeof ID.create(1234567891011124).toShort().value() === 'string').toBeTruthy();
			expect(shortId.isShort()).toBeTruthy();
		});

		it('null must not be equal', () => {
			expect(typeof ID.create(null).value() === 'string').toBeTruthy();
			expect(ID.create(null).equal(ID.create())).toBeFalsy();
		});

		it('must be equal', () => {
			const a = ID.create(null);
			const b = ID.create(null);
			expect(a.deepEqual(b)).toBeTruthy();
		});

		it('must clone id as a new one', () => {
			const a = ID.short('LO123RE3MID0193T');
			expect(a.isNew()).toBeFalsy();

			const clone = a.cloneAsNew();
			expect(clone.equal(a)).toBeTruthy();

			expect(clone.isNew()).toBeTruthy();

			expect(clone.deepEqual(a)).toBeFalsy();
		});
	});

	describe('id', () => {

		it('should create a new id', () => {
			const vl = id.create();
			expect(vl.value()).toBeDefined();
		});


		it('should create a new id with value', () => {
			const vl = id.create('my-id-with-value');
			expect(vl.value()).toBe('my-id-with-value');
		});

	});

	describe('Id', () => {

		it('should create a new id', () => {
			const vl = Id();
			expect(vl.value()).toBeDefined();
		});


		it('should create a new id with value', () => {
			const vl = Id('my-id-with-value');
			expect(vl.value()).toBe('my-id-with-value');
		});

	});
})
