import { NgModule, Provider, APP_INITIALIZER } from '@angular/core';
import { WebComponentsReadyModule } from '@codebakery/origami/polyfills';
import { shimHTMLTemplateAppend } from './shim-template-append';
import { TemplateDirective } from './template.directive';

shimHTMLTemplateAppend();

export const TEMPLATES_READY_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useValue: shimHTMLTemplateAppend
};

@NgModule({
  imports: [WebComponentsReadyModule],
  declarations: [TemplateDirective],
  providers: [TEMPLATES_READY_PROVIDER],
  exports: [TemplateDirective]
})
export class TemplateModule {}
