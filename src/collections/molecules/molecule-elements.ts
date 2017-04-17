import { Directive } from '@angular/core';

import { EmitChangesDirective } from '../../events/emit-changes.directive';

@Directive({
  selector: `marked-element, prism-element`
})
export class MoleculeElement extends EmitChangesDirective { }
