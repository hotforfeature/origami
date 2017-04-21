import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Provider,
  Renderer,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { getTagName } from '../util/getTagName';

export const IRON_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IronControlDirective),
  multi: true
};

@Directive({
  selector: '[ironControl]',
  providers: [IRON_CONTROL_VALUE_ACCESSOR]
})
export class IronControlDirective implements ControlValueAccessor, OnInit, AfterViewInit,
    OnDestroy {
  @Input() ironSelector: any;

  protected ngControl: NgControl;
  protected statusSub: Subscription;
  protected ironCheckedElement = false;
  protected ironSelectable = false;
  protected ironMultiSelectable = false;
  protected ironValidatable = false;

  private isWritingValue = false;
  private boundSelectedChanged: Function;

  constructor(protected elementRef: ElementRef,
      protected injector: Injector,
      protected renderer: Renderer) { }

  ngOnInit() {
    const ironFormElement = 'value' in this.elementRef.nativeElement;
    this.ironCheckedElement = 'checked' in this.elementRef.nativeElement;
    this.ironSelector = this.ironSelector || this.elementRef.nativeElement;
    this.ironSelectable = Array.isArray(this.ironSelector.items);
    this.ironMultiSelectable = 'multi' in this.ironSelector;
    this.ironValidatable = typeof this.elementRef.nativeElement.validate === 'function';

    // IronSelector may be a different element, and default changed events do not bubble.
    // Therefore it's important to add listeners to the element itself rather than the host
    this.boundSelectedChanged = this.onSelectedChanged.bind(this);
    this.ironSelector.addEventListener('selected-changed', this.boundSelectedChanged);
    this.ironSelector.addEventListener('selected-values-changed', this.boundSelectedChanged);

    if (!ironFormElement && !this.ironCheckedElement && !this.ironSelectable) {
      console.warn(`${getTagName(this.elementRef)} does not implement IronFormElementBehavior, ` +
        `IronCheckedElementBehavior, or IronSelectableBehavior. If this element wraps an ` +
        `element with IronSelectableBehavior, add [ironSelector]="elementRef"`);
    }
  }

  ngAfterViewInit() {
    this.ngControl = this.injector.get(NgControl, null); // tslint:disable-line:no-null-keyword
    /* istanbul ignore else */
    if (this.ngControl) {
      /* istanbul ignore else */
      if (this.ironValidatable) {
        // Custom validators should update native element's validity
        this.statusSub = this.ngControl.statusChanges.subscribe(() => {
          this.elementRef.nativeElement.invalid = this.ngControl.dirty && this.ngControl.invalid;
        });

        // Native element's validate() will be called whenever Angular forms perform validation
        // checks. The side-effect of this is that <iron-form> is not required. Angular forms will
        // work just fine.
        this.ngControl.control.setValidators(Validators.compose([
          this.ngControl.control.validator,
          () => {
            if (this.elementRef.nativeElement.validate()) {
              return null; // tslint:disable-line:no-null-keyword
            } else {
              // IronValidatableBehavior only tells us if something is wrong, not the specifics
              return {
                ironValidatable: true
              };
            }
          }
        ]));
      }
    }
  }

  ngOnDestroy() {
    /* istanbul ignore next */
    if (this.statusSub) {
      this.statusSub.unsubscribe();
    }

    this.ironSelector.removeEventListener('selected-changed', this.boundSelectedChanged);
    this.ironSelector.removeEventListener('selected-values-changed', this.boundSelectedChanged);
  }

  writeValue(obj: any) {
    // When a control is reset, it will write the default value to the control. A Polymer element
    // will also fire a changed event, but we don't need to inform NgControl of this change.
    this.isWritingValue = true;

    if (this.ironCheckedElement) {
      this.renderer.setElementProperty(this.elementRef.nativeElement, 'checked', Boolean(obj));
    } else if (this.ironSelectable || this.ironMultiSelectable) {
      if (this.elementRef.nativeElement.multi) {
        this.renderer.setElementProperty(this.ironSelector, 'selectedValues', obj);
      } else {
        this.renderer.setElementProperty(this.ironSelector, 'selected', obj);
      }
    } else {
      this.renderer.setElementProperty(this.elementRef.nativeElement, 'value', obj);
    }

    this.isWritingValue = false;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.renderer.setElementProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  /* istanbul ignore next */
  protected onChange = (_: any) => { /* noop */ };
  /* istanbul ignore next */
  protected onTouched = () => { /* noop */ };

  @HostListener('value-changed', ['$event'])
  protected onInput(event: Event) {
    if (!this.isWritingValue) {
      this.onChange((<any>event.target).value);
    }
  }

  @HostListener('checked-changed', ['$event'])
  protected onCheckedChanged(event: CustomEvent) {
    if (!this.isWritingValue) {
      this.onChange(event.detail.value);
    }
  }

  @HostListener('blur')
  @HostListener('iron-activate')
  protected onBlurOrActive() {
    this.onTouched();
  }

  protected onSelectedChanged() {
    if (!this.isWritingValue) {
      if (this.ironSelector.multi) {
        this.onChange(this.ironSelector.selectedValues);
      } else {
        this.onChange(this.ironSelector.selected);
      }
    }
  }
}
