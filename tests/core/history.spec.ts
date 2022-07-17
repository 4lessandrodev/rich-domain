import { History, ID } from "../../lib/core";

describe('history', () => {

	describe('initial history', () => {

		const makeHistory = (name: string, action: 'create' | 'update') => {
			return {
				props: { name },
				createdAt: new Date(),
				updatedAt: new Date(),
				id: ID.create(),
				action
			}
		}

		const history = new History<{ name: string }>(makeHistory('Jane Doe', 'create'));
		it('should create a initial data as create if provide props', () => {
			expect(history.count()).toBe(1);
		});

		it('should add new history', () => {
			history.snapshot(makeHistory('Janet Lion', 'update'));
			expect(history.count()).toBe(2);
		});

		it('should add new history', () => {
			history.snapshot(makeHistory('Margot Simpson', 'update'));
			expect(history.count()).toBe(3);
		});

		it('should back one step on history', () => {
			const result = history.back();
			expect(result?.props).toEqual({ name: 'Janet Lion' });
		});

		it('should forward one step on history', () => {
			const result = history.forward();
			expect(result?.props).toEqual({ name: 'Margot Simpson' });
		});
	});
});
