import { NgModule } from '@angular/core';
import { INJECT_STYLES_PROVIDER } from './inject-styles';

/**
 * Importing this module will add the ability for Angular components to include
 * Polymer style modules with the `@IncludeStyles()` decorator. This module
 * only needs to be imported once at the root component.
 */
@NgModule({
  providers: [INJECT_STYLES_PROVIDER]
})
export class IncludeStylesModule {}
