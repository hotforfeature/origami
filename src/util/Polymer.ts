export namespace Polymer {
  export interface CaseMap {
    camelToDashCase(camel: string): string;
    dashToCamelCase(dash: string): string;
  }

  export type PathLike = string|Array<string|number>;

  export interface Path {
    isPath(path: string): boolean;
    root(path: string): string;
    isAncestor(base: string, path: string): boolean;
    isDescendant(base: string, path: string): boolean;
    translate(base: string, newBase: string, path: string): string;
    matches(base: string, path: string): boolean;
    normalize(path: PathLike): string;
    split(path: PathLike): string[];
    get(root: any, path: PathLike, info?: any): any;
    set(root: any, path: PathLike, info?: any): string;
  }

  export interface Splice<T> {
    index: number;
    addedCount: number;
    removed: T[];
    object: T[];
    type: 'splice';
  }

  export interface PropertyEffects {
    setProperties(props: Object);
    notifySplices<T>(path: PathLike, splices: Array<Splice<T>>);
    get(path: PathLike, root?: any): any;
    set(path: PathLike, value: any, root?: any);
    push<T>(path: PathLike, ...items: T[]): number;
    pop(path: PathLike): any;
    splice<T>(path: PathLike, start: number, deleteCount: number, ...items: T[]): T[];
    shift(path: PathLike): any;
    unshift<T>(path: PathLike, ...items: T[]): number;
    notifyPath(path: PathLike, value?: any);
  }
}

export interface Polymer {
  (info?: any): any;
  CaseMap: Polymer.CaseMap;
  Path: Polymer.Path;
}

declare global {
  interface Window {
    Polymer: Polymer;
  }
}

export function getPolymer(): Polymer {
  return window.Polymer;
}
