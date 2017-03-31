import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PolymerElementsModule } from './collections/polymer-elements/polymer-elements.module';
import { PolymerDirective } from './events/polymer.directive';
import { IronControl } from './forms/iron-control';
import { PolymerTemplateDirective } from './templates/polymer-template';

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
