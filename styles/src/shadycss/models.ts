export interface ShadyCSS {
  nativeCss: boolean;
  nativeShadow: boolean;
  CustomStyleInterface?: {
    addCustomStyle(style: HTMLStyleElement): void;
  };
  flushCustomStyles(): void;
}

declare global {
  interface Window {
    ShadyCSS: ShadyCSS;
  }
}
