/**
 * @description Recursively freezes an object to make it immutable. This prevents any modifications to the object or its nested properties.
 * 
 * @typeParam T - The type of the object being frozen.
 * 
 * @param obj The object to be deeply frozen. If the input is not an object, it is returned as is.
 * 
 * @returns The same object, but deeply frozen to prevent further modifications.
 * 
 * @example
 * ```typescript
 * const mutableObject = { a: 1, b: { c: 2 } };
 * const frozenObject = deepFreeze(mutableObject);
 * 
 * frozenObject.a = 2; // This will throw a TypeError in strict mode.
 * frozenObject.b.c = 3; // This will also throw a TypeError.
 * ```
 */
export const deepFreeze = <T extends object>(obj: T): T => {
  if (!obj || typeof obj !== 'object') return obj;

  Object.keys(obj).forEach(prop => {
    if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) deepFreeze(obj[prop]);
  });

  return Object.freeze(obj) as T;
};
