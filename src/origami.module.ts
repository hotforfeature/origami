import { NgModule } from '@angular/core';
import { OrigamiFormsModule } from '@codebakery/origami/forms';
import { ShadyCSSModule } from '@codebakery/origami/shadycss';
import { TemplateModule } from '@codebakery/origami/templates';

/**
 * Provides all features of Origami in one module.
 */
@NgModule({
  imports: [OrigamiFormsModule, ShadyCSSModule, TemplateModule],
  exports: [OrigamiFormsModule, ShadyCSSModule, TemplateModule]
})
export class OrigamiModule {}
