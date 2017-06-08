import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ɵDomSharedStylesHost as DomSharedStylesHost } from '@angular/platform-browser';

import { PolymerElementsModule } from './collections/polymer-elements/polymer-elements.module';
import { EmitChangesDirective } from './events/emit-changes.directive';
import { IronControlDirective } from './forms/iron-control.directive';
import { CustomStyleService } from './style/custom-style.service';
import { PolymerDomSharedStylesHost } from './style/shared-styles-host';
import { PolymerTemplateDirective } from './templates/polymer-template.directive';

@NgModule({
  imports: [
    FormsModule,
    PolymerElementsModule
  ],
  declarations: [
    EmitChangesDirective,
    IronControlDirective,
    PolymerTemplateDirective
  ],
  providers: [
    CustomStyleService
  ],
  exports: [
    EmitChangesDirective,
    IronControlDirective,
    PolymerElementsModule,
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
