import { Directive } from '@angular/core';

import { PolymerDirective } from '../../events/polymer.directive';

@Directive({
  selector: `array-selector, custom-style, dom-bind, dom-if, dom-module, dom-repeat`
})
export class PolymerElement extends PolymerDirective { }
