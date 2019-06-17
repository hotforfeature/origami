import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/paper-checkbox/paper-checkbox';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-listbox/paper-listbox';
import '@vaadin/vaadin-checkbox/vaadin-checkbox';
import '@vaadin/vaadin-combo-box/vaadin-combo-box';
import '@vaadin/vaadin-date-picker/vaadin-date-picker';
import { OrigamiControlValueAccessor } from './value-accessor';

describe('forms', () => {
  describe('OrigamiControlValueAccessor', () => {
    // Avoid Promise issues with fakeAsync and vaadin statistics
    localStorage.setItem('vaadin.statistics.optout', 'true');

    class BaseWithAccessor {
      @ViewChild(OrigamiControlValueAccessor, { static: true })
      accessor?: OrigamiControlValueAccessor;
    }

    class BaseWithValue<T> extends BaseWithAccessor {
      value?: T;
    }

    class BaseWithForm extends BaseWithAccessor {
      get control(): FormControl {
        return <FormControl>this.form.get('value');
      }
      form = new FormGroup({ value: new FormControl() });
    }

    function isBaseWithForm(value: any): value is BaseWithForm {
      return !!value.control;
    }

    // <paper-input>

    @Component({
      template: `
        <paper-input [(ngModel)]="value" origami></paper-input>
      `
    })
    class PaperInputNgModel extends BaseWithValue<string> {}

    @Component({
      template: `
        <form [formGroup]="form">
          <paper-input formControlName="value" origami></paper-input>
        </form>
      `
    })
    class PaperInputFormControlName extends BaseWithForm {}

    @Component({
      template: `
        <form [formGroup]="form">
          <paper-input [formControl]="control" origami></paper-input>
        </form>
      `
    })
    class PaperInputFormControl extends BaseWithForm {}

    // <vaadin-date-picker>

    @Component({
      template: `
        <vaadin-date-picker [(ngModel)]="value" origami></vaadin-date-picker>
      `
    })
    class VaadinDatePickerNgModel extends BaseWithValue<string> {}

    @Component({
      template: `
        <form [formGroup]="form">
          <vaadin-date-picker
            formControlName="value"
            origami
          ></vaadin-date-picker>
        </form>
      `
    })
    class VaadinDatePickerFormControlName extends BaseWithForm {}

    @Component({
      template: `
        <form [formGroup]="form">
          <vaadin-date-picker
            [formControl]="control"
            origami
          ></vaadin-date-picker>
        </form>
      `
    })
    class VaadinDatePickerFormControl extends BaseWithForm {}

    // <paper-checkbox>

    @Component({
      template: `
        <paper-checkbox [(ngModel)]="value" origami></paper-checkbox>
      `
    })
    class PaperCheckboxNgModel extends BaseWithValue<boolean> {}

    @Component({
      template: `
        <form [formGroup]="form">
          <paper-checkbox formControlName="value" origami></paper-checkbox>
        </form>
      `
    })
    class PaperCheckboxFormControlName extends BaseWithForm {}

    @Component({
      template: `
        <form [formGroup]="form">
          <paper-checkbox [formControl]="control" origami></paper-checkbox>
        </form>
      `
    })
    class PaperCheckboxFormControl extends BaseWithForm {}

    // <vaadin-checkbox>

    @Component({
      template: `
        <vaadin-checkbox [(ngModel)]="value" origami></vaadin-checkbox>
      `
    })
    class VaadinCheckboxNgModel extends BaseWithValue<boolean> {}

    @Component({
      template: `
        <form [formGroup]="form">
          <vaadin-checkbox formControlName="value" origami></vaadin-checkbox>
        </form>
      `
    })
    class VaadinCheckboxFormControlName extends BaseWithForm {}

    @Component({
      template: `
        <form [formGroup]="form">
          <vaadin-checkbox [formControl]="control" origami></vaadin-checkbox>
        </form>
      `
    })
    class VaadinCheckboxFormControl extends BaseWithForm {}

    // <paper-listbox>

    @Component({
      template: `
        <paper-listbox [multi]="multi" [(ngModel)]="value" origami>
          <paper-item>First</paper-item>
          <paper-item>Second</paper-item>
        </paper-listbox>
      `
    })
    class PaperListboxNgModel extends BaseWithValue<number | number[]> {
      multi = false;
    }

    @Component({
      template: `
        <form [formGroup]="form">
          <paper-listbox [multi]="multi" formControlName="value" origami>
            <paper-item>First</paper-item>
            <paper-item>Second</paper-item>
          </paper-listbox>
        </form>
      `
    })
    class PaperListboxFormControlName extends BaseWithForm {
      multi = false;
    }

    @Component({
      template: `
        <form [formGroup]="form">
          <paper-listbox [multi]="multi" [formControl]="control" origami>
            <paper-item>First</paper-item>
            <paper-item>Second</paper-item>
          </paper-listbox>
        </form>
      `
    })
    class PaperListboxFormControl extends BaseWithForm {
      multi = false;
    }

    // <vaadin-combo-box>

    @Component({
      template: `
        <vaadin-combo-box
          [items]="items"
          [(ngModel)]="value"
          origami
        ></vaadin-combo-box>
      `
    })
    class VaadinComboBoxNgModel extends BaseWithValue<string> {
      items = ['foo', 'bar'];
    }

    @Component({
      template: `
        <form [formGroup]="form">
          <vaadin-combo-box
            [items]="items"
            formControlName="value"
            origami
          ></vaadin-combo-box>
        </form>
      `
    })
    class VaadinComboBoxFormControlName extends BaseWithForm {
      items = ['foo', 'bar'];
    }

    @Component({
      template: `
        <form [formGroup]="form">
          <vaadin-combo-box
            [items]="items"
            [formControl]="control"
            origami
          ></vaadin-combo-box>
        </form>
      `
    })
    class VaadinComboBoxFormControl extends BaseWithForm {
      items = ['foo', 'bar'];
    }

    // A custom element with selectedItems that is not readonly
    class SelectedItems extends PolymerElement {
      static get is() {
        return 'value-accessor-selected-items';
      }
      static get template() {
        return html``;
      }

      static get properties() {
        return {
          items: {
            type: Array,
            value() {
              return ['foo', 'bar'];
            },
            notify: true
          },
          selectedItems: {
            type: Array,
            value() {
              return [];
            },
            notify: true
          }
        };
      }
    }

    customElements.define(SelectedItems.is, SelectedItems);

    // SelectedItems

    @Component({
      template: `
        <value-accessor-selected-items
          [(ngModel)]="value"
          origami
        ></value-accessor-selected-items>
      `
    })
    class SelectedItemsNgModel extends BaseWithValue<string[]> {}

    @Component({
      template: `
        <form [formGroup]="form">
          <value-accessor-selected-items
            formControlName="value"
            origami
          ></value-accessor-selected-items>
        </form>
      `
    })
    class SelectedItemsFormControlName extends BaseWithForm {}

    @Component({
      template: `
        <form [formGroup]="form">
          <value-accessor-selected-items
            [formControl]="control"
            origami
          ></value-accessor-selected-items>
        </form>
      `
    })
    class SelectedItemsFormControl extends BaseWithForm {}

    // A custom element with selectedValues that is not readonly
    class SelectedValues extends PolymerElement {
      static get is() {
        return 'value-accessor-selected-values';
      }
      static get template() {
        return html``;
      }

      static get properties() {
        return {
          items: {
            type: Array,
            value() {
              return ['foo', 'bar'];
            },
            notify: true
          },
          selectedValues: {
            type: Array,
            value() {
              return [];
            },
            notify: true
          }
        };
      }
    }

    customElements.define(SelectedValues.is, SelectedValues);

    // SelectedValues

    @Component({
      template: `
        <value-accessor-selected-values
          [(ngModel)]="value"
          origami
        ></value-accessor-selected-values>
      `
    })
    class SelectedValuesNgModel extends BaseWithValue<number[]> {}

    @Component({
      template: `
        <form [formGroup]="form">
          <value-accessor-selected-values
            formControlName="value"
            origami
          ></value-accessor-selected-values>
        </form>
      `
    })
    class SelectedValuesFormControlName extends BaseWithForm {}

    @Component({
      template: `
        <form [formGroup]="form">
          <value-accessor-selected-values
            [formControl]="control"
            origami
          ></value-accessor-selected-values>
        </form>
      `
    })
    class SelectedValuesFormControl extends BaseWithForm {}

    function getInstValue<T>(
      inst: BaseWithValue<T> | BaseWithForm
    ): T | undefined {
      if (isBaseWithForm(inst)) {
        return inst.control.value;
      } else {
        return inst.value;
      }
    }

    function setInstValue<T>(inst: BaseWithValue<T> | BaseWithForm, value?: T) {
      if (isBaseWithForm(inst)) {
        inst.control.setValue(value);
      } else {
        inst.value = value;
      }
    }

    function testAngularToPolymer<T>(
      fixture: ComponentFixture<BaseWithValue<T> | BaseWithForm>,
      elementTag: string,
      elementProperty: string,
      newValue: T
    ) {
      const element = fixture.nativeElement.querySelector(elementTag);
      expect(getInstValue(fixture.componentInstance)).not.toEqual(
        newValue,
        'subsequent tests should specify different values'
      );
      expect(element[elementProperty]).not.toEqual(
        newValue,
        'element is already set to new value'
      );
      setInstValue(fixture.componentInstance, newValue);
      fixture.detectChanges();
      tick(100);
      expect(getInstValue(fixture.componentInstance)).toEqual(
        newValue,
        'Angular -> Polymer, Angular not updated'
      );
      expect(element[elementProperty]).toEqual(
        newValue,
        'Angular -> Polymer, Polymer not updated'
      );
    }

    function testPolymerToAngular<T>(
      fixture: ComponentFixture<BaseWithValue<T> | BaseWithForm>,
      elementTag: string,
      elementProperty: string,
      newValue: T
    ) {
      const element = fixture.nativeElement.querySelector(elementTag);
      expect(getInstValue(fixture.componentInstance)).not.toEqual(
        newValue,
        'subsequent tests should specify different values'
      );
      expect(element[elementProperty]).not.toEqual(
        newValue,
        'element is already set to new value'
      );
      element[elementProperty] = newValue;
      fixture.detectChanges();
      tick(100);
      expect(element[elementProperty]).toEqual(
        newValue,
        'Polymer -> Angular, Polymer not updated'
      );
      expect(getInstValue(fixture.componentInstance)).toEqual(
        newValue,
        'Polymer -> Angular, Angular not updated'
      );
    }

    describe('control', () => {
      it('should connect to default elements with ngModel', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [FormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperInputNgModel,
            VaadinDatePickerNgModel
          ]
        });

        let fixture = TestBed.createComponent(PaperInputNgModel);
        testAngularToPolymer(fixture, 'paper-input', 'value', 'foo');
        testPolymerToAngular(fixture, 'paper-input', 'value', 'bar');
        fixture = TestBed.createComponent(VaadinDatePickerNgModel);
        testAngularToPolymer(
          fixture,
          'vaadin-date-picker',
          'value',
          '2018-01-01'
        );
        testPolymerToAngular(
          fixture,
          'vaadin-date-picker',
          'value',
          '2018-02-01'
        );
      }));

      it('should connect to default elements with formControlName', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperInputFormControlName,
            VaadinDatePickerFormControlName
          ]
        });

        let fixture = TestBed.createComponent(PaperInputFormControlName);
        testAngularToPolymer(fixture, 'paper-input', 'value', 'foo');
        testPolymerToAngular(fixture, 'paper-input', 'value', 'bar');
        fixture = TestBed.createComponent(VaadinDatePickerFormControlName);
        testAngularToPolymer(
          fixture,
          'vaadin-date-picker',
          'value',
          '2018-01-01'
        );
        testPolymerToAngular(
          fixture,
          'vaadin-date-picker',
          'value',
          '2018-02-01'
        );
      }));

      it('should connect to default elements with formControl', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperInputFormControl,
            VaadinDatePickerFormControl
          ]
        });

        let fixture = TestBed.createComponent(PaperInputFormControl);
        testAngularToPolymer(fixture, 'paper-input', 'value', 'foo');
        testPolymerToAngular(fixture, 'paper-input', 'value', 'bar');
        fixture = TestBed.createComponent(VaadinDatePickerFormControl);
        testAngularToPolymer(
          fixture,
          'vaadin-date-picker',
          'value',
          '2018-01-01'
        );
        testPolymerToAngular(
          fixture,
          'vaadin-date-picker',
          'value',
          '2018-02-01'
        );
      }));

      it('should connect to checkbox elements with ngModel', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [FormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperCheckboxNgModel,
            VaadinCheckboxNgModel
          ]
        });

        let fixture = TestBed.createComponent(PaperCheckboxNgModel);
        testAngularToPolymer(fixture, 'paper-checkbox', 'checked', true);
        testPolymerToAngular(fixture, 'paper-checkbox', 'checked', false);
        fixture = TestBed.createComponent(VaadinCheckboxNgModel);
        testAngularToPolymer(fixture, 'vaadin-checkbox', 'checked', true);
        testPolymerToAngular(fixture, 'vaadin-checkbox', 'checked', false);
      }));

      it('should connect to checkbox elements with formControlName', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperCheckboxFormControlName,
            VaadinCheckboxFormControlName
          ]
        });

        let fixture = TestBed.createComponent(PaperCheckboxFormControlName);
        testAngularToPolymer(fixture, 'paper-checkbox', 'checked', true);
        testPolymerToAngular(fixture, 'paper-checkbox', 'checked', false);
        fixture = TestBed.createComponent(VaadinCheckboxFormControlName);
        testAngularToPolymer(fixture, 'vaadin-checkbox', 'checked', true);
        testPolymerToAngular(fixture, 'vaadin-checkbox', 'checked', false);
      }));

      it('should connect to checkbox elements with formControl', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperCheckboxFormControl,
            VaadinCheckboxFormControl
          ]
        });

        let fixture = TestBed.createComponent(PaperCheckboxFormControl);
        testAngularToPolymer(fixture, 'paper-checkbox', 'checked', true);
        testPolymerToAngular(fixture, 'paper-checkbox', 'checked', false);
        fixture = TestBed.createComponent(VaadinCheckboxFormControl);
        testAngularToPolymer(fixture, 'vaadin-checkbox', 'checked', true);
        testPolymerToAngular(fixture, 'vaadin-checkbox', 'checked', false);
      }));

      it('should connect to select elements with ngModel', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [FormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperListboxNgModel,
            VaadinComboBoxNgModel
          ]
        });

        const fixture = TestBed.createComponent(PaperListboxNgModel);
        testAngularToPolymer(fixture, 'paper-listbox', 'selected', 0);
        testPolymerToAngular(fixture, 'paper-listbox', 'selected', 1);
        const fixture2 = TestBed.createComponent(VaadinComboBoxNgModel);
        testAngularToPolymer(
          fixture2,
          'vaadin-combo-box',
          'selectedItem',
          'foo'
        );
        testPolymerToAngular(
          fixture2,
          'vaadin-combo-box',
          'selectedItem',
          'bar'
        );
      }));

      it('should connect to select elements with formControlName', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperListboxFormControlName,
            VaadinComboBoxFormControlName
          ]
        });

        const fixture = TestBed.createComponent(PaperListboxFormControlName);
        testAngularToPolymer(fixture, 'paper-listbox', 'selected', 0);
        testPolymerToAngular(fixture, 'paper-listbox', 'selected', 1);
        const fixture2 = TestBed.createComponent(VaadinComboBoxFormControlName);
        testAngularToPolymer(
          fixture2,
          'vaadin-combo-box',
          'selectedItem',
          'foo'
        );
        testPolymerToAngular(
          fixture2,
          'vaadin-combo-box',
          'selectedItem',
          'bar'
        );
      }));

      it('should connect to select elements with formControl', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperListboxFormControl,
            VaadinComboBoxFormControl
          ]
        });

        const fixture = TestBed.createComponent(PaperListboxFormControl);
        testAngularToPolymer(fixture, 'paper-listbox', 'selected', 0);
        testPolymerToAngular(fixture, 'paper-listbox', 'selected', 1);
        const fixture2 = TestBed.createComponent(VaadinComboBoxFormControl);
        testAngularToPolymer(
          fixture2,
          'vaadin-combo-box',
          'selectedItem',
          'foo'
        );
        testPolymerToAngular(
          fixture2,
          'vaadin-combo-box',
          'selectedItem',
          'bar'
        );
      }));

      it('should connect to multi-select elements with ngModel', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [FormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperListboxNgModel,
            SelectedItemsNgModel,
            SelectedValuesNgModel
          ]
        });

        const fixture = TestBed.createComponent(PaperListboxNgModel);
        fixture.componentInstance.multi = true;
        fixture.detectChanges();
        testAngularToPolymer(fixture, 'paper-listbox', 'selectedValues', [
          0,
          1
        ]);
        testPolymerToAngular(fixture, 'paper-listbox', 'selectedValues', [1]);
        const fixture2 = TestBed.createComponent(SelectedItemsNgModel);
        testAngularToPolymer(fixture2, SelectedItems.is, 'selectedItems', [
          'foo'
        ]);
        testPolymerToAngular(fixture2, SelectedItems.is, 'selectedItems', [
          'foo',
          'bar'
        ]);
        const fixture3 = TestBed.createComponent(SelectedValuesNgModel);
        testAngularToPolymer(fixture3, SelectedValues.is, 'selectedValues', [
          0
        ]);
        testPolymerToAngular(fixture3, SelectedValues.is, 'selectedValues', [
          0,
          1
        ]);
      }));

      it('should connect to multi-select elements with formControlName', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperListboxFormControlName,
            SelectedItemsFormControlName,
            SelectedValuesFormControlName
          ]
        });

        const fixture = TestBed.createComponent(PaperListboxFormControlName);
        fixture.componentInstance.multi = true;
        fixture.detectChanges();
        testAngularToPolymer(fixture, 'paper-listbox', 'selectedValues', [
          0,
          1
        ]);
        testPolymerToAngular(fixture, 'paper-listbox', 'selectedValues', [1]);
        const fixture2 = TestBed.createComponent(SelectedItemsFormControlName);
        testAngularToPolymer(fixture2, SelectedItems.is, 'selectedItems', [
          'foo'
        ]);
        testPolymerToAngular(fixture2, SelectedItems.is, 'selectedItems', [
          'foo',
          'bar'
        ]);
        const fixture3 = TestBed.createComponent(SelectedValuesFormControlName);
        testAngularToPolymer(fixture3, SelectedValues.is, 'selectedValues', [
          0
        ]);
        testPolymerToAngular(fixture3, SelectedValues.is, 'selectedValues', [
          0,
          1
        ]);
      }));

      it('should connect to multi-select elements with formControl', fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperListboxFormControl,
            SelectedItemsFormControl,
            SelectedValuesFormControl
          ]
        });

        const fixture = TestBed.createComponent(PaperListboxFormControl);
        fixture.componentInstance.multi = true;
        fixture.detectChanges();
        testAngularToPolymer(fixture, 'paper-listbox', 'selectedValues', [
          0,
          1
        ]);
        testPolymerToAngular(fixture, 'paper-listbox', 'selectedValues', [1]);
        const fixture2 = TestBed.createComponent(SelectedItemsFormControl);
        testAngularToPolymer(fixture2, SelectedItems.is, 'selectedItems', [
          'foo'
        ]);
        testPolymerToAngular(fixture2, SelectedItems.is, 'selectedItems', [
          'foo',
          'bar'
        ]);
        const fixture3 = TestBed.createComponent(SelectedValuesFormControl);
        testAngularToPolymer(fixture3, SelectedValues.is, 'selectedValues', [
          0
        ]);
        testPolymerToAngular(fixture3, SelectedValues.is, 'selectedValues', [
          0,
          1
        ]);
      }));
    });

    describe('validation', () => {
      it('should do nothing if element does not have "invalid"', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, SelectedItemsFormControl]
        });

        const fixture = TestBed.createComponent(SelectedItemsFormControl);
        fixture.detectChanges();
        const element = fixture.nativeElement.querySelector(SelectedItems.is);
        const { control } = fixture.componentInstance;
        expect('invalid' in element).toBe(false);
        control.setValidators(Validators.required);
        control.markAsDirty();
        control.updateValueAndValidity();
        expect(control.invalid).toBe(true, 'control should be invalid');
        expect(control.dirty).toBe(true, 'control should be dirty');
        expect(element.invalid).toBeUndefined();
      });

      it('should set invalid when control is invalid and dirty', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture = TestBed.createComponent(PaperInputFormControl);
        fixture.detectChanges();
        const element = fixture.nativeElement.querySelector('paper-input');
        const { control } = fixture.componentInstance;
        expect(element.invalid).toBeFalsy();
        control.markAsDirty();
        control.setValidators(Validators.required);
        control.updateValueAndValidity();
        expect(control.invalid).toBe(true, 'control should be invalid');
        expect(control.dirty).toBe(true, 'control should be dirty');
        expect(element.invalid).toBe(true, 'element should be invalid');
        control.setValue('foo');
        expect(control.invalid).toBe(false, 'control should not be invalid');
        expect(element.invalid).toBe(false, 'element should not be invalid');
      });

      it('should set invalid using isInvalid function if present', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture = TestBed.createComponent(PaperInputFormControl);
        fixture.detectChanges();
        const element = fixture.nativeElement.querySelector('paper-input');
        const { control } = fixture.componentInstance;
        const isInvalid = jasmine
          .createSpy()
          .and.callFake((control: AbstractControl) => {
            return control.invalid;
          });

        fixture.componentInstance.accessor!.isInvalid = isInvalid;

        expect(element.invalid).toBeFalsy();
        control.setValidators(Validators.required);
        control.updateValueAndValidity();
        expect(control.invalid).toBe(true, 'control should be invalid');
        expect(control.dirty).toBe(false, 'control should not be dirty');
        expect(element.invalid).toBe(true, 'element should be invalid');
        expect(isInvalid).toHaveBeenCalledTimes(1);
        control.setValue('foo');
        expect(control.invalid).toBe(false, 'control should not be invalid');
        expect(element.invalid).toBe(false, 'element should not be invalid');
        expect(isInvalid).toHaveBeenCalledTimes(2);
      });

      it('should call element validate() function as part of control validators', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture = TestBed.createComponent(PaperInputFormControl);
        fixture.detectChanges();
        const { control } = fixture.componentInstance;
        const element = fixture.nativeElement.querySelector('paper-input');
        const validateSpy = spyOn(element, 'validate').and.returnValue(false);
        expect(element.invalid).toBeFalsy();
        expect(control.invalid).toBeFalsy();
        control.updateValueAndValidity();
        expect(element.validate).toHaveBeenCalled();
        expect(control.invalid).toBe(true, 'control should be invalid');
        validateSpy.and.returnValue(true);
        control.updateValueAndValidity();
        expect(element.validate).toHaveBeenCalled();
        expect(control.invalid).toBe(false, 'control should be valid');
      });

      it('should set validationErrorsKey to true when element validate() returns false', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture = TestBed.createComponent(PaperInputFormControl);
        fixture.detectChanges();
        const { control, accessor } = fixture.componentInstance;
        const element = fixture.nativeElement.querySelector('paper-input');
        spyOn(element, 'validate').and.returnValue(false);
        expect(control.errors).toBeFalsy();
        control.updateValueAndValidity();
        expect(control.invalid).toBe(true, 'control should be invalid');
        expect(control.errors).toEqual({
          [accessor!.validationErrorsKey]: true
        });

        accessor!.validationErrorsKey = 'customError';
        control.updateValueAndValidity();
        expect(control.errors).toEqual({
          customError: true
        });
      });

      it('should update value and validity if invalid changes from element', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture = TestBed.createComponent(PaperInputFormControl);
        fixture.detectChanges();
        const element = fixture.nativeElement.querySelector('paper-input');
        const { control } = fixture.componentInstance;
        control.markAsDirty();
        control.updateValueAndValidity();
        expect(control.invalid).toBe(false, 'control should not be invalid');
        spyOn(element, 'validate').and.returnValue(false);
        element.invalid = true;
        expect(control.invalid).toBe(true, 'control should be invalid');
      });
    });

    describe('isCheckedElement()', () => {
      it('should return true if element has "checked"', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperCheckboxFormControl,
            VaadinCheckboxFormControl
          ]
        });

        let fixture = TestBed.createComponent(PaperCheckboxFormControl);
        const accessor = fixture.componentInstance.accessor!;
        expect(
          accessor.isCheckedElement(
            fixture.nativeElement.querySelector('paper-checkbox')
          )
        ).toBe(true, '<paper-checkbox> is a checkbox');
        fixture = TestBed.createComponent(VaadinCheckboxFormControl);
        expect(
          accessor.isCheckedElement(
            fixture.nativeElement.querySelector('vaadin-checkbox')
          )
        ).toBe(true, '<vaadin-checkbox> is a checkbox');
      });

      it('should return false otherwise', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture = TestBed.createComponent(PaperInputFormControl);
        const accessor = fixture.componentInstance.accessor!;
        expect(
          accessor.isCheckedElement(
            fixture.nativeElement.querySelector('paper-input')
          )
        ).toBe(false, '<paper-input> is not a checkbox');
      });
    });

    describe('isSelectable()', () => {
      it('should return true if element has "selected"', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperListboxFormControl]
        });

        const fixture = TestBed.createComponent(PaperListboxFormControl);
        const accessor = fixture.componentInstance.accessor!;
        const element = fixture.nativeElement.querySelector('paper-listbox');
        expect('selected' in element).toBe(
          true,
          '<paper-listbox> should have "selected"'
        );
        expect(accessor.isSelectable(element)).toBe(
          true,
          '<paper-listbox> is selectable'
        );
      });

      it('should return true if element has "selectedItem"', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [
            OrigamiControlValueAccessor,
            PaperListboxFormControl,
            VaadinComboBoxFormControl
          ]
        });

        let fixture: ComponentFixture<any> = TestBed.createComponent(
          PaperListboxFormControl
        );
        const accessor = fixture.componentInstance.accessor!;
        let element = fixture.nativeElement.querySelector('paper-listbox');
        expect('selectedItem' in element).toBe(
          true,
          '<paper-listbox> should have "selectedItem"'
        );
        expect(accessor.isSelectable(element)).toBe(
          true,
          '<paper-listbox> is selectable'
        );
        fixture = TestBed.createComponent(VaadinComboBoxFormControl);
        element = fixture.nativeElement.querySelector('vaadin-combo-box');
        expect('selectedItem' in element).toBe(
          true,
          '<vaadin-combo-box> should have "selectedItem"'
        );
        expect(
          accessor.isSelectable(
            fixture.nativeElement.querySelector('vaadin-combo-box')
          )
        ).toBe(true, '<vaadin-combo-box> is selectable');
      });

      it('should return false otherwise', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture = TestBed.createComponent(PaperInputFormControl);
        const accessor = fixture.componentInstance.accessor!;
        expect(
          accessor.isSelectable(
            fixture.nativeElement.querySelector('paper-input')
          )
        ).toBe(false, '<paper-input> is not selectable');
      });
    });

    describe('isMultiSelectable()', () => {
      it('should return true if selectable element has "selectedValues" or "selectedItems" and "multi" is true', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture: ComponentFixture<any> = TestBed.createComponent(
          PaperInputFormControl
        );
        const accessor = fixture.componentInstance.accessor!;
        let element: any = { selected: null, selectedValues: [] };
        expect(accessor.isSelectable(element)).toBe(
          true,
          'element with "selected" should be selectable'
        );
        element.multi = false;
        expect(accessor.isMultiSelectable(element)).toBe(
          false,
          'element with "selectedValues" and multi false is not multi-selectable'
        );
        element.multi = true;
        expect(accessor.isMultiSelectable(element)).toBe(
          true,
          'element with "selectedValues" and multi true is multi-selectable'
        );
        element = { selectedItem: null, selectedItems: [] };
        expect(accessor.isSelectable(element)).toBe(
          true,
          'element with "selectedItem" should be selectable'
        );
        element.multi = false;
        expect(accessor.isMultiSelectable(element)).toBe(
          false,
          'element with "selectedItems" and multi false is not multi-selectable'
        );
        element.multi = true;
        expect(accessor.isMultiSelectable(element)).toBe(
          true,
          'element with "selectedItems" and multi true is multi-selectable'
        );
      });

      it('should return true if element is not selectable and has "selectedValues" or "selectedItems"', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture: ComponentFixture<any> = TestBed.createComponent(
          PaperInputFormControl
        );
        const accessor = fixture.componentInstance.accessor!;
        let element: any = { selectedValues: [] };
        expect(accessor.isSelectable(element)).toBe(
          false,
          'element should not be selectable'
        );
        expect(accessor.isMultiSelectable(element)).toBe(
          true,
          'non-selectable element with "selectedValues" is multi-selectable'
        );
        element = { selectedItems: [] };
        expect(accessor.isSelectable(element)).toBe(
          false,
          'element should not be selectable'
        );
        expect(accessor.isMultiSelectable(element)).toBe(
          true,
          'non-selectable element with "selectedItems" is multi-selectable'
        );
      });

      it('should return false otherwise', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture = TestBed.createComponent(PaperInputFormControl);
        const accessor = fixture.componentInstance.accessor!;
        expect(
          accessor.isMultiSelectable(
            fixture.nativeElement.querySelector('paper-input')
          )
        ).toBe(false, '<paper-input> is not multi-selectable');
      });
    });

    describe('isValidatable()', () => {
      it('should return true if the element has "invalid"', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture = TestBed.createComponent(PaperInputFormControl);
        const accessor = fixture.componentInstance.accessor!;
        expect(accessor.isValidatable({ invalid: false })).toBe(
          true,
          'element has "invalid" false'
        );
        expect(accessor.isValidatable({ invalid: true })).toBe(
          true,
          'element has "invalid" true'
        );
      });

      it('should return false otherwise', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture = TestBed.createComponent(PaperInputFormControl);
        const accessor = fixture.componentInstance.accessor!;
        expect(accessor.isValidatable({})).toBe(
          false,
          'element does not have "invalid"'
        );
      });
    });

    describe('shouldUseValidate()', () => {
      it('should return true if element has validate() validate mutates "invalid"', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture = TestBed.createComponent(PaperInputFormControl);
        const accessor = fixture.componentInstance.accessor!;
        const element = {
          invalid: false,
          validate() {
            if (element.invalid) {
              element.invalid = false;
            }

            return !element.invalid;
          }
        };

        expect(accessor.shouldUseValidate(element)).toBe(
          true,
          'element mutates invalid'
        );
        expect(element.invalid).toBe(
          false,
          'should return invalid to original state'
        );
      });

      it('should return false if element has validate() and does not mutate "invalid"', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture = TestBed.createComponent(PaperInputFormControl);
        const accessor = fixture.componentInstance.accessor!;
        const element = {
          invalid: false,
          validate() {
            return element.invalid;
          }
        };

        expect(accessor.shouldUseValidate(element)).toBe(
          false,
          'element does not mutate invalid'
        );
        expect(element.invalid).toBe(
          false,
          'should return invalid to original state'
        );
      });

      it('should return false if element does not have validate()', () => {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          declarations: [OrigamiControlValueAccessor, PaperInputFormControl]
        });

        const fixture = TestBed.createComponent(PaperInputFormControl);
        const accessor = fixture.componentInstance.accessor!;
        expect(accessor.shouldUseValidate({ invalid: false })).toBe(
          false,
          'element does not have "validate"'
        );
        expect(
          accessor.shouldUseValidate({ invalid: false, validate: false })
        ).toBe(false, 'element "validate" is not a function');
      });
    });
  });
});
