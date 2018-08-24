import { Type } from '@angular/core';

const TYPE_STYLE_MODULES = new Map<Type<any>, string[]>();

function IncludeStylesDecorator(...styleModules: string[]): ClassDecorator {
  return (target: any) => {
    TYPE_STYLE_MODULES.set(target, styleModules);
    return target;
  };
}

function getRegisteredTypes(): Array<Type<any>> {
  return Array.from(TYPE_STYLE_MODULES.keys());
}

function getStyleModulesFor(type: Type<any>): string[] {
  return TYPE_STYLE_MODULES.get(type) || [];
}

export type IncludeStyles = ((
  styleModule: string,
  ...styleModules: string[]
) => ClassDecorator) &
  IncludeStylesStatic;

export interface IncludeStylesStatic {
  getRegisteredTypes(): Array<Type<any>>;
  getStyleModulesFor(type?: Type<any>): string[];
}

export const IncludeStyles = <IncludeStyles>IncludeStylesDecorator;
IncludeStyles.getRegisteredTypes = getRegisteredTypes;
IncludeStyles.getStyleModulesFor = getStyleModulesFor;
