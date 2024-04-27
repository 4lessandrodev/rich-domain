import { GettersAndSetters } from '../../lib/core/index';
describe('getters and setters', () => {

	class Def extends GettersAndSetters<any>{
		getConfig() {
			return this.config;
		}
	};

	it('should be active by default', () => {

		const gettersAndSetters = new Def({}, 'ValueObject');

		expect(gettersAndSetters.getConfig()).toEqual({
			disableGetters: false,
			disableSetters: false
		});
	});

	it('should be disabled if provide param', () => {
		const gettersAndSetters = new Def({}, 'ValueObject', {
			disableGetters: false,
			disableSetters: false
		});
		expect(gettersAndSetters.getConfig()).toEqual({ disableGetters: false, disableSetters: false });
	});

	it('should get null if getter is deactivate', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: 'value' }>({ key: 'value' }, 'ValueObject', {
			disableGetters: true
		});
		expect(() => gettersAndSetters.get('key')).toThrowError();
	});

	it('should set nothing if setter is deactivate', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' }, 'ValueObject', {
			disableSetters: true
		});
		const throws = () => gettersAndSetters.set('key').to('changed')
		expect(throws).toThrowError();
	});

	it('should change value with success', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' }, 'ValueObject');
		expect(gettersAndSetters.change('key', 'changed')).toBeTruthy();
		expect(gettersAndSetters.get("key")).toBe('changed');
	});

	it('should set value with success', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' }, 'ValueObject');
		expect(gettersAndSetters.set('key').to('changed')).toBeTruthy();
		expect(gettersAndSetters.get("key")).toBe('changed');
	});

	it('should do not set if do not pass on validation', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' }, 'ValueObject');
		const validation = (value: string) => value !== 'changed';
		expect(() => gettersAndSetters.change('key', 'changed', validation)).toThrowError();
		expect(gettersAndSetters.change('key', 'change', validation)).toBeTruthy();
		expect(gettersAndSetters.get("key")).toBe('change');
	});

	it('should do not change if is deactivate', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' }, 'ValueObject', { disableSetters: true });
		expect(() => gettersAndSetters.change('key', 'changed')).toThrowError();
		expect(gettersAndSetters.get("key")).toBe('value');
	});

	it('should do not set if do not pass on validation', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' }, 'ValueObject');
		const validation = (value: string) => value !== 'changed';
		expect(() => gettersAndSetters.set('key').to('changed', validation)).toThrowError();
		expect(gettersAndSetters.set('key').to('change', validation)).toBeTruthy();
		expect(gettersAndSetters.get("key")).toBe('change');
	});

});
