import { Iterator } from "../../lib/core";

describe('iterator', () => {
	describe('create', () => {
		const iterator: Iterator<number> = Iterator.create();

		it('should add chained', () => {
			iterator.add(1).add(2).add(3).add(4).add(5).add(6).add(7);
			expect(iterator.total()).toBe(7);
		});

		it('should iterate to the items', () => {
			console.log('--------next--------');
			// observable.toFirst();
			// while (observable.hasNext()) {
			// 	console.log(observable.next());
			//  }
			console.log('--------prev--------');
			while (iterator.hasPrev()) {
				console.log(iterator.prev());
			}
			console.log('--------next--------');
			while (iterator.hasNext()) {
				console.log(iterator.next());
			}
			console.log('--------prev--------');
			while (iterator.hasPrev()) {
				console.log(iterator.prev());
			}
			// expect(observable.hasNext()).toBeTruthy();
			// expect(observable.next()).toBe(1);
			// expect(observable.hasNext()).toBeTruthy();
			// expect(observable.next()).toBe(2);
			// expect(observable.hasNext()).toBeTruthy();
			// expect(observable.next()).toBe(3);
			// expect(observable.hasNext()).toBeFalsy();
			// expect(observable.next()).toBe(1);
		});
	});
});
