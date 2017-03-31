import { NgModule } from '@angular/core';

import { PolymerElement } from './polymer-elements';

@NgModule({
  declarations: [
    PolymerElement
  ],
  exports: [
    PolymerElement
  ]
})
export class PolymerElementsModule { }
