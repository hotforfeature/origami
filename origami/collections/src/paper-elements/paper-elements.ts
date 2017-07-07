import { Directive } from '@angular/core';
import { EmitChangesDirective } from '@codebakery/origami';

@Directive({
  selector: `paper-ripple`
})
export class PaperElement extends EmitChangesDirective { }
