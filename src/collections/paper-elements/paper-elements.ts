import { Directive } from '@angular/core';

import { PolymerDirective } from '../../events/polymer.directive';

@Directive({
  selector: `paper-ripple`
})
export class PaperElement extends PolymerDirective { }
