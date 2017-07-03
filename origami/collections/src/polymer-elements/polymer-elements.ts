import { Directive } from '@angular/core';
import { EmitChangesDirective } from '@codebakery/origami';

@Directive({
  selector: `array-selector, custom-style, dom-bind, dom-if, dom-module, dom-repeat`
})
export class PolymerElement extends EmitChangesDirective { }
