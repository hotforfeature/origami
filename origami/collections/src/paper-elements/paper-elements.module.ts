import { NgModule } from '@angular/core';

import { PaperDropdownMenuControl } from './paper-dropdown-menu-control';
import { PaperElement } from './paper-elements';
import { PaperInputControl } from './paper-input-controls';
import { PaperInputElement } from './paper-input-elements';
import { PaperOverlayElement } from './paper-overlay-elements';
import { PaperSliderControl } from './paper-slider-control';
import { PaperUiElement } from './paper-ui-elements';

@NgModule({
  declarations: [
    PaperDropdownMenuControl,
    PaperElement,
    PaperInputControl,
    PaperInputElement,
    PaperOverlayElement,
    PaperSliderControl,
    PaperUiElement
  ],
  exports: [
    PaperDropdownMenuControl,
    PaperElement,
    PaperInputControl,
    PaperInputElement,
    PaperOverlayElement,
    PaperSliderControl,
    PaperUiElement
  ]
})
export class PaperElementsModule { }
