import { Directive } from '@angular/core';

import { PolymerDirective } from '../../events/polymer.directive';

@Directive({
  selector: `marked-element, prism-element`
})
export class MoleculeElement extends PolymerDirective { }
