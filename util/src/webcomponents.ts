declare global {
  interface Window {
    Promise: PromiseConstructor;
    WebComponents: {
      ready: boolean;
      waitFor(waitFn: () => void): void;
    };
  }
}

const priorityCbs: Array<() => void> = [];
/**
 * Private function used by Origami to schedule priority tasks that must be run
 * before `webcomponentsReady()` resolves.
 *
 * @param cb the priority callback to invoke
 */
export function webcomponentsReadyPriority(cb: () => void) {
  if (window.WebComponents && !window.WebComponents.ready) {
    window.WebComponents.waitFor(cb);
  } else {
    cb();
  }
}

let readyPromise: Promise<void>;
/**
 * Returns a Promise that resolves when webcomponent polyfills are ready.
 *
 * This requires `webcomponents-loader.js` to be loaded *before* Angular.
 * A good place to add the polyfill script is in the `<head>`.
 *
 * If Origami cannot detect the polyfill, this function will assume they are
 * available and resolve immediately.
 */
export function webcomponentsReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = new Promise(resolve => {
      if (window.WebComponents) {
        if (window.WebComponents.ready) {
          resolve();
        } else {
          document.addEventListener('WebComponentsReady', function onready() {
            document.removeEventListener('WebComponentsReady', onready);
            resolve();
          });
        }
      } else {
        resolve();
      }
    });
  }

  return readyPromise;
}
