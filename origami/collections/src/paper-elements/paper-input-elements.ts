import { Directive } from '@angular/core';
import { EmitChangesDirective } from '@codebakery/origami';

@Directive({
  selector: `paper-checkbox, paper-dropdown-menu, paper-input, paper-listbox, paper-radio-button,
    paper-radio-group, paper-slider, paper-toggle-button`
})
export class PaperInputElement extends EmitChangesDirective { }
