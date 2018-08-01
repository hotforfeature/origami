import { Inject } from '@angular/core';
import {
  DOCUMENT,
  ɵDomSharedStylesHost as DomSharedStylesHost
} from '@angular/platform-browser';
import { shimCustomElements } from '@codebakery/origami/util';

// Ensure imported elements can define themselves before polyfills
shimCustomElements();

// First group is incorrect escape backslash, second group is rest of mixin detection
const MIXIN_REGEX = /(?:\\)(--\w[\w-_]*:\s*{[^}]*})(;)?/g;

/**
 * A `SharedStylesHost` that extends the default `DomSharedStylesHost` and will
 * pass styles to ShadyCSS for processing. This will allow the use of custom CSS
 * properties in Angular styles on browsers that do not support them.
 */
export class ShadyCSSSharedStylesHost extends DomSharedStylesHost {
  protected hostNodes = new Set<Node>();

  constructor(@Inject(DOCUMENT) document: Document) {
    super(document);
    this.hostNodes.add(document.head);
  }

  addStyles(styles: string[]) {
    /**
     * Mixins are declared as
     *
     * html {
     *   --my-mixin: {
     *     color: blue;
     *   }
     * }
     *
     * But are incorrectly interpolated by the webpack CSS loader as
     *
     * html {
     *   \--my-mixin: {
     *     color: blue;
     *   }
     * }
     *
     * This regex will fix the added backslash.
     */
    super.addStyles(styles.map(style => style.replace(MIXIN_REGEX, '$1')));
  }

  addHost(hostNode: Node) {
    super.addHost(hostNode);
    this.hostNodes.add(hostNode);
    this.addStylesToShadyCSS();
  }

  onStylesAdded(additions: Set<string>) {
    super.onStylesAdded(additions);
    this.addStylesToShadyCSS();
  }

  removeHost(hostNode: Node) {
    super.removeHost(hostNode);
    this.hostNodes.delete(hostNode);
  }

  protected addStylesToShadyCSS() {
    if (window.ShadyCSS && window.ShadyCSS.CustomStyleInterface) {
      this.hostNodes.forEach(hostNode => {
        Array.from(hostNode.childNodes).forEach(childNode => {
          if (
            this.isStyleElement(childNode) &&
            !childNode.hasAttribute('scope')
          ) {
            // ShadyCSS will handle <style> elements that have already been registered
            window.ShadyCSS!.CustomStyleInterface!.addCustomStyle(childNode);
          }
        });
      });
    }
  }

  protected isStyleElement(element: any): element is HTMLStyleElement {
    return element.tagName === 'STYLE';
  }
}
