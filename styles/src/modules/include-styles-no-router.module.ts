import { NgModule } from '@angular/core';
import { INJECT_STYLES_NO_ROUTER_PROVIDER } from './inject-styles';

/**
 * Importing this module will add the ability for Angular components to include
 * Polymer style modules with the `@IncludeStyles()` decorator. This module
 * only needs to be imported once at the root component.
 *
 * This module does _not_ require `@angular/router` and will not inject styles
 * into lazy loaded components.
 */
@NgModule({
  providers: [INJECT_STYLES_NO_ROUTER_PROVIDER]
})
export class IncludeStylesNoRouterModule {}
