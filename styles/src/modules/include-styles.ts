import { Type } from '@angular/core';

/**
 * Map of types to style modules.
 */
let TYPE_STYLE_MODULES = new Map<Type<any>, string[]>();

/**
 * Decorator that registers style modules to be injected for a given component
 * type. One or more style modules may be specified.
 */
export type IncludeStyles = IncludeStylesDecorator & IncludeStylesStatic;

/**
 * Decorator that registers style modules to be injected for a given component
 * type. One or more style modules may be specified.
 *
 * @param styleModule a style module to include
 * @param styleModules additional style modules to include
 * @returns the decorated target
 */
export type IncludeStylesDecorator = (
  styleModule: string,
  ...styleModules: string[]
) => ClassDecorator;

/**
 * Static properties for `IncludeStyles`.
 */
export interface IncludeStylesStatic {
  /**
   * Retrieves all types that have been decorated with `@IncludeStyles()`.
   *
   * @returns an array of all decorated types
   */
  getRegisteredTypes(): Array<Type<any>>;
  /**
   * Retrieves the style modules for a given type that was decorated with
   * `@IncludeStyles()`
   *
   * @param type the type to retrieve style modules for
   * @returns an array of style modules for the decorated type, or an empty
   *   array if the type was not decorated
   */
  getStyleModulesFor(type?: Type<any>): string[];
}

export const IncludeStyles = <IncludeStyles>(
  function IncludeStyles(...styleModules: string[]): ClassDecorator {
    return (target: any) => {
      TYPE_STYLE_MODULES.set(target, styleModules);
      return target;
    };
  }
);

IncludeStyles.getRegisteredTypes = function getRegisteredTypes(): Array<
  Type<any>
> {
  return Array.from(TYPE_STYLE_MODULES.keys());
};

IncludeStyles.getStyleModulesFor = function getStyleModulesFor(
  type: Type<any>
): string[] {
  return TYPE_STYLE_MODULES.get(type) || [];
};

/**
 * Resets all types decorated with `@IncludeStyles()`. Should only be used for
 * testing.
 */
export function resetIncludeStyles() {
  TYPE_STYLE_MODULES = new Map();
}
