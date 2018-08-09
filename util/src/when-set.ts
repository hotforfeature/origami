/**
 * Resolves when the provided property is set to a non-undefined value on the
 * target.
 *
 * @param target the target to listen to
 * @param property the property to wait for
 * @param predicate the predicate to determine whether or not the Promise
 *   should resolve for a new value. The default is to check if the value is
 *   not undefined.
 * @returns a Promise that resolves with the new value
 */
export function whenSet<T, K extends keyof T>(
  target: T,
  property: K,
  predicate = (value: any) => typeof value !== 'undefined'
): Promise<T[K]> {
  let currentValue = target[property];
  if (predicate(currentValue)) {
    return Promise.resolve(target[property]);
  } else {
    return new Promise(resolve => {
      Object.defineProperty(target, property, {
        configurable: true,
        get() {
          return currentValue;
        },
        set(value: T[K]) {
          currentValue = value;
          if (predicate(value)) {
            Object.defineProperty(target, property, {
              value,
              configurable: true,
              enumerable: true,
              writable: true
            });

            resolve(value);
          }
        }
      });
    });
  }
}
