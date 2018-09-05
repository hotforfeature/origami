import { APP_INITIALIZER, NgModule, Provider } from '@angular/core';
import { shimCustomElements } from './shim-custom-elements';
import { shimHtmlElementClass } from './shim-html-element-class';
import { webcomponentsReady } from './webcomponents-ready';

shimCustomElements();
shimHtmlElementClass();

export const WEBCOMPONENTS_READY_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useValue: webcomponentsReady
};

@NgModule({
  providers: [WEBCOMPONENTS_READY_PROVIDER]
})
export class WebComponentsReadyModule {}
