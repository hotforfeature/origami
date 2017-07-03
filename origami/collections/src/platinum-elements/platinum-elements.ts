import { Directive } from '@angular/core';
import { EmitChangesDirective } from '@codebakery/origami';

@Directive({
  selector: `platinum-bluetooth, platinum-https-redirect, platinum-push-messaging, platinum-sw`
})
export class PlatinumElement extends EmitChangesDirective { }
