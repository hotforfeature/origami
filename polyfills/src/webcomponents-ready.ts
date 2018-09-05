import { whenSet } from '@codebakery/origami/util';

declare global {
  interface Window {
    WebComponents: {
      ready: boolean;
    };
  }
}

let readyPromise: Promise<void> | undefined;
/**
 * Returns a Promise that resolves when webcomponent polyfills are ready. If
 * this function is used *without* polyfills loaded, it will never resolve.
 *
 * @returns a Promise that resolves when webcomponents are ready
 */
export function webcomponentsReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = new Promise(resolve => {
      whenSet(window, 'WebComponents', undefined, WebComponents => {
        if (WebComponents && !WebComponents.ready) {
          document.addEventListener('WebComponentsReady', function onready() {
            document.removeEventListener('WebComponentsReady', onready);
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  return readyPromise;
}

/**
 * Resets the `webcomponentsReady()` function. Should only be used in testing.
 */
export function resetWebcomponentsReady() {
  readyPromise = undefined;
}
