import { Directive } from '@angular/core';

import { PolymerDirective } from '../../events/polymer.directive';

@Directive({
  selector: `gold-cc-cvc-input, gold-cc-expiration-input, gold-cc-input, gold-email-input,
    gold-phone-input, gold-zip-input`
})
export class GoldElement extends PolymerDirective { }
