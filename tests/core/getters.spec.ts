import { GettersAndSetters } from '../../lib/core/index';
describe('getters and setters', () => {

	class Def extends GettersAndSetters<any>{ 
		getConfig() {
			return this.config;
		}
	};

	it('should be active by default', () => {
		
		const gettersAndSetters = new Def({});

		expect(gettersAndSetters.getConfig()).toEqual({
			disableGetters: false,
			disableSetters: false
		});
	});

	it('should be disabled if provide param', () => {
		const gettersAndSetters = new Def({}, {
			disableGetters: false,
			disableSetters: false
		});
		expect(gettersAndSetters.getConfig()).toEqual({ disableGetters: false, disableSetters: false });
	});

	it('should get null if getter is deactivate', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: 'value' }>({ key: 'value' }, {
			disableGetters: true
		});
		expect(gettersAndSetters.get('key')).toBeNull();
	});

	it('should set nothing if setter is deactivate', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' }, {
			disableSetters: true
		});
		gettersAndSetters.set('key').to('changed')
		expect(gettersAndSetters.get('key')).toBe('value');
	});

	it('should change value with success', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' });
		expect(gettersAndSetters.change('key', 'changed').get('key')).toBe('changed');
	});

	it('should set value with success', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' });
		expect(gettersAndSetters.set('key').to('changed').get('key')).toBe('changed');
	});

	it('should do not set if do not pass on validation', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' });
		const validation = (value: string) => value !== 'changed';
		expect(gettersAndSetters.change('key', 'changed', validation).get('key')).toBe('value');
		expect(gettersAndSetters.change('key', 'change', validation).get('key')).toBe('change');
	});

	it('should do not change if is deactivate', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' }, { disableSetters: true });
		expect(gettersAndSetters.change('key', 'changed').get('key')).toBe('value');
	});

	it('should do not set if do not pass on validation', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' });
		const validation = (value: string) => value !== 'changed';
		expect(gettersAndSetters.set('key').to('changed', validation).get('key')).toBe('value');
		expect(gettersAndSetters.set('key').to('change', validation).get('key')).toBe('change');
	});

});
