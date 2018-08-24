import { ComponentFactoryResolver, Type } from '@angular/core';
import { IncludeStyles } from './include-styles';

const SELECTOR_TO_TYPE = new Map<string, Type<any>>();
const TYPE_TO_SELECTOR = new Map<Type<any>, string>();

export function scanComponentFactoryResolver(
  resolver: ComponentFactoryResolver
) {
  Array.from(IncludeStyles.getRegisteredTypes()).forEach(type => {
    if (!TYPE_TO_SELECTOR.has(type)) {
      try {
        const factory = resolver.resolveComponentFactory(type);
        TYPE_TO_SELECTOR.set(type, factory.selector);
        SELECTOR_TO_TYPE.set(factory.selector, type);
      } catch (err) {
        // No component factory found
      }
    }
  });
}

export function getTypeFor(selector: string): Type<any> | undefined {
  return SELECTOR_TO_TYPE.get(selector);
}
