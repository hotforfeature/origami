import { Directive, Provider, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { IronControlDirective } from '../../forms/iron-control.directive';

export const GOLD_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GoldControl),
  multi: true
};

@Directive({
  selector: `gold-cc-cvc-input, gold-cc-expiration-input, gold-cc-input, gold-email-input,
    gold-phone-input, gold-zip-input`,
  providers: [GOLD_CONTROL_VALUE_ACCESSOR]
})
export class GoldControl extends IronControlDirective { }
