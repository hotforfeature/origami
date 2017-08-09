import { Directive, ElementRef, OnInit } from '@angular/core';

import { getCustomElementClass } from '../util/getCustomElementClass';
import { getPolymer } from '../util/Polymer';

@Directive({
  selector: '[emitChanges]'
})
export class EmitChangesDirective implements OnInit {
  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    const klass = getCustomElementClass(this.elementRef);
    if (klass) {
      const properties: {[name: string]: any} = {};
      this.copyKeysFrom((<any>klass).__classProperties, properties);

      // Listen for notify properties and Object/Array properties which may issue path changes
      const changeable = Object.keys(properties).filter(propertyName => {
        const property = properties[propertyName];
        return property.notify || property === Object || property.type === Object ||
          property === Array || property.type === Array;
      });

      changeable.forEach(property => {
        const eventName = `${getPolymer().CaseMap.camelToDashCase(property)}-changed`;
        this.elementRef.nativeElement.addEventListener(eventName, (event: CustomEvent) => {
          this.elementRef.nativeElement.dispatchEvent(new CustomEvent(`${property}Change`, {
            detail: event.detail
          }));
        });
      });
    }
  }

  private copyKeysFrom(from: any, to: any): any {
    let proto = from;
    while (proto !== Object.prototype) {
      Object.keys(proto ||
          /* istanbul ignore next */ {}).forEach(key => {
        if (key[0] !== '_') {
          // Only copy public properties
          to[key] = from[key];
        }
      });

      proto = Object.getPrototypeOf(proto);
    }
  }
}
