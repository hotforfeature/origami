/**
 * Map of targets, their properties, and promises that will be resolved when
 * they are set. This allows multiple invocations to `whenSet()` for the same
 * target and property to resolve.
 */
let whenSetMap: WeakMap<any, Map<PropertyKey, Promise<any>>>;
let callbackSyncMap: WeakMap<Promise<any>, Array<(value: any) => void>>;

/**
 * Resolves when the provided property is set to a non-undefined value on the
 * target.
 *
 * @param target the target to listen to
 * @param property the property to wait for
 * @param predicate the predicate to determine whether or not the Promise
 *   should resolve for a new value. The default is to check if the value is
 *   not undefined.
 * @param callbackSync if more precise timing is needed, this callback may be
 *   provided to immediately process the set value since the resolved Promise
 *   will be async
 * @returns a Promise that resolves with the new value
 */
export function whenSet<
  T,
  K extends keyof T,
  V extends T[K] = Exclude<T[K], undefined>
>(
  target: T,
  property: K,
  predicate = (value: any) => typeof value !== 'undefined',
  callbackSync?: (value: V) => void
): Promise<V> {
  let currentValue = target[property];
  if (predicate(currentValue)) {
    if (typeof callbackSync === 'function') {
      callbackSync(<V>target[property]);
    }

    return Promise.resolve(<V>target[property]);
  } else {
    if (!whenSetMap) {
      whenSetMap = new WeakMap();
    }

    if (!callbackSyncMap) {
      callbackSyncMap = new WeakMap();
    }

    let propertyPromiseMap: Map<K, Promise<V>>;
    if (!whenSetMap.has(target)) {
      propertyPromiseMap = new Map();
      whenSetMap.set(target, propertyPromiseMap);
    } else {
      propertyPromiseMap = <Map<K, Promise<V>>>whenSetMap.get(target);
    }

    if (propertyPromiseMap.has(property)) {
      const promise = propertyPromiseMap.get(property)!;
      if (typeof callbackSync === 'function') {
        const callbacks = callbackSyncMap.get(promise)!;
        callbacks.push(callbackSync);
      }

      return promise;
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

              const callbacks = callbackSyncMap.get(promise)!;
              callbacks.forEach(callback => {
                callback(value);
              });

              resolve(value);
            }
          }
        });
      });

      propertyPromiseMap.set(property, promise);
      const callbacks: Array<(value: V) => void> = [];
      if (typeof callbackSync === 'function') {
        callbacks.push(callbackSync);
      }

      callbackSyncMap.set(promise, callbacks);
      return promise;
    }
  }
}
