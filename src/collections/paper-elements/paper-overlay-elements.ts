import { Directive } from '@angular/core';

import { EmitChangesDirective } from '../../events/emit-changes.directive';

@Directive({
  selector: `paper-dialog, paper-dialog-scrollable, paper-fab`
})
export class PaperOverlayElement extends EmitChangesDirective { }
