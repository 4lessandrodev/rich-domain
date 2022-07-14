import { Iterator } from "../../lib/core";

describe('iterator', () => {
	describe('create with no params', () => {
		const iterator: Iterator<number> = Iterator.create();

		it('should add chained', () => {
			iterator.add(1).add(2).add(3).add(4).add(5).add(6).add(7);
			expect(iterator.total()).toBe(7);
		});

		it('should start on first item', () => {
			const item = iterator.next();
			expect(item).toBe(1);
		});

		it('should do not has prev item', () => {
			expect(iterator.hasPrev()).toBeFalsy();
		});

		it('should remove last item', () => {
			expect(iterator.last()).toBe(7);
			expect(iterator.removeLast().total()).toBe(6);
			expect(iterator.last()).toBe(6);
		});

		it('should remove item from the start', () => {
			expect(iterator.removeFirst().total()).toBe(5);
			expect(iterator.first()).toBe(2);
		});

		it('should get null if iterate after the last', () => {
			iterator.toLast();
			expect(iterator.hasNext()).toBeFalsy();
			expect(iterator.next()).toBeNull();
		});

		it('should has prev item', () => { 
			expect(iterator.hasPrev()).toBeTruthy();
		});

		it('should iterate until the first', () => {
			let iterations = 1;
			while (iterator.hasPrev()) {
				iterator.prev();
				iterations++;
			}
			expect(iterator.hasPrev()).toBeFalsy();
			expect(iterations).toBe(5)
		});

		it('should add to last', () => {
			iterator.addToEnd(9);
			expect(iterator.last()).toBe(9);
			expect(iterator.total()).toBe(6);
		});

		it('should add to start', () => {
			iterator.addToStart(15);
			expect(iterator.first()).toBe(15);
			expect(iterator.total()).toBe(7);
		});

		it('should add new item', () => {
			iterator.add(21);
			expect(iterator.total()).toBe(8);
		});

		it('should iterate until the last', () => {
			iterator.toFirst();
			let iterations = 1;
			while (iterator.hasNext()) {
				iterator.next();
				iterations++;
			}
			expect(iterator.hasNext()).toBeFalsy();
			expect(iterations).toBe(9);
		});

		it('should not to be empty', () => {
			expect(iterator.isEmpty()).toBeFalsy();
		});

		it('should remove all items', () => {
			iterator.clear();
			expect(iterator.total()).toBe(0);
		});

		it('should be empty', () => {
			expect(iterator.isEmpty()).toBeTruthy();
		});
	});

	describe('iterator with initial data', () => {

		it('should be empty', () => {
			const iterator = Iterator.create({ initialData: [] });
			expect(iterator.isEmpty()).toBeTruthy();
			expect(iterator.total()).toBe(0);
		})

		it('should not to be empty', () => {
			const iterator = Iterator.create({ initialData: ['a','b','c'] });
			expect(iterator.isEmpty()).toBeFalsy();
			expect(iterator.total()).toBe(3);
		});
	});

	describe('iterator with reversion', () => {
		it('should return current item on revert', () => {
			const iterator = Iterator.create({
				initialData: ['a', 'b', 'c'],
				returnCurrentOnReversion: true,
			});

			expect(iterator.next()).toBe('a');
			expect(iterator.next()).toBe('b');
			expect(iterator.next()).toBe('c');
			expect(iterator.prev()).toBe('c');
			expect(iterator.prev()).toBe('b');
			expect(iterator.prev()).toBe('a');
			expect(iterator.prev()).toBe(null);
		});
	});

	describe('iterator with loop', () => {
		it('should return current item on revert', () => {
			
			const iterator = Iterator.create({
				initialData: ['a', 'b', 'c'],
				returnCurrentOnReversion: true,
				restartOnFinish: true,
			});

			expect(iterator.next()).toBe('a');
			expect(iterator.next()).toBe('b');
			expect(iterator.next()).toBe('c');
			expect(iterator.prev()).toBe('c');
			expect(iterator.prev()).toBe('b');
			expect(iterator.prev()).toBe('a');
			expect(iterator.prev()).toBe('c');
		});
	});
});
