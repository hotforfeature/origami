import { NgModule } from '@angular/core';

import { MoleculeElement } from './molecule-elements';

@NgModule({
  declarations: [
    MoleculeElement
  ],
  exports: [
    MoleculeElement
  ]
})
export class MoleculeModule { }
