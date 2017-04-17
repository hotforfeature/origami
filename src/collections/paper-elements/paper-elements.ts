import { Directive } from '@angular/core';

import { EmitChangesDirective } from '../../events/emit-changes.directive';

@Directive({
  selector: `paper-ripple`
})
export class PaperElement extends EmitChangesDirective { }
