import { wrapDescriptor } from '../util/descriptors';
import { OnPolymerChange } from './on-polymer-change';

export function PolymerChanges(): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    const desc = Object.getOwnPropertyDescriptor(target, propertyKey);
    /* istanbul ignore if */
    if (desc && desc.get && !desc.set) {
      // tslint:disable-next-line:no-console
      console.warn(`${propertyKey} is readonly. @PolymerChanges() is not needed`);
    }

    return wrapDescriptor(target, propertyKey, {
      shouldSet(value: any|CustomEvent) {
        if (value instanceof CustomEvent && value.detail.path) {
          // Object or Array mutation, we need to tell Angular that things have changed
          if ((<OnPolymerChange>this).onPolymerChange) {
            (<OnPolymerChange>this).onPolymerChange(propertyKey, value, value.detail);
          }

          return false;
        } else {
          return true;
        }
      },
      beforeSet(value: any|CustomEvent) {
        return unwrapPolymerEvent(value);
      },
      afterSet(changed: boolean, _value: any, original: any|CustomEvent) {
        if (changed && (<OnPolymerChange>this).onPolymerChange && original instanceof CustomEvent) {
          (<OnPolymerChange>this).onPolymerChange(propertyKey, original, original.detail);
        }
      }
    });
  };
}

export function unwrapPolymerEvent<T>(value: T): T {
  if (value instanceof CustomEvent) {
    return unwrapPolymerEvent(<T>value.detail.value);
  } else {
    return value;
  }
}
