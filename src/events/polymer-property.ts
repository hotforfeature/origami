import { OnPolymerChange } from './on-polymer-change';

export function createPolymerPropertyDecorator(): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    const desc = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (desc) {
      if (desc.set) {
        console.warn(`${propertyKey} has a setter. Use "value = PolymerProperty.unwrap(value)" ` +
          'instead of @PolymerProperty()');
      } else if (desc.get) {
        console.warn(`${propertyKey} is readonly. @PolymerProperty() is not needed`);
      }
    } else {
      let value: any;
      Object.defineProperty(target, propertyKey, {
        configurable: true,
        enumerable: true,
        get() {
          return value;
        },
        set(event: CustomEvent|any) {
          let newValue = PolymerProperty.unwrap(event);
          if (newValue !== value) {
            value = newValue;

            if ((<OnPolymerChange>this).onPolymerChange && event instanceof CustomEvent) {
              (<OnPolymerChange>this).onPolymerChange(propertyKey, event, event.detail);
            }
          }
        }
      });
    }
  };
}

export function unwrapPolymerEvent<T>(value: T): T {
  if (value instanceof CustomEvent) {
    return PolymerProperty.unwrap(<T>value.detail.value);
  } else {
    return value;
  }
}

export interface PolymerPropertyDecorator {
  (): PropertyDecorator;
  unwrap<T>(value: T): T;
}

// tslint:disable-next-line:variable-name
export const PolymerProperty = <PolymerPropertyDecorator>createPolymerPropertyDecorator;
PolymerProperty.unwrap = unwrapPolymerEvent;
