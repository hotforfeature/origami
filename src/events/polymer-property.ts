import { OnPolymerChange } from './on-polymer-change';

export function PolymerProperty(): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    const desc = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (desc && desc.get && !desc.set) {
      console.warn(`${propertyKey} is readonly. @PolymerProperty() is not needed`);
    }

    let value: any;
    return {
      configurable: desc ? desc.configurable : true,
      enumerable: desc ? desc.enumerable : true,
      get() {
        if (desc && desc.get) {
          return desc.get();
        } else {
          return value;
        }
      },
      set(valueOrEvent: any|CustomEvent) {
        let newValue = unwrapPolymerEvent(valueOrEvent);
        if (desc && desc.set) {
          desc.set(newValue);
        }

        if (newValue !== value) {
          // Even if there is a setter, we still keep a copy to determine if a change happens
          value = newValue;

          if ((<OnPolymerChange>this).onPolymerChange && valueOrEvent instanceof CustomEvent) {
            (<OnPolymerChange>this).onPolymerChange(propertyKey, valueOrEvent, valueOrEvent.detail);
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
