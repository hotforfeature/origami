declare global {
  interface Window {
    HTMLElement: typeof HTMLElement;
  }
}

/**
 * Fixes issues where HTMLElement is an object and not a function in browsers,
 * which causes extending them using Typescript's `__extend` to break.
 *
 * See https://github.com/webcomponents/custom-elements/issues/109
 */
export function shimHtmlElementClass() {
  if (typeof HTMLElement === 'object') {
    const HTMLElementFn = function() {};
    HTMLElementFn.prototype = (<any>HTMLElement).prototype;
    window.HTMLElement = <typeof HTMLElement>HTMLElementFn;
  }
}
