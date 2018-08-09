import { whenSet } from '@codebakery/origami/util';

declare global {
  interface Window {
    WebComponents: {
      ready: boolean;
    };
  }
}

let readyPromise: Promise<void>;
/**
 * Returns a Promise that resolves when webcomponent polyfills are ready. If
 * this function is used *without* polyfills loaded, it will never resolve.
 *
 * @returns a Promise that resolves when webcomponents are ready
 */
export function webcomponentsReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = new Promise(async resolve => {
      const WebComponents = await whenSet(window, 'WebComponents');
      if (WebComponents && !WebComponents.ready) {
        document.addEventListener('WebComponentsReady', function onready() {
          document.removeEventListener('WebComponentsReady', onready);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  return readyPromise;
}
