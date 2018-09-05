import { NgModule } from '@angular/core';
import { OrigamiControlValueAccessor } from './value-accessor';

/**
 * Provides support for template and reactive Angular form directives and
 * custom elements.
 */
@NgModule({
  declarations: [OrigamiControlValueAccessor],
  exports: [OrigamiControlValueAccessor]
})
export class OrigamiFormsModule {}
