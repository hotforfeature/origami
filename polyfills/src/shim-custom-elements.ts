import { webcomponentsReady } from './webcomponents-ready';

declare global {
  interface Window {
    CustomElementRegistry: {
      new (): CustomElementRegistry;
      prototype: CustomElementRegistry;
    };
  }
}

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
    const ceMap: {
      [name: string]: [Function, ElementDefinitionOptions | undefined];
    } = {};

    const ceWhenDefined: {
      [name: string]: [Promise<void>, Function];
    } = {};

    class CustomElementRegistryShim {
      // instruct webcomponentsjs to ignore this shim
      forcePolyfill = true;

      get(name: string) {
        return ceMap[name];
      }

      define(
        name: string,
        constructor: Function,
        options?: ElementDefinitionOptions
      ) {
        ceMap[name] = [constructor, options];
      }

      whenDefined(name: string): Promise<void> {
        if (!Array.isArray(ceWhenDefined[name])) {
          ceWhenDefined[name] = <any>[
            new Promise(resolve => (ceWhenDefined[name][1] = resolve))
          ];
        }

        return ceWhenDefined[name][0];
      }
    }

    window.customElements = new CustomElementRegistryShim();
    window.CustomElementRegistry = CustomElementRegistryShim;

    webcomponentsReady().then(() => {
      Object.keys(ceWhenDefined).forEach(name => {
        window.customElements.whenDefined(name).then(() => {
          ceWhenDefined[name][1]();
        });
      });

      Object.keys(ceMap).forEach(name => {
        const [constructor, options] = ceMap[name];
        window.customElements.define(name, constructor, options);
      });
    });
  }
}
