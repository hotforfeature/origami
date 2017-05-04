declare global {
  interface Window {
    Promise: PromiseConstructor;
    WebComponents: {
      ready: boolean;
    };
  }
}

/* istanbul ignore next */
export function webcomponentsSupported(): boolean {
  // HTML imports
  if (!('import' in document.createElement('link'))) {
    return false;
  }

  // Shadow DOM
  if (!('attachShadow' in Element.prototype && 'getRootNode' in Element.prototype)) {
    return false;
  }

  // Custom elements
  if (!window.customElements) {
    return false;
  }

  // Templates
  if (!('content' in document.createElement('template')) ||
      // Edge has broken fragment cloning which means you cannot clone template.content
      !(document.createDocumentFragment().cloneNode() instanceof DocumentFragment)) {
    return false;
  }

  return true;
}

// webcomponents-lite.js will override Promise. Angular provides its own Promise polyfill, so we
// want to make sure we keep that.
const OriginalPromise = window.Promise; // tslint:disable-line:variable-name
let readyPromise: Promise<void>;

export function webcomponentsReady(): Promise<void> {
  if (!readyPromise) {
    /* istanbul ignore next */
    readyPromise = new Promise<void>((resolve, reject) => {
      if (window.WebComponents) {
        if (window.WebComponents.ready) {
          window.Promise = OriginalPromise;
          resolve();
        } else {
          // tslint:disable-next-line:only-arrow-functions
          document.addEventListener('WebComponentsReady', function onready() {
            window.Promise = OriginalPromise;
            resolve();
            document.removeEventListener('WebComponentsReady', onready);
          });
        }
      } else if (webcomponentsSupported()) {
        resolve();
      } else {
        reject(new Error('WebComponent support or polyfills are not present'));
      }
    });
  }

  return readyPromise;
}
