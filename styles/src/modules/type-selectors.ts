import { ComponentFactoryResolver, Type } from '@angular/core';
import { getRegisteredTypes } from './include-styles';

let SELECTOR_TO_TYPE = new Map<string, Type<any>>();
let TYPE_TO_SELECTOR = new Map<Type<any>, string>();

/**
 * Scans a `ComponentFactoryResolver` for types decorated with
 * `@IncludeStyles()` to build a map of types and selectors.
 *
 * @param resolver the `ComponentFactoryResolver` to scan
 */
export function scanComponentFactoryResolver(
  resolver: ComponentFactoryResolver
) {
  Array.from(getRegisteredTypes()).forEach(type => {
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

/**
 * Retrieves the component type for a given selector string. The component must
 * have been decorated by `@IncludeStyles()` and scanned by
 * `scanComponentFactoryResolver()`.
 *
 * @param selector the selector of the component type
 * @returns the component type, or undefined if the type is not decorated or
 *   scanned
 */
export function getTypeFor(selector: string): Type<any> | undefined {
  return SELECTOR_TO_TYPE.get(selector);
}

/**
 * Resets the type selector maps that were scanned by
 * `scanComponentFactoryResolver()`. This should only be used for testing.
 */
export function resetTypeSelectors() {
  SELECTOR_TO_TYPE = new Map();
  TYPE_TO_SELECTOR = new Map();
}
