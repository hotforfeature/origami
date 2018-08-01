export namespace ShadyCSS {
  export interface CustomStyleInterface {
    addCustomStyle(style: HTMLStyleElement): void;
  }
}

export interface ShadyCSS {
  CustomStyleInterface?: ShadyCSS.CustomStyleInterface;
}

declare global {
  interface Window {
    ShadyCSS: ShadyCSS;
  }
}
