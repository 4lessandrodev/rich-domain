
export type ReadonlyDeep<T> = T extends BuiltIns
	? T
	: T extends new (...arguments_: any[]) => unknown
		? T // Skip class constructors
		: T extends (...arguments_: any[]) => unknown
			? {} extends ReadonlyObjectDeep<T>
				? T
				: HasMultipleCallSignatures<T> extends true
					? T
					: ((...arguments_: Parameters<T>) => ReturnType<T>) & ReadonlyObjectDeep<T>
			: T extends Readonly<ReadonlyMap<infer KeyType, infer ValueType>>
				? ReadonlyMapDeep<KeyType, ValueType>
				: T extends Readonly<ReadonlySet<infer ItemType>>
					? ReadonlySetDeep<ItemType>
					: // Identify tuples to avoid converting them to arrays inadvertently; special case `readonly [...never[]]`, as it emerges undesirably from recursive invocations of ReadonlyDeep below.
					T extends readonly [] | readonly [...never[]]
						? readonly []
						: T extends readonly [infer U, ...infer V]
							? readonly [ReadonlyDeep<U>, ...ReadonlyDeep<V>]
							: T extends readonly [...infer U, infer V]
								? readonly [...ReadonlyDeep<U>, ReadonlyDeep<V>]
								: T extends ReadonlyArray<infer ItemType>
									? ReadonlyArray<ReadonlyDeep<ItemType>>
									: T extends object
										? ReadonlyObjectDeep<T>
										: unknown;

 
type ReadonlyMapDeep<KeyType, ValueType> = {} & Readonly<ReadonlyMap<ReadonlyDeep<KeyType>, ReadonlyDeep<ValueType>>>;
type ReadonlySetDeep<ItemType> = {} & Readonly<ReadonlySet<ReadonlyDeep<ItemType>>>;
type ReadonlyObjectDeep<ObjectType extends object> = {
	readonly [KeyType in keyof ObjectType]: ReadonlyDeep<ObjectType[KeyType]>
};

type Primitive =
	| null
	| undefined
	| string
	| number
	| boolean
	| symbol
	| bigint;
type BuiltIns = Primitive | void | Date | RegExp;
/**
 * @description Deeply readonly object.
 * @link https://github.com/sindresorhus/type-fest/blob/main/source/readonly-deep.d.ts
 */
type HasMultipleCallSignatures<T extends (...arguments_: any[]) => unknown> =
	T extends {(...arguments_: infer A): unknown; (...arguments_: infer B): unknown}
		? B extends A
			? A extends B
				? false
				: true
			: true
		: false;