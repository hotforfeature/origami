import { webcomponentsReady } from './webcomponents';

/**
 * Shims `window.customElements` with a placeholder that allows custom elements
 * to define themselves before the WebComponents polyfill is ready. When the
 * polyfill loads, the element definitions will be defined with the polyfilled
 * `customElements`.
 *
 * This allows the developer to import files that call `customElements.define()`
 * without having to delay loading the app via `webcomponentsReady()`.
 *
 * This is automatically called by Origami.
 */
export function shimCustomElements() {
  if (!window.customElements) {
    const customElementsMap: {
      [name: string]: [Function, ElementDefinitionOptions | undefined];
    } = {};

    interface CustomElementsRegistryShim extends CustomElementRegistry {
      forcePolyfill: boolean;
    }

    window.customElements = <CustomElementsRegistryShim>{
      forcePolyfill: true, // instruct webcomponentsjs to ignore this shim
      get(name: string) {
        return customElementsMap[name];
      },
      define(
        name: string,
        constructor: Function,
        options?: ElementDefinitionOptions
      ) {
        customElementsMap[name] = [constructor, options];
      }
    };

    webcomponentsReady().then(() => {
      Object.keys(customElementsMap).forEach(name => {
        const [constructor, options] = customElementsMap[name];
        window.customElements.define(name, constructor, options);
      });
    });
  }
}
