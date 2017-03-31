import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PolymerDirective } from './events/polymer.directive';
import { IronControl } from './forms/iron-control';
import { PolymerTemplateDirective } from './templates/polymer-template';
import { PolymerElementsModule } from './collections/polymer-elements/polymer-elements.module';

@NgModule({
  imports: [
    FormsModule,
    PolymerElementsModule
  ],
  declarations: [
    IronControl,
    PolymerDirective,
    PolymerTemplateDirective
  ],
  exports: [
    IronControl,
    PolymerDirective,
    PolymerElementsModule,
    PolymerTemplateDirective
  ]
})
export class PolymerModule { }
