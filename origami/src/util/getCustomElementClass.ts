import { ElementRef } from '@angular/core';

import { getCustomElements } from './customElements';
import { getTagName } from './getTagName';

// tslint:disable-next-line:ban-types
export function getCustomElementClass(elementRef?: ElementRef): Function|void {
  if (elementRef && elementRef.nativeElement) {
    const klass = getCustomElements().get(elementRef.nativeElement.tagName.toLowerCase());
    if (klass) {
      return klass;
    } else {
      console.warn(`${getTagName(elementRef)} is not registered`); // tslint:disable-line:no-console
    }
  }
}
