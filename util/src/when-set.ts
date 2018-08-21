/**
 * Map of targets, their properties, and promises that will be resolved when
 * they are set. This allows multiple invocations to `whenSet()` for the same
 * target and property to resolve.
 */
let whenSetMap: WeakMap<any, Map<PropertyKey, Promise<any>>>;

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
export function whenSet<
  T,
  K extends keyof T,
  V extends T[K] = Exclude<T[K], undefined>
>(
  target: T,
  property: K,
  predicate = (value: any) => typeof value !== 'undefined'
): Promise<V> {
  let currentValue = target[property];
  if (predicate(currentValue)) {
    return Promise.resolve(<V>target[property]);
  } else {
    if (!whenSetMap) {
      whenSetMap = new WeakMap();
    }

    let propertyPromiseMap: Map<K, Promise<V>>;
    if (!whenSetMap.has(target)) {
      propertyPromiseMap = new Map();
      whenSetMap.set(target, propertyPromiseMap);
    } else {
      propertyPromiseMap = <Map<K, Promise<V>>>whenSetMap.get(target);
    }

    if (propertyPromiseMap.has(property)) {
      return propertyPromiseMap.get(property)!;
    } else {
      const promise = new Promise<V>(resolve => {
        Object.defineProperty(target, property, {
          configurable: true,
          enumerable: true,
          get() {
            return currentValue;
          },
          set(value: V) {
            currentValue = value;
            if (predicate(value)) {
              Object.defineProperty(target, property, {
                value,
                configurable: true,
                enumerable: true,
                writable: true
              });

              propertyPromiseMap.delete(property);
              if (!propertyPromiseMap.size) {
                whenSetMap.delete(target);
              }

              resolve(value);
            }
          }
        });
      });

      propertyPromiseMap.set(property, promise);
      return promise;
    }
  }
}
