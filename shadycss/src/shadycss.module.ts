import { NgModule } from '@angular/core';
import { ɵDomSharedStylesHost as DomSharedStylesHost } from '@angular/platform-browser';
import { ShadyCSSSharedStylesHost } from './shared-styles-host';

/**
 * Adds ShadyCSS support to Angular. This allows the use of CSS custom
 * properties in Angular styles on browsers that do not support them.
 *
 * The ShadyCSS polyfill must be imported separately. It may be imported from
 * `@webcomponents/shadycss/entrypoints/custom-style-interface.js`
 * or `@polymer/polymer/lib/elements/custom-style.js`.
 */
@NgModule({
  providers: [
    { provide: DomSharedStylesHost, useClass: ShadyCSSSharedStylesHost }
  ]
})
export class ShadyCSSModule {}
