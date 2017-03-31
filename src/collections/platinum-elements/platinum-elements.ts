import { Directive } from '@angular/core';

import { PolymerDirective } from '../../events/polymer.directive';

@Directive({
  selector: `platinum-bluetooth, platinum-https-redirect, platinum-push-messaging, platinum-sw`
})
export class PlatinumElement extends PolymerDirective { }
