import { Directive } from '@angular/core';

import { PolymerDirective } from '../../events/polymer.directive';

@Directive({
  selector: `paper-badge, paper-button, paper-card, paper-dropdown-menu, paper-icon-button,
    paper-icon-item, paper-item, paper-item-body, paper-menu, paper-menu-button, paper-progress,
    paper-spinner, paper-swatch-picker, paper-tabs, paper-toolbar, paper-tooltip`
})
export class PaperUiElement extends PolymerDirective { }
