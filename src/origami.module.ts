import { NgModule } from '@angular/core';
import { OrigamiFormsModule } from '@codebakery/origami/forms';
import {
  IncludeStylesModule,
  ShadyCSSModule
} from '@codebakery/origami/styles';
import { TemplateModule } from '@codebakery/origami/templates';
import { WebComponentsReadyModule } from '@codebakery/origami/polyfills';

/**
 * Provides all features of Origami in one module.
 */
@NgModule({
  imports: [
    OrigamiFormsModule,
    IncludeStylesModule,
    ShadyCSSModule,
    TemplateModule,
    WebComponentsReadyModule
  ],
  exports: [
    OrigamiFormsModule,
    IncludeStylesModule,
    ShadyCSSModule,
    TemplateModule,
    WebComponentsReadyModule
  ]
})
export class OrigamiModule {}
