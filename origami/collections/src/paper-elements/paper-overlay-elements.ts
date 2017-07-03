import { Directive } from '@angular/core';
import { EmitChangesDirective } from '@codebakery/origami';

@Directive({
  selector: `paper-dialog, paper-dialog-scrollable, paper-fab`
})
export class PaperOverlayElement extends EmitChangesDirective { }
