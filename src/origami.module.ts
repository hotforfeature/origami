import { NgModule } from '@angular/core';
import { OrigamiFormsModule } from '@codebakery/origami/forms';
import { ShadyCSSModule } from '@codebakery/origami/shadycss';
import { TemplateModule } from '@codebakery/origami/templates';
import { WebComponentsReadyModule } from '@codebakery/origami/polyfills';

/**
 * Provides all features of Origami in one module.
 */
@NgModule({
  imports: [
    OrigamiFormsModule,
    ShadyCSSModule,
    TemplateModule,
    WebComponentsReadyModule
  ],
  exports: [
    OrigamiFormsModule,
    ShadyCSSModule,
    TemplateModule,
    WebComponentsReadyModule
  ]
})
export class OrigamiModule {}
