const {stringify: $stringify} = JSON;
const {keys} = Object;

const Primitive = String;   // it could be Number
const primitive = 'string'; // it could be 'number'

const ignore = {};
const object = 'object';

const noop = (_, value) => value;

const revive = (input: { [x: string]: any; }, parsed: { has: (arg0: any) => any; add: (arg0: any) => void; }, output: {
	[x: string]: any;
}, $: { call: (arg0: any, arg1: string, arg2: any) => any; }) => {
	const lazy: any[] = [];
	for (let ke = keys(output), {length} = ke, y = 0; y < length; y++) {
		const k = ke[y];
		const value = output[k];
		if (value instanceof Primitive) {
			const tmp = input[value as string];
			if (typeof tmp === object && !parsed.has(tmp)) {
				parsed.add(tmp);
				output[k] = ignore;
				lazy.push({k, a: [input, parsed, tmp, $]});
			}
			else
				output[k] = $.call(output, k, tmp);
		}
		else if (output[k] !== ignore)
			output[k] = $.call(output, k, value);
	}
	for (let {length} = lazy, i = 0; i < length; i++) {
		const {k, a} = lazy[i];
		output[k] = $.call(output, k, revive.apply(null, a));
	}
	return output;
};

const set = (known, input, value) => {
	const index = Primitive(input.push(value) - 1);
	known.set(value, index);
	return index;
};

/**
 * Converts a JS value into a specialized flatted string.
 * @param {any} value
 * @returns {string}
 * @summary Do not use this function to stringify values you will use in future.
 * @todo test implementation with different scenarios
 */
export const stringify = (value: any): string => {
	const $ = noop;
	const known = new Map;
	const input = [];
	const output: string[] = [];
	let i = +set(known, input, $.call({'': value}, '', value));
	let firstRun = !i;
	while (i < input.length) {
		firstRun = true;
		output[i] = $stringify(input[i++], replace);
	}
	return '[' + output.join(',') + ']';
	function replace(this: any, key: any, value: any) {
		if (firstRun) {
			firstRun = !firstRun;
			return value;
		}
		const after = $.call(this, key, value);
		switch (typeof after) {
			case object:
				if (after === null) return after;
			case primitive:
				return known.get(after) || set(known, input, after);
		}
		return after;
	}
};
