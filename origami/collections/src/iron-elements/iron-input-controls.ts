import { Directive, Provider, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IronControlDirective } from '@codebakery/origami';

export const IRON_INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IronInputControl),
  multi: true
};

@Directive({
  selector: `iron-input`,
  providers: [IRON_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class IronInputControl extends IronControlDirective { }
