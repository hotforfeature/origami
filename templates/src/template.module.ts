import { NgModule } from '@angular/core';
import { WebComponentsReadyModule } from '@codebakery/origami/polyfills';
import { TemplateDirective } from './template.directive';

@NgModule({
  imports: [WebComponentsReadyModule],
  declarations: [TemplateDirective],
  exports: [TemplateDirective]
})
export class TemplateModule {}
