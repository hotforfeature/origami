import { NgModule } from '@angular/core';

import { GoldControl } from './gold-controls';
import { GoldElement } from './gold-elements';

@NgModule({
  declarations: [
    GoldControl,
    GoldElement
  ],
  exports: [
    GoldControl,
    GoldElement
  ]
})
export class GoldElementsModule { }
