/**
 * A utility type to recursively make all properties of a type `T` deeply readonly.
 * - Handles built-in types, objects, arrays, tuples, sets, and maps.
 * - Special cases include skipping class constructors and functions.
 * 
 * @template T The type to be made deeply readonly.
 */
export type ReadonlyDeep<T> = 
	T extends BuiltIns
		? T // Built-in types remain unchanged.
		: T extends new (...arguments_: any[]) => unknown
			? T // Skip class constructors to preserve mutability.
			: T extends (...arguments_: any[]) => unknown
				? {} extends ReadonlyObjectDeep<T>
					? T // Skip plain functions with no call signatures.
					: HasMultipleCallSignatures<T> extends true
						? T // Preserve functions with multiple call signatures.
						: ((...arguments_: Parameters<T>) => ReturnType<T>) & ReadonlyObjectDeep<T>
				: T extends Readonly<ReadonlyMap<infer KeyType, infer ValueType>>
					? ReadonlyMapDeep<KeyType, ValueType> // Recursively make map keys and values readonly.
					: T extends Readonly<ReadonlySet<infer ItemType>>
						? ReadonlySetDeep<ItemType> // Recursively make set items readonly.
						: T extends readonly [] | readonly [...never[]]
							? readonly [] // Handle empty or unspecific tuples as empty arrays.
							: T extends readonly [infer U, ...infer V]
								? readonly [ReadonlyDeep<U>, ...ReadonlyDeep<V>] // Handle tuples with specific types.
								: T extends readonly [...infer U, infer V]
									? readonly [...ReadonlyDeep<U>, ReadonlyDeep<V>] // Handle generic tuples.
									: T extends ReadonlyArray<infer ItemType>
										? ReadonlyArray<ReadonlyDeep<ItemType>> // Recursively make array items readonly.
										: T extends object
											? ReadonlyObjectDeep<T> // Recursively make object properties readonly.
											: unknown; // For unknown types, no transformation is applied.

/**
 * Makes all key-value pairs of a `ReadonlyMap` deeply readonly.
 * @template KeyType Type of the keys in the map.
 * @template ValueType Type of the values in the map.
 */
type ReadonlyMapDeep<KeyType, ValueType> = 
	{} & Readonly<ReadonlyMap<ReadonlyDeep<KeyType>, ReadonlyDeep<ValueType>>>;

/**
 * Makes all elements of a `ReadonlySet` deeply readonly.
 * @template ItemType Type of the items in the set.
 */
type ReadonlySetDeep<ItemType> = 
	{} & Readonly<ReadonlySet<ReadonlyDeep<ItemType>>>;

/**
 * Makes all properties of an object type deeply readonly.
 * @template ObjectType The type of the object to be made deeply readonly.
 */
type ReadonlyObjectDeep<ObjectType extends object> = {
	readonly [KeyType in keyof ObjectType]: ReadonlyDeep<ObjectType[KeyType]>
};

/**
 * Primitive types that are not recursively transformed.
 */
export type Primitive =
	| null
	| undefined
	| string
	| number
	| boolean
	| symbol
	| bigint;

/**
 * Built-in types that are excluded from recursive transformations.
 */
export type BuiltIns = Primitive | void | Date | RegExp;

/**
 * Utility type to determine if a function type has multiple call signatures.
 * - Used to differentiate simple functions from overloaded functions.
 * 
 * @template T The function type to analyze.
 */
type HasMultipleCallSignatures<T extends (...arguments_: any[]) => unknown> =
	T extends {(...arguments_: infer A): unknown; (...arguments_: infer B): unknown}
		? B extends A
			? A extends B
				? false // Single call signature.
				: true // Multiple call signatures.
			: true
		: false;

/**
 * @description Utility for deeply readonly transformations.
 * Adapted from TypeScript type utility libraries.
 * @link https://github.com/sindresorhus/type-fest/blob/main/source/readonly-deep.d.ts
 */
