import { Directive, ElementRef, Inject, Optional, NgZone } from '@angular/core';
import { whenSet, wrapAndDefineDescriptor } from '@codebakery/origami/util';
import { camelToDashCase } from '@polymer/polymer/lib/utils/case-map';
import { TemplateInfo } from '@polymer/polymer/interfaces';
import { POLYMER_HOST } from './polymerHost';

/**
 * An HTMLTemplateElement that is processed by Polymer's templatizer.
 */
export interface PolymerTemplate extends HTMLTemplateElement {
  /**
   * Added by the `PropertyEffects` mixin to instruct templatize of the host
   * for the template. Effects that are not part of the template instance will
   * propagate to this host.
   */
  __dataHost?: any;
  /**
   * Template metadata generated from `TemplateStamp`.
   */
  _templateInfo?: TemplateInfo;
  /**
   * Host properties are defined as `_host_propName` by templatizer.
   */
  [hostProp: string]: any;
}

/**
 * This directive is attached to each `<template>` element. If a Polymer host
 * component is provided, this directive will enable Polymer's event and
 * two-way binding syntax styles.
 */
@Directive({
  selector: 'template'
})
export class TemplateDirective {
  ready: Promise<void>;

  constructor(
    public elementRef: ElementRef,
    @Inject(POLYMER_HOST)
    @Optional()
    public polymerHost: any,
    private zone: NgZone
  ) {
    this.ready = (async () => {
      if (this.polymerHost) {
        this.enableEventBindings(elementRef.nativeElement);
        await this.enablePropertyBindings(elementRef.nativeElement);
      }
    })();
  }

  /**
   * Enables the use of Polymer event bindings. An event binding is declared
   * with the syntax `on-event-name="handler"`, where `event-name` is the
   * name of the event to listen to and `handler` is the name of the host's
   * method to call when the event is dispatched.
   *
   * @param template the Polymer template to enable event binding syntax for
   */
  enableEventBindings(template: PolymerTemplate) {
    // When templatize looks for a PropertyEffects host, it will use the
    // template's __dataHost property. This is the _methodHost for a template
    // instance and is used to add event listener bindings.
    template.__dataHost = this.polymerHost;
  }

  /**
   * Enables the use of Polymer property bindings. A property binding is
   * declared either as a one-way binding `value="[[propName]]"` or a two-way
   * binding `value="{{propName}}"`.
   *
   * @param template the Polymer template to enable data binding syntax for
   */
  async enablePropertyBindings(template: PolymerTemplate) {
    const { hostProps } = await this.getTemplateInfo(template);
    if (hostProps) {
      for (let prop in hostProps) {
        // Angular -> Polymer (one-way bindings)
        const initialValue = this.polymerHost[prop];
        wrapAndDefineDescriptor(this.polymerHost, prop, {
          afterSet(changed: boolean, value: any) {
            if (changed) {
              template[`_host_${prop}`] = value;
            }
          }
        });

        this.polymerHost[prop] = initialValue;

        // Polymer -> Angular (two-way bindings)
        const eventName = `_host_${camelToDashCase(prop)}-changed`;
        template.addEventListener(eventName, event => {
          if (
            !this.isSplicesChange(<CustomEvent>event) &&
            !this.isPathChange(<CustomEvent>event)
          ) {
            this.zone.run(() => {
              this.polymerHost[prop] = (<CustomEvent>event).detail.value;
            });
          }
        });
      }
    }
  }

  /**
   * Retrieves the template info metadata for a Polymer template.
   *
   * @param template the Polymer template to retrieve template info for
   * @returns a Promise that resolves with the template's info
   */
  async getTemplateInfo(template: PolymerTemplate): Promise<TemplateInfo> {
    if (template._templateInfo) {
      return template._templateInfo;
    } else {
      return await whenSet(template, '_templateInfo');
    }
  }

  /**
   * Indicates whether or not an event is a "splices" Polymer change event,
   * which has a detail value object that dictates what elements were changed if
   * the array reference remains the same.
   *
   * @param event the event to check
   * @returns true if the event is a splices change event
   */
  private isSplicesChange(event: CustomEvent): boolean {
    const value = event.detail.value;
    return value && Array.isArray(value.indexSplices);
  }

  /**
   * Indicates whether or not an event is a path Polymer change event, which
   * has a detail path property indicating the path of the value changed, and a
   * value of the path's value. This is used when an array or object reference
   * remains the same.
   *
   * @param event the event to check
   * @returns true if the event is a path change event
   */
  private isPathChange(event: CustomEvent): boolean {
    return typeof event.detail.path === 'string';
  }
}
