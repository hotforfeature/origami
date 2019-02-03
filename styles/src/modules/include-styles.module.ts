import { NgModule } from '@angular/core';
import { INJECT_STYLES_PROVIDER } from './inject-styles';

/**
 * Importing this module will add the ability for Angular components to include
 * Polymer style modules with the `@IncludeStyles()` decorator. This module
 * only needs to be imported once at the root component.
 *
 * This module _requires_` @angular/router` in order to inject styles for lazy
 * loaded components. Use `InjectStylesNoRouterModule` if your application does
 * not use `@angular/router`.
 */
@NgModule({
  providers: [INJECT_STYLES_PROVIDER]
})
export class IncludeStylesModule {}
