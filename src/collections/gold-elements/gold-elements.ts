import { Directive } from '@angular/core';

import { EmitChangesDirective } from '../../events/emit-changes.directive';

@Directive({
  selector: `gold-cc-cvc-input, gold-cc-expiration-input, gold-cc-input, gold-email-input,
    gold-phone-input, gold-zip-input`
})
export class GoldElement extends EmitChangesDirective { }
