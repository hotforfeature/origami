import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ɵDomSharedStylesHost as DomSharedStylesHost } from '@angular/platform-browser';

import { EmitChangesDirective } from './events/emit-changes.directive';
import { IronControlDirective } from './forms/iron-control.directive';
import { PolymerDomSharedStylesHost } from './style/shared-styles-host';
import { PolymerTemplateDirective } from './templates/polymer-template.directive';

@NgModule({
  imports: [
    FormsModule
  ],
  declarations: [
    EmitChangesDirective,
    IronControlDirective,
    PolymerTemplateDirective
  ],
  exports: [
    EmitChangesDirective,
    IronControlDirective,
    PolymerTemplateDirective
  ]
})
export class PolymerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PolymerModule,
      providers: [
        { provide: DomSharedStylesHost, useClass: PolymerDomSharedStylesHost }
      ]
    };
  }
}
