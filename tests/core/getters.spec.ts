import { GettersAndSetters } from '../../lib/core/index';
describe('getters and setters', () => {

	it('should be active by default', () => {
		const gettersAndSetters = new GettersAndSetters<any>({});
		expect(gettersAndSetters).toEqual({ 
			"_MetaHistory": undefined,
			"config": {
				"deactivateGetters": false, "deactivateSetters": false
			},
			"props": {}
		});
	});

	it('should be active by default', () => {
		const gettersAndSetters = new GettersAndSetters<any>({}, {
			deactivateGetters: false,
			deactivateSetters: false
		});
		expect(gettersAndSetters).toEqual({ 
			"_MetaHistory": undefined,
			"config": {
				"deactivateGetters": false, "deactivateSetters": false
			},
			"props": {}
		});
	});

	it('should get null if getter is deactivate', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: 'value' }>({ key: 'value' }, {
			deactivateGetters: true
		});
		expect(gettersAndSetters.get('key')).toBeNull();
	});

	it('should set nothing if setter is deactivate', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' }, {
			deactivateSetters: true
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
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' }, { deactivateSetters: true });
		expect(gettersAndSetters.change('key', 'changed').get('key')).toBe('value');
	});

	it('should do not set if do not pass on validation', () => {
		const gettersAndSetters = new GettersAndSetters<{ key: string }>({ key: 'value' });
		const validation = (value: string) => value !== 'changed';
		expect(gettersAndSetters.set('key').to('changed', validation).get('key')).toBe('value');
		expect(gettersAndSetters.set('key').to('change', validation).get('key')).toBe('change');
	});

	it('should do not change', () => {
		class MyClass extends GettersAndSetters<{ key: string }> {
			constructor(props: { key: string }) {
				super(props);
			}

			validation(key: 'key', value: string): boolean {
				return value !== 'change' && typeof key === 'string';
			}
		}

		const instance = new MyClass({ key: 'value' });
		expect(instance.change('key', 'change').get('key')).toBe('value');
		expect(instance.change('key', 'changed').get('key')).toBe('changed');
	});
});
