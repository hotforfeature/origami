import { ElementRef } from '@angular/core';

import { getCustomElements } from './customElements';
import { getTagName } from './getTagName';

export function getCustomElementClass(elementRef: ElementRef): Function {
  if (elementRef && elementRef.nativeElement) {
    const klass = getCustomElements().get(elementRef.nativeElement.tagName.toLowerCase());
    if (klass) {
      return klass;
    } else {
      console.warn(`${getTagName(elementRef)} is not registered`);
    }
  }
}
