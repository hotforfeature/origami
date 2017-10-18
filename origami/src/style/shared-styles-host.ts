import { Inject } from '@angular/core';
import { DOCUMENT, ɵDomSharedStylesHost as DomSharedStylesHost } from '@angular/platform-browser';

import { getShadyCSS } from '../util/ShadyCSS';

/**
 * poylmer-webpack-loader will insert <style> and <custom-style> elements into the body, while
 * Angular inserts styles into the head. This means browsers that support CSS custom properties will
 * let the body elements take priority even though the Angular styles are declared "after".
 *
 * This shim will ensure that <style> and <custom-style> elements added by polymer-webpack-loader
 * are correctly added to the top of <head>.
 */
const superInsertBefore = document.body.insertBefore;
// tslint:disable-next-line:only-arrow-functions
document.body.insertBefore = function<T extends Node>(newChild: any): T {
  if (newChild.tagName === 'STYLE' || newChild.tagName === 'CUSTOM-STYLE') {
    return document.head.insertBefore(newChild, document.head.firstChild);
  } else {
    return superInsertBefore.apply(this, arguments);
  }
};

// First group is incorrect escape backslash, second group is rest of mixin detection
const MIXIN_REGEX = /(\\)(--\w[\w-_]*:\s*{)/g;

export class PolymerDomSharedStylesHost extends DomSharedStylesHost {
  protected hostNodes = new Set<Node>();

  constructor(@Inject(DOCUMENT) private document: any) {
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
     *   };
     * }
     *
     * But are incorrectly interpolated by the webpack CSS loader as
     *
     * html {
     *   \--my-mixin: {
     *     color: blue;
     *   };
     * }
     *
     * This regex will fix the added backslash.
     */
    super.addStyles(styles.map(style => style.replace(MIXIN_REGEX, '$2')));
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

  private addStylesToShadyCSS() {
    // Importing Polymer will import ShadyCSS, but it is not required
    const shadyCss = getShadyCSS();
    if (shadyCss) {
      this.hostNodes.forEach(hostNode => {
        Array.from(hostNode.childNodes).forEach((childNode: Element) => {
          if (childNode.tagName === 'STYLE') {
            // ShadyCSS will handle <style> elements that have already been registered
            shadyCss.CustomStyleInterface.addCustomStyle(<HTMLStyleElement>childNode);
          }
        });
      });
    }
  }
}
