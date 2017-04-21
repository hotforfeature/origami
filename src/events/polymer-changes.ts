import { OnPolymerChange } from './on-polymer-change';

export function PolymerChanges(): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    const desc = Object.getOwnPropertyDescriptor(target, propertyKey);
    /* istanbul ignore if */
    if (desc && desc.get && !desc.set) {
      console.warn(`${propertyKey} is readonly. @PolymerChanges() is not needed`);
    }

    const properties = new WeakMap();
    return {
      configurable: desc ? desc.configurable : true,
      enumerable: desc ? desc.enumerable : true,
      get() {
        if (desc && desc.get) {
          return desc.get.apply(this);
        } else {
          const props = properties.get(this);
          return props && props[propertyKey];
        }
      },
      set(event: any|CustomEvent) {
        if (event instanceof CustomEvent && event.detail.path) {
          // Object or Array mutation, we need to tell Angular that things have changed
          if ((<OnPolymerChange>this).onPolymerChange) {
            (<OnPolymerChange>this).onPolymerChange(propertyKey, event, event.detail);
          }
        } else {
          let props = properties.get(this);
          if (!props) {
            props = {};
            properties.set(this, props);
          }

          let newValue = unwrapPolymerEvent(event);
          if (desc && desc.set) {
            desc.set.apply(this, [newValue]);
          }

          if (newValue !== props[propertyKey]) {
            // Even if there is a setter, we still keep a copy to determine if a change happens
            props[propertyKey] = newValue;

            if ((<OnPolymerChange>this).onPolymerChange && event instanceof CustomEvent) {
              (<OnPolymerChange>this).onPolymerChange(propertyKey, event, event.detail);
            }
          }
        }
      }
    };
  };
}

export function unwrapPolymerEvent<T>(value: T): T {
  if (value instanceof CustomEvent) {
    return unwrapPolymerEvent(<T>value.detail.value);
  } else {
    return value;
  }
}
