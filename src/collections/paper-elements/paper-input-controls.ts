import { Directive, Provider, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { IronControlDirective } from '../../forms/iron-control.directive';

export const PAPER_INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PaperInputControl),
  multi: true
};

@Directive({
  selector: `paper-checkbox, paper-input, paper-listbox, paper-radio-button, paper-radio-group,
    paper-toggle-button`,
  providers: [PAPER_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class PaperInputControl extends IronControlDirective { }
