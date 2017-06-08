import { Inject } from '@angular/core';
import { DOCUMENT, ɵDomSharedStylesHost as DomSharedStylesHost } from '@angular/platform-browser';

// First group is incorrect escape backslash, second group is rest of mixin detection
const MIXIN_REGEX = /(\\)(--\w[\w-_]*:\s*{)/g;

export class PolymerDomSharedStylesHost extends DomSharedStylesHost {
  protected hostNodes = new Set<Node>();
  protected customStyleNodes = new Set<Node>();

  constructor(@Inject(DOCUMENT) private document: any) {
    super(document);
    this.hostNodes.add(document.head);
  }

  addStyles(styles: string[]) {
    super.addStyles(styles.map(style => style.replace(MIXIN_REGEX, '$2')));
  }

  addHost(hostNode: Node) {
    super.addHost(hostNode);
    this.hostNodes.add(hostNode);
    this.wrapStyleNodes();
  }

  onStylesAdded(additions: Set<string>) {
    super.onStylesAdded(additions);
    this.wrapStyleNodes();
  }

  removeHost(hostNode: Node) {
    super.removeHost(hostNode);
    this.hostNodes.delete(hostNode);
  }

  private wrapStyleNodes() {
    this.hostNodes.forEach(hostNode => {
      Array.from(hostNode.childNodes).forEach(childNode => {
        if ((<Element>childNode).tagName === 'STYLE') {
          const customStyleEl = this.document.createElement('custom-style');
          hostNode.removeChild(childNode);
          (<Element>childNode).setAttribute('is', 'custom-style');
          customStyleEl.appendChild(childNode);
          hostNode.appendChild(customStyleEl);
        }
      });
    });
  }
}
