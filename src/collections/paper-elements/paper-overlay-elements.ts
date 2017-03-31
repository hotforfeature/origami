import { Directive } from '@angular/core';

import { PolymerDirective } from '../../events/polymer.directive';

@Directive({
  selector: `paper-dialog, paper-dialog-scrollable, paper-fab`
})
export class PaperOverlayElement extends PolymerDirective { }
