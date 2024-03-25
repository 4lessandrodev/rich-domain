import { UUID } from '../../lib/core/crypto';

describe('randomUUID', () => {
	it('should generate random uuid', () => {
		const id = UUID();
		expect(id).toHaveLength(36);
	});

	it('should generate many unique', () => {
		const map = new Map();

		let i = 0;
		while (i < 300) {
			map.set(i, UUID());
			i++;
		}
		expect(map.size).toBe(300);
	});

	it('should to have uuid v4 pattern', () => {
		//f81d4fae-7dec-11d0-a765-00a0c91e6bf6
		const id = UUID();
		expect(id).toMatch(/.{8}\-.{4}\-.{4}\-.{4}\-.{12}$/)
	})
});
