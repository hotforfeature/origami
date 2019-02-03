import { InjectionToken } from '@angular/core';

/**
 * By default, Origami will not parse or register styles with ShadyCSS if the
 * platform supports native CSS custom properties. However, ShadyCSS also
 * supports the deprecated `@apply` mixin proposal. If a project is using
 * `@apply` in CSS, this token should be provided with a true value.
 */
export const USING_APPLY = new InjectionToken<boolean>('usingApply');

/**
 * Processes all current document stylesheets added by Angular and registers
 * them with ShadyCSS.
 *
 * This function will also parse external `<link>` stylesheets if native
 * CSS custom properties are not supported, or if `usingApply` is set to true.
 *
 * @param usingApply if true, parse stylesheets regardless of native support,
 *   since no browser supports `@apply` natively
 * @returns a Promise when all stylesheets have been processed
 */
export async function processStylesheets(usingApply?: boolean): Promise<void> {
  const CustomStyleInterface =
    window.ShadyCSS && window.ShadyCSS.CustomStyleInterface;
  if (CustomStyleInterface && (!window.ShadyCSS.nativeCss || usingApply)) {
    await Promise.all(
      Array.from(document.styleSheets).map(stylesheet => {
        const node = stylesheet.ownerNode;
        if (isStyleNode(node) && !node.hasAttribute('scope')) {
          CustomStyleInterface.addCustomStyle(node);
          return Promise.resolve();
        } else if (stylesheet.href) {
          if (!(<any>stylesheet)._fetching) {
            const href = stylesheet.href;
            (<any>stylesheet)._fetching = new Promise<void>(resolve => {
              const xhr = new XMLHttpRequest();
              xhr.addEventListener('load', () => {
                const style = document.createElement('style');
                style.innerHTML = xhr.responseText;
                node.parentNode!.insertBefore(style, node);
                node.parentNode!.removeChild(node);
                CustomStyleInterface.addCustomStyle(style);
                resolve();
              });

              xhr.open('GET', href);
              xhr.send();
            });
          }

          return (<any>stylesheet)._fetching;
        }
      })
    );
  }
}

/**
 * Returns true if the provided node is a `<style>` node.
 *
 * @param node the node to test
 * @returns true if the node is a `<style>` node
 */
export function isStyleNode(node: Node): node is HTMLStyleElement {
  return (<HTMLStyleElement>node).localName === 'style';
}
