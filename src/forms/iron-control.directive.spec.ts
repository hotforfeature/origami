// tslint:disable:max-classes-per-file no-access-missing-member
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, NgControl, Validators } from '@angular/forms';
import {} from 'jasmine';

import { IronControlDirective } from './iron-control.directive';

class FormComponent {
  @ViewChild(IronControlDirective) ironControl: IronControlDirective;
  @ViewChild('control') elementRef: ElementRef;
  get element(): any {
    return this.elementRef.nativeElement;
  }

  get ngControl(): NgControl {
    return (<any>this.ironControl)['ngControl']; // tslint:disable-line:no-string-literal
  }

  model = {
    input: 'Value',
    checkbox: true,
    selector: 0,
    multiSelector: []
  };
}

@Component({
  selector: 'not-iron',
  template: '<div ironControl></div>'
})
class NotIronComponent { }

@Component({
  selector: 'input-component',
  template: '<paper-input #control ironControl required [(ngModel)]="model.input"></paper-input>'
})
class InputComponent extends FormComponent { }

@Component({
  selector: 'checkbox-component',
  template: '<paper-checkbox #control ironControl [(ngModel)]="model.checkbox"></paper-checkbox>'
})
class CheckboxComponent extends FormComponent { }

@Component({
  selector: 'selector-component',
  template: `
    <iron-selector #control ironControl [(ngModel)]="model.selector">
      <div>One</div>
      <div>Two</div>
    </iron-selector>
  `
})
class SelectorComponent extends FormComponent { }

@Component({
  selector: 'multi-selector-component',
  template: `
    <iron-selector #control ironControl multi [(ngModel)]="model.multiSelector">
      <div>One</div>
      <div>Two</div>
    </iron-selector>
  `
})
class MultiSelectorComponent extends FormComponent { }

@Component({
  selector: 'defer-selector-component',
  template: `
    <div #control ironControl [(ngModel)]="model.selector" [ironSelector]="selector">
      <iron-selector #selector>
        <div>One</div>
        <div>Two</div>
      </iron-selector>
    </div>
  `
})
class DeferSelectorComponent extends FormComponent { }

describe('IronControlDirective', () => {
  describe('input', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [
          InputComponent,
          IronControlDirective,
          NotIronComponent
        ]
      });
    });

    describe('ngOnInit()', () => {
      it('should warn if element is not known iron element', async(() => {
        spyOn(console, 'warn');
        const notIronFixture = TestBed.createComponent(NotIronComponent);
        notIronFixture.detectChanges();
        notIronFixture.whenStable().then(() => {
          expect(console.warn).toHaveBeenCalledWith(jasmine.stringMatching('<div>'));
        });
      }));
    });

    describe('ngAfterViewInit()', () => {
      it('should update element invalid property if NgControl is dirty and invalid', async(() => {
        const fixture = TestBed.createComponent(InputComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.element.invalid).toBe(false);
          fixture.componentInstance.ngControl.control.markAsDirty();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.element.invalid).toBe(false);
          fixture.componentInstance.model.input = null; // tslint:disable-line:no-null-keyword
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.ngControl.invalid).toBe(true);
          expect(fixture.componentInstance.element.invalid).toBe(true);
        });
      }));

      it('should add element validate() function to NgControl validators', async(() => {
        const fixture = TestBed.createComponent(InputComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          spyOn(fixture.componentInstance.element, 'validate').and.callThrough();
          fixture.componentInstance.ngControl.control.updateValueAndValidity();
          expect(fixture.componentInstance.element.validate).toHaveBeenCalledTimes(1);
        });
      }));

      it('should set ironValidatable error if element validate() returns false', async(() => {
        const fixture = TestBed.createComponent(InputComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          spyOn(fixture.componentInstance.element, 'validate').and.returnValue(false);
          fixture.componentInstance.ngControl.control.updateValueAndValidity();
          expect(fixture.componentInstance.ngControl.control.hasError('ironValidatable'))
            .toBe(true);
        });
      }));
    });

    describe('writeValue()', () => {
      it('should set value property of form element', async(() => {
        const fixture = TestBed.createComponent(InputComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.element.value).toBe('Value');
          fixture.componentInstance.model.input = 'New Value';
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.element.value).toBe('New Value');
        });
      }));

      it('should not mark controls as dirty when resetting', async(() => {
        const fixture = TestBed.createComponent(InputComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.componentInstance.element.value = 'New Value';
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.ngControl.dirty).toBe(true);
          fixture.componentInstance.ngControl.reset();
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.ngControl.dirty).toBe(false);
        });
      }));
    });

    describe('registerOnChange()', () => {
      it('should detect input changes', async(() => {
        const fixture = TestBed.createComponent(InputComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.model.input).toBe('Value');
          fixture.componentInstance.element.value = 'New Value';
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.model.input).toBe('New Value');
        });
      }));
    });

    describe('registerOnTouched()', () => {
      it('should detect input blur', async(() => {
        const fixture = TestBed.createComponent(InputComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.ngControl.touched).toBe(false);
          fixture.componentInstance.element.dispatchEvent(new Event('blur'));
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.ngControl.touched).toBe(true);
        });
      }));
    });

    describe('setDisabledState()', () => {
      it('should set disabled property', () => {
        const fixture = TestBed.createComponent(InputComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.ngControl.disabled).toBe(false);
          fixture.componentInstance.ngControl.control.disable();
          expect(fixture.componentInstance.element.disabled).toBe(true);
          fixture.componentInstance.ngControl.control.enable();
          expect(fixture.componentInstance.element.disabled).toBe(false);
        });
      });
    });
  });

  describe('checkbox', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [
          CheckboxComponent,
          IronControlDirective
        ]
      });
    });

    describe('writeValue()', () => {
      it('should set checked property of IronCheckedElementBehavior', async(() => {
        const fixture = TestBed.createComponent(CheckboxComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.element.checked).toBe(true);
          fixture.componentInstance.model.checkbox = false;
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.element.checked).toBe(false);
        });
      }));
    });

    describe('registerOnChange()', () => {
      it('should detect checkbox changes', async(() => {
        const fixture = TestBed.createComponent(CheckboxComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.model.checkbox).toBe(true);
          fixture.componentInstance.element.checked = false;
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.model.checkbox).toBe(false);
        });
      }));
    });
  });

  describe('selector', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [
          DeferSelectorComponent,
          IronControlDirective,
          MultiSelectorComponent,
          SelectorComponent
        ]
      });
    });

    describe('writeValue()', () => {
      it('should set selected property of IronSelectableBehavior', async(() => {
        const fixture = TestBed.createComponent(SelectorComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.element.selected).toBe(0);
          fixture.componentInstance.model.selector = 1;
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.element.selected).toBe(1);
        });
      }));

      it('should set selected property of deferred ironSelector', async(() => {
        const fixture = TestBed.createComponent(DeferSelectorComponent);
        const deferred = fixture.componentInstance.element.querySelector('iron-selector');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(deferred.selected).toBe(0);
          fixture.componentInstance.model.selector = 1;
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(deferred.selected).toBe(1);
        });
      }));

      it('should set selectedValues property of multi IronSelectableBehavior', async(() => {
        const fixture = TestBed.createComponent(MultiSelectorComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.element.selectedValues).toEqual([]);
          fixture.componentInstance.model.multiSelector = [0, 1];
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.element.selectedValues).toEqual([0, 1]);
        });
      }));
    });

    describe('registerOnChange()', () => {
      it('should detect select value changes', async(() => {
        const fixture = TestBed.createComponent(SelectorComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.model.selector).toBe(0);
          fixture.componentInstance.element.selected = 1;
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.model.selector).toBe(1);
        });
      }));

      it('should detect deferred select value changes', async(() => {
        const fixture = TestBed.createComponent(DeferSelectorComponent);
        const deferred = fixture.componentInstance.element.querySelector('iron-selector');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.model.selector).toBe(0);
          deferred.selected = 1;
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.model.selector).toBe(1);
        });
      }));

      it('should detect selected values change', async(() => {
        const fixture = TestBed.createComponent(MultiSelectorComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.model.multiSelector).toEqual([]);
          fixture.componentInstance.element.selectedValues = [0, 1];
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.model.multiSelector).toEqual([0, 1]);
        });
      }));
    });

    describe('registerOnTouched()', () => {
      it('should detect select iron-active events', async(() => {
        const fixture = TestBed.createComponent(SelectorComponent);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.ngControl.touched).toBe(false);
          fixture.componentInstance.element.dispatchEvent(new CustomEvent('iron-activate'));
          fixture.detectChanges();
          return fixture.whenStable();
        }).then(() => {
          expect(fixture.componentInstance.ngControl.touched).toBe(true);
        });
      }));
    });
  });
});
