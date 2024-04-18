export const deepFreeze = <T extends object>(obj: T) => {
  if (!obj || typeof obj !== 'object') return obj;

  Object.keys(obj).forEach(prop => {
    if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) deepFreeze(obj[prop]);
  });
  return Object.freeze(obj) as any
};