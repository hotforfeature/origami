// tslint:disable:no-string-literal
import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  Optional,
  TemplateRef,
  VERSION,
  ViewContainerRef,
  isDevMode
} from '@angular/core';

import { unwrapPolymerEvent } from '../events/polymer-changes';
import { wrapAndDefineDescriptor } from '../util/descriptors';
import { getPolymer } from '../util/Polymer';
import { webcomponentsReady } from '../util/webcomponents';

/* istanbul ignore next */
function shimHTMLTemplateAppend() {
  // Even when this enableLegacyTemplate is false, the resulting <template> has childNodes
  // appended to it instead of its #document-fragment
  // https://github.com/angular/angular/issues/15557
  const nativeAppend = HTMLTemplateElement.prototype.appendChild;
  // tslint:disable-next-line:only-arrow-functions
  HTMLTemplateElement.prototype.appendChild = function<T extends Node>(childNode: T) {
    if (this.content) {
      return this.content.appendChild(childNode);
    } else {
      return nativeAppend.apply(this, [childNode]);
    }
  };
}

/* istanbul ignore next */
if (typeof HTMLTemplateElement !== 'undefined') {
  shimHTMLTemplateAppend();
} else {
  webcomponentsReady(true).then(shimHTMLTemplateAppend);
}

/* istanbul ignore next */
if (VERSION.major === '4' && VERSION.minor < '2' && isDevMode()) {
  // tslint:disable-next-line:no-console
  console.warn('Angular 4.2.0 has fixed enableLegacyTemplate. Origami strongly recommends to ' +
    'update to this version so that <template> elements work across all web components.');
}

@Directive({
  selector: 'ng-template[polymer], template[polymer]'
})
export class PolymerTemplateDirective implements OnInit {
  @Input('polymer') host: any; // tslint:disable-line:no-input-rename
  @Input() set methodHost(host: any) {
    // tslint:disable-next-line:no-console
    console.warn('<template polymer [methodHost]="host"> is deprecated. Use ' +
      '<template [polymer]="host"> instead.');
    this.host = host;
  }

  private template: HTMLTemplateElement;

  constructor(elementRef: ElementRef,
      @Optional() view: ViewContainerRef,
      @Optional() templateRef: TemplateRef<any>,
      private zone: NgZone) {
    // enableLegacyTemplate is working since 4.2.0
    if (elementRef.nativeElement.nodeType === Node.COMMENT_NODE) {
      /* istanbul ignore next */
      if (VERSION.major >= '4' && VERSION.minor >= '2') {
        // tslint:disable-next-line:no-console
        console.warn('<ng-template polymer> is deprecated. Use <template> and ' +
          'enableLegacyTemplate: false');
      }

      const parentNode = (<HTMLElement>view.element.nativeElement).parentNode as Node;
      this.template = document.createElement('template');

      const viewRef = view.createEmbeddedView(templateRef);
      viewRef.rootNodes.forEach(rootNode => {
        parentNode.removeChild(rootNode);
        this.template.content.appendChild(rootNode);
      });

      parentNode.appendChild(this.template);

      // Detach and re-attach the parent element. This will trigger any template attaching logic
      // that a custom elements needs which Angular skipped when using <ng-template>
      const hostNode = parentNode.parentNode as Node;
      hostNode.removeChild(parentNode);
      hostNode.appendChild(parentNode);
    } else {
      this.template = elementRef.nativeElement;
    }
  }

  ngOnInit() {
    if (this.host) {
      // Configure host event binding
      (<any>this.template)['__dataHost'] = this.host;

      // Shim Polymer.TemplateStamp mixin. This allows event bindings in Polymer to be used, such
      // as on-click
      this.host['_addEventListenerToNode'] = (node: HTMLElement, eventName: string,
          handler: any) => {
        node.addEventListener(eventName, handler);
      };

      this.host['_removeEventListenerFromNode'] = (node: HTMLElement, eventName: string,
          handler: any) => {
        node.removeEventListener(eventName, handler);
      };

      if ((<any>this.template)._templateInfo) {
        this.onTemplateInfoChange((<any>this.template)._templateInfo);
      }

      wrapAndDefineDescriptor(this.template, '_templateInfo', {
        afterSet: (_changed: boolean, templateInfo: any) => {
          // Micro timing, templateInfo is set to an empty object first before hostProps are added
          setTimeout(() => this.onTemplateInfoChange(templateInfo));
        }
      });
    }
  }

  private onTemplateInfoChange(templateInfo: any) {
    // Setup host property binding
    if (templateInfo && templateInfo.hostProps) {
      Object.keys(templateInfo.hostProps).forEach(hostProp => {
        // Polymer -> Angular
        const eventName = `_host_${getPolymer().CaseMap.camelToDashCase(hostProp)}-changed`;
        this.template.addEventListener(eventName, (e: CustomEvent) => {
          this.zone.run(() => {
            const value = unwrapPolymerEvent(e);
            if (this.host[hostProp] !== value) {
              this.host[hostProp] = value;
            }
          });
        });

        // Angular -> Polymer
        wrapAndDefineDescriptor(this.host, hostProp, {
          beforeSet: (value: any) => {
            return unwrapPolymerEvent(value);
          },
          afterSet: (changed: boolean, value: any) => {
            if (changed) {
              (<any>this.template)[`_host_${hostProp}`] = value;
            }
          }
        });
      });
    }
  }
}
