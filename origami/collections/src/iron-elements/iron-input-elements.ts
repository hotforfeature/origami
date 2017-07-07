import { Directive } from '@angular/core';
import { EmitChangesDirective } from '@codebakery/origami';

@Directive({
  selector: `iron-dropdown, iron-form, iron-input, iron-label`
})
export class IronInputElement extends EmitChangesDirective { }
