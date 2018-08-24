import {
  APP_INITIALIZER,
  ModuleWithProviders,
  NgModule,
  NgModuleRef,
  Provider
} from '@angular/core';
import { injectIncludeStyles } from './inject-styles';

export const INJECT_STYLES_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: injectIncludeStyles,
  deps: [NgModuleRef]
};

@NgModule({
  providers: [INJECT_STYLES_PROVIDER]
})
export class IncludeStylesModule {}
