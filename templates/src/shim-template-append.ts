import { whenSet } from '@codebakery/origami/util';

declare global {
  interface Window {
    HTMLTemplateElement: typeof HTMLTemplateElement;
  }
}

let shimPromise: Promise<void> | undefined;
/**
 * Angular incorrectly adds `<template>` children to the element's child node
 * list instead of its content. This shim forces children appended to a
 * `<template>` to be added to its content instead.
 *
 * https://github.com/angular/angular/issues/15557
 *
 * @returns a Promise that resolves when the HTMLTemplateElement is shimmed
 */
export function shimHTMLTemplateAppend(): Promise<void> {
  if (!shimPromise) {
    const shim = () => {
      // Angular's renderer will add children to a <template> instead of to its
      // content. This shim will force any children added to a <template> to be
      // added to its content instead.
      // https://github.com/angular/angular/issues/15557
      const nativeAppend = HTMLTemplateElement.prototype.appendChild;
      HTMLTemplateElement.prototype.appendChild = function<T extends Node>(
        childNode: T
      ) {
        if (this.content) {
          return this.content.appendChild(childNode);
        } else {
          return <T>nativeAppend.apply(this, [childNode]);
        }
      };
    };

    shimPromise = new Promise(async resolve => {
      await whenSet(window, 'HTMLTemplateElement');
      shim();
      resolve();
    });
  }

  return shimPromise;
}

/**
 * Resets `shimHTMLTemplateAppend()` so that it will re-shim the class next
 * time it is called. This is primarily used for testing.
 */
export function resetShimHTMLTemplateAppend() {
  shimPromise = undefined;
}
