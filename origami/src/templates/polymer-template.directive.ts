// tslint:disable:no-string-literal
import { Directive, ElementRef, Input, NgZone, OnInit } from '@angular/core';

import '../types/Polymer';
import { wrapAndDefineDescriptor } from '../util/descriptors';
import { unwrapPolymerEvent } from '../util/unwrapPolymerEvent';
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
  webcomponentsReady(true).then(shimHTMLTemplateAppend).catch(() => { /* noop */ });
}

// TODO: No use to this directive unless a host is set. Consider changing selector to
// template[host] and error if there is no host

@Directive({
  selector: 'template[polymer]'
})
export class PolymerTemplateDirective implements OnInit {
  @Input('polymer') host: any; // tslint:disable-line:no-input-rename

  private template: HTMLTemplateElement;

  constructor(elementRef: ElementRef, private zone: NgZone) {
    this.template = elementRef.nativeElement;
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
        const eventName = `_host_${window.Polymer.CaseMap.camelToDashCase(hostProp)}-changed`;
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
