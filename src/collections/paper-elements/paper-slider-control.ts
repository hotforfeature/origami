import { Directive, HostListener, OnInit, Provider, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { IronControl } from '../../forms/iron-control';

export const PAPER_SLIDER_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PaperSliderControl),
  multi: true
};

@Directive({
  selector: `paper-slider`,
  providers: [PAPER_SLIDER_CONTROL_VALUE_ACCESSOR]
})
export class PaperSliderControl extends IronControl implements OnInit {
  @HostListener('value-change', ['$event'])
  private onValueChange(event: Event) {
    this.onChange((<any>event.target).value);
  }
}
