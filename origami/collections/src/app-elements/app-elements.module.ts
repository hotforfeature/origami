import { NgModule } from '@angular/core';

import { AppElement } from './app-elements';

@NgModule({
  declarations: [
    AppElement
  ],
  exports: [
    AppElement
  ]
})
export class AppElementsModule { }
