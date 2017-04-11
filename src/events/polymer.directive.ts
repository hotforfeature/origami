import { Directive, ElementRef, OnInit } from '@angular/core';

import { getCustomElementClass } from '../util/getCustomElementClass';
import '../util/Polymer';

@Directive({
  selector: '[polymer]'
})
export class PolymerDirective implements OnInit {
  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    const klass = getCustomElementClass(this.elementRef);
    if (klass) {
      // Setup Polymer to Angular event mapping
      let notify = [];
      notify = notify.concat(...this.getNotifyProperties(klass.prototype.properties || {}));
      if (klass.prototype.behaviors) {
        klass.prototype.behaviors.forEach(behavior => {
          notify = notify.concat(...this.getNotifyProperties(behavior.properties || {}));
        });
      }

      notify.forEach(property => {
        const eventName = `${window.Polymer.CaseMap.camelToDashCase(property)}-changed`;
        this.elementRef.nativeElement.addEventListener(eventName, event => {
          this.elementRef.nativeElement.dispatchEvent(new CustomEvent(`${property}Change`, {
            detail: event.detail
          }));
        });
      });
    }
  }

  private getNotifyProperties(properties: any): string[] {
    return Object.keys(properties).filter(property => {
      return properties[property].notify;
    });
  }
}
