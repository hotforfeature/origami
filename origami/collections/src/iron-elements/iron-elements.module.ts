import { NgModule } from '@angular/core';

import { IronElement } from './iron-elements';
import { IronInputControl } from './iron-input-controls';
import { IronInputElement } from './iron-input-elements';

@NgModule({
  declarations: [
    IronElement,
    IronInputControl,
    IronInputElement
  ],
  exports: [
    IronElement,
    IronInputControl,
    IronInputElement
  ]
})
export class IronElementsModule { }
