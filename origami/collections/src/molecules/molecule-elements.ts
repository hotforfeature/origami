import { Directive } from '@angular/core';
import { EmitChangesDirective } from '@codebakery/origami';

@Directive({
  selector: `marked-element, prism-element`
})
export class MoleculeElement extends EmitChangesDirective { }
