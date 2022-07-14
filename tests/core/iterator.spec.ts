import { Iterator } from "../../lib/core";

describe('iterator', () => {
	describe('create', () => {
		const iterator: Iterator<number> = Iterator.create();

		it('should add chained', () => {
			iterator.add(1).add(2).add(3).add(4).add(5).add(6).add(7);
			expect(iterator.total()).toBe(7);
		});

		it('should start on first item', () => {
			const item = iterator.next();
			expect(item).toBe(1);
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
	});
});
