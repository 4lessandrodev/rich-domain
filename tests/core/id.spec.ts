import { ID } from "../../lib/core"

describe('ID', () => {
	describe('UUID', () => {
		it('should create a new uuid if not provide value', () => {
			const uuid = ID.create();
			expect(uuid).toBeDefined();
			expect(uuid.isNew).toBeTruthy();
		});

		it('should create different ids', () => {
			const uuid1 = ID.create();
			const uuid2 = ID.create();

			expect(uuid1).not.toEqual(uuid2);
			expect(uuid1.equal(uuid2)).toBeFalsy();
			expect(uuid1.deepEqual(uuid2)).toBeFalsy();
		});

		it('should create a new short id', () => {
			const shortID = ID.createShort();
			expect(shortID.isNew).toBeTruthy();
			expect(shortID.isShortID()).toBeTruthy();
			expect(shortID.value).toHaveLength(16);
		});

		it('should create a id with provided value', () => {
			const value = 'UIASA46-ASD5A-ASD54-ASD5GFJS05D';
			const id = ID.create(value);

			expect(id.value).toBe(value);
			expect(id.isNew).toBeFalsy();
			expect(id.isShortID()).toBeFalsy();
		});

		it('should clone a existing id with success', () => {
			const uuid1 = ID.create();
			const uuid2 = uuid1.clone();
			expect(uuid1.equal(uuid2)).toBeTruthy();
		});
	})
})
