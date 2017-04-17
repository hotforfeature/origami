export interface ElementDefinitionOptions {
  extends: string;
}

export interface CustomElementRegistry {
  define(name: string, constructor: Function, options?: ElementDefinitionOptions): void;
  get(name: string): any;
  whenDefined(name: string): PromiseLike<void>;
}

declare global {
  interface Window {
    customElements: CustomElementRegistry;
  }
}

export function getCustomElements(): CustomElementRegistry {
  return window.customElements;
}
