export namespace Polymer {
  export interface CaseMap {
    camelToDashCase(camel: string): string;
    dashToCamelCase(dash: string): string;
  }
}

export interface Polymer {
  CaseMap: Polymer.CaseMap;
}

declare global {
  interface Window {
    Polymer: Polymer;
  }
}

export const Polymer = window.Polymer;
