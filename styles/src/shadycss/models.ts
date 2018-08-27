export namespace ShadyCSS {
  export interface CustomStyleInterface {
    addCustomStyle(style: HTMLStyleElement): void;
  }
}

export interface ShadyCSS {
  nativeCss: boolean;
  nativeShadow: boolean;
  CustomStyleInterface?: ShadyCSS.CustomStyleInterface;
  flushCustomStyles(): void;
}

declare global {
  interface Window {
    ShadyCSS: ShadyCSS;
  }
}
