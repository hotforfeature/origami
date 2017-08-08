export interface DescriptorHooks<T> {
  shouldSet?(value: T): boolean;
  beforeSet?(value: T): T;
  afterSet?(changed: boolean, value: T, original: T): void;
}

export function wrapAndDefineDescriptor<T>(target: any, propertyKey: string,
    hooks: DescriptorHooks<T>) {
  const desc = wrapDescriptor(target, propertyKey, hooks);
  Object.defineProperty(target, propertyKey, desc);
}

export function wrapDescriptor<T>(target: any, propertyKey: string,
    hooks: DescriptorHooks<T>): PropertyDescriptor {
  let desc = Object.getOwnPropertyDescriptor(target, propertyKey);
  if (!desc) {
    desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), propertyKey);
  }

  const properties = new WeakMap();
  return {
    enumerable: desc ? desc.enumerable : true,
    get() {
      if (desc && desc.get) {
        return desc.get.apply(this);
      } else {
        const props = properties.get(this);
        return props && props[propertyKey];
      }
    },
    set(original: T) {
      let value = original;
      if (!hooks.shouldSet || hooks.shouldSet.apply(this, [value])) {
        if (hooks.beforeSet) {
          value = hooks.beforeSet.apply(this, [value]);
        }

        let props = properties.get(this);
        if (!props) {
          props = {};
          properties.set(this, props);
        }

        const changed = value !== props[propertyKey];
        props[propertyKey] = value;
        if (desc && desc.set) {
          desc.set.apply(this, [value]);
        }

        if (hooks.afterSet) {
          hooks.afterSet.apply(this, [changed, value, original]);
        }
      }
    }
  };
}
