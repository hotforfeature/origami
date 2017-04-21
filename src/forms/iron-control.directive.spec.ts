import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import {} from 'jasmine';

import { IronControlDirective } from './iron-control.directive';

class FormComponent {
  @ViewChild('template') templateForm: NgForm;
  model = {
    input: 'Value',
    checkbox: true,
    selector: 0,
    multiSelector: []
  };

  reactiveForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.reactiveForm = fb.group({
      input: ['Value', Validators.required],
      checkbox: [true],
      selector: [0],
      multiSelector: [[]]
    });
  }
}

@Component({
  selector: 'input-component',
  template: `
    <form #template="ngForm" id="template">
      <paper-input name="input" ironControl required [(ngModel)]="model.input"></paper-input>
    </form>
    <form id="reactive" [formGroup]="reactiveForm">
      <paper-input formControlName="input" ironControl></paper-input>
    </form>
  `
})
class InputComponent extends FormComponent {
  constructor(fb: FormBuilder) { super(fb); }
}

@Component({
  selector: 'checkbox-component',
  template: `
    <form #template="ngForm" id="template">
      <paper-checkbox name="checkbox" ironControl [(ngModel)]="model.checkbox"></paper-checkbox>
    </form>
    <form id="reactive" [formGroup]="reactiveForm">
      <paper-checkbox formControlName="checkbox" ironControl></paper-checkbox>
    </form>
  `
})
class CheckboxComponent extends FormComponent {
  constructor(fb: FormBuilder) { super(fb); }
}

@Component({
  selector: 'selector-component',
  template: `
    <form #template="ngForm" id="template">
      <iron-selector name="selector" ironControl [(ngModel)]="model.selector">
        <div>One</div>
        <div>Two</div>
      </iron-selector>
    </form>
    <form id="reactive" [formGroup]="reactiveForm">
      <iron-selector formControlName="selector" ironControl>
        <div>One</div>
        <div>Two</div>
      </iron-selector>
    </form>
  `
})
class SelectorComponent extends FormComponent {
  constructor(fb: FormBuilder) { super(fb); }
}

@Component({
  selector: 'multi-selector-component',
  template: `
    <form #template="ngForm" id="template">
      <iron-selector name="multiSelector" ironControl multi [(ngModel)]="model.multiSelector">
        <div>One</div>
        <div>Two</div>
      </iron-selector>
    </form>
    <form id="reactive" [formGroup]="reactiveForm">
      <iron-selector formControlName="multiSelector" ironControl multi>
        <div>One</div>
        <div>Two</div>
      </iron-selector>
    </form>
  `
})
class MultiSelectorComponent extends FormComponent {
  constructor(fb: FormBuilder) { super(fb); }
}

@Component({
  selector: 'defer-selector-component',
  template: `
    <form #template="ngForm" id="template">
      <div name="selector" ironControl [(ngModel)]="model.selector"
          [ironSelector]="templateSelector">
        <iron-selector #templateSelector class="dropdown-content">
          <div>One</div>
          <div>Two</div>
        </iron-selector>
      </div>
    </form>
    <form id="reactive" [formGroup]="reactiveForm">
      <div formControlName="selector" ironControl
          [ironSelector]="reactiveSelector">
        <iron-selector #reactiveSelector class="dropdown-content">
          <div>One</div>
          <div>Two</div>
        </iron-selector>
      </div>
    </form>
  `
})
class DeferSelectorComponent extends FormComponent {
  constructor(fb: FormBuilder) { super(fb); }
}

@Component({
  selector: 'not-iron',
  template: '<div ironControl></div>'
})
class NotIronComponent { }

describe('IronControlDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        CheckboxComponent,
        DeferSelectorComponent,
        InputComponent,
        IronControlDirective,
        MultiSelectorComponent,
        NotIronComponent,
        SelectorComponent
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
      const templateInput = fixture.nativeElement.querySelector('#template paper-input');
      const reactiveInput = fixture.nativeElement.querySelector('#reactive paper-input');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(templateInput.invalid).toBe(false);
        expect(reactiveInput.invalid).toBe(false);
        fixture.componentInstance.templateForm.controls['input'].markAsDirty();
        fixture.componentInstance.reactiveForm.controls['input'].markAsDirty();
        return fixture.whenStable();
      }).then(() => {
        expect(templateInput.invalid).toBe(false);
        expect(reactiveInput.invalid).toBe(false);
        fixture.componentInstance.model.input = null;
        fixture.componentInstance.reactiveForm.get('input').setValue(null);
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(fixture.componentInstance.templateForm.controls['input'].invalid).toBe(true);
        expect(fixture.componentInstance.reactiveForm.controls['input'].invalid).toBe(true);
        expect(templateInput.invalid).toBe(true);
        expect(reactiveInput.invalid).toBe(true);
      });
    }));

    it('should add element validate() function to NgControl validators', async(() => {
      const fixture = TestBed.createComponent(InputComponent);
      const templateInput = fixture.nativeElement.querySelector('#template paper-input');
      const reactiveInput = fixture.nativeElement.querySelector('#reactive paper-input');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        spyOn(templateInput, 'validate').and.callThrough();
        spyOn(reactiveInput, 'validate').and.callThrough();
        fixture.componentInstance.templateForm.controls['input'].updateValueAndValidity();
        fixture.componentInstance.reactiveForm.controls['input'].updateValueAndValidity();
        expect(templateInput.validate).toHaveBeenCalledTimes(1);
        expect(templateInput.validate).toHaveBeenCalledTimes(1);
      });
    }));

    it('should set ironValidatable error if element validate() returns false', async(() => {
      const fixture = TestBed.createComponent(InputComponent);
      const templateInput = fixture.nativeElement.querySelector('#template paper-input');
      const reactiveInput = fixture.nativeElement.querySelector('#reactive paper-input');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        spyOn(templateInput, 'validate').and.returnValue(false);
        spyOn(reactiveInput, 'validate').and.returnValue(false);
        fixture.componentInstance.templateForm.controls['input'].updateValueAndValidity();
        fixture.componentInstance.reactiveForm.controls['input'].updateValueAndValidity();
        expect(fixture.componentInstance.templateForm.controls['input']
          .hasError('ironValidatable')).toBe(true);
        expect(fixture.componentInstance.reactiveForm.controls['input']
          .hasError('ironValidatable')).toBe(true);
      });
    }));
  });

  describe('writeValue()', () => {
    it('should set checked property of IronCheckedElementBehavior', async(() => {
      const fixture = TestBed.createComponent(CheckboxComponent);
      const templateCheckbox = fixture.nativeElement.querySelector('#template paper-checkbox');
      const reactiveCheckbox = fixture.nativeElement.querySelector('#reactive paper-checkbox');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(templateCheckbox.checked).toBe(true);
        expect(reactiveCheckbox.checked).toBe(true);
        fixture.componentInstance.model.checkbox = false;
        fixture.componentInstance.reactiveForm.get('checkbox').setValue(false);
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(templateCheckbox.checked).toBe(false);
        expect(reactiveCheckbox.checked).toBe(false);
      });
    }));

    it('should set selected property of IronSelectableBehavior', async(() => {
      const fixture = TestBed.createComponent(SelectorComponent);
      const templateSelector = fixture.nativeElement.querySelector('#template iron-selector');
      const reactiveSelector = fixture.nativeElement.querySelector('#reactive iron-selector');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(templateSelector.selected).toBe(0);
        expect(reactiveSelector.selected).toBe(0);
        fixture.componentInstance.model.selector = 1;
        fixture.componentInstance.reactiveForm.get('selector').setValue(1);
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(templateSelector.selected).toBe(1);
        expect(reactiveSelector.selected).toBe(1);
      });
    }));

    it('should set selected property of deferred ironSelector', async(() => {
      const fixture = TestBed.createComponent(DeferSelectorComponent);
      const templateSelector = fixture.nativeElement.querySelector('#template iron-selector');
      const reactiveSelector = fixture.nativeElement.querySelector('#reactive iron-selector');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(templateSelector.selected).toBe(0);
        expect(reactiveSelector.selected).toBe(0);
        fixture.componentInstance.model.selector = 1;
        fixture.componentInstance.reactiveForm.get('selector').setValue(1);
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(templateSelector.selected).toBe(1);
        expect(reactiveSelector.selected).toBe(1);
      });
    }));

    it('should set selectedValues property of multi IronSelectableBehavior', async(() => {
      const fixture = TestBed.createComponent(MultiSelectorComponent);
      const templateSelector = fixture.nativeElement.querySelector('#template iron-selector');
      const reactiveSelector = fixture.nativeElement.querySelector('#reactive iron-selector');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(templateSelector.selectedValues).toEqual([]);
        expect(reactiveSelector.selectedValues).toEqual([]);
        fixture.componentInstance.model.multiSelector = [0, 1];
        fixture.componentInstance.reactiveForm.get('multiSelector').setValue([0, 1]);
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(templateSelector.selectedValues).toEqual([0, 1]);
        expect(reactiveSelector.selectedValues).toEqual([0, 1]);
      });
    }));

    it('should set value property of form element', async(() => {
      const fixture = TestBed.createComponent(InputComponent);
      const templateInput = fixture.nativeElement.querySelector('#template paper-input');
      const reactiveInput = fixture.nativeElement.querySelector('#reactive paper-input');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(templateInput.value).toBe('Value');
        expect(reactiveInput.value).toBe('Value');
        fixture.componentInstance.model.input = 'New Value';
        fixture.componentInstance.reactiveForm.get('input').setValue('New Value');
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(templateInput.value).toBe('New Value');
        expect(reactiveInput.value).toBe('New Value');
      });
    }));

    it('should not mark controls as dirty when resetting', async(() => {
      const fixture = TestBed.createComponent(InputComponent);
      const templateInput = fixture.nativeElement.querySelector('#template paper-input');
      const reactiveInput = fixture.nativeElement.querySelector('#reactive paper-input');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        templateInput.value = 'New Value';
        reactiveInput.value = 'New Value';
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(fixture.componentInstance.templateForm.controls['input'].dirty).toBe(true);
        expect(fixture.componentInstance.reactiveForm.controls['input'].dirty).toBe(true);
        fixture.componentInstance.templateForm.reset();
        fixture.componentInstance.reactiveForm.reset();
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(fixture.componentInstance.templateForm.controls['input'].dirty).toBe(false);
        expect(fixture.componentInstance.reactiveForm.controls['input'].dirty).toBe(false);
      });
    }));
  });

  describe('registerOnChange()', () => {
    it('should detect input changes', async(() => {
      const fixture = TestBed.createComponent(InputComponent);
      const templateInput = fixture.nativeElement.querySelector('#template paper-input');
      const reactiveInput = fixture.nativeElement.querySelector('#reactive paper-input');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.componentInstance.model.input).toBe('Value');
        expect(fixture.componentInstance.reactiveForm.value.input).toBe('Value');
        templateInput.value = 'New Value';
        reactiveInput.value = 'New Value';
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(fixture.componentInstance.model.input).toBe('New Value');
        expect(fixture.componentInstance.reactiveForm.value.input).toBe('New Value');
      });
    }));

    it('should detect checkbox changes', async(() => {
      const fixture = TestBed.createComponent(CheckboxComponent);
      const templateCheckbox = fixture.nativeElement.querySelector('#template paper-checkbox');
      const reactiveCheckbox = fixture.nativeElement.querySelector('#reactive paper-checkbox');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.componentInstance.model.checkbox).toBe(true);
        expect(fixture.componentInstance.reactiveForm.value.checkbox).toBe(true);
        templateCheckbox.checked = false;
        reactiveCheckbox.checked = false;
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(fixture.componentInstance.model.checkbox).toBe(false);
        expect(fixture.componentInstance.reactiveForm.value.checkbox).toBe(false);
      });
    }));

    it('should detect select value changes', async(() => {
      const fixture = TestBed.createComponent(SelectorComponent);
      const templateSelector = fixture.nativeElement.querySelector('#template iron-selector');
      const reactiveSelector = fixture.nativeElement.querySelector('#reactive iron-selector');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.componentInstance.model.selector).toBe(0);
        expect(fixture.componentInstance.reactiveForm.value.selector).toBe(0);
        templateSelector.selected = 1;
        reactiveSelector.selected = 1;
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(fixture.componentInstance.model.selector).toBe(1);
        expect(fixture.componentInstance.reactiveForm.value.selector).toBe(1);
      });
    }));

    it('should detect deferred select value changes', async(() => {
      const fixture = TestBed.createComponent(DeferSelectorComponent);
      const templateSelector = fixture.nativeElement.querySelector('#template iron-selector');
      const reactiveSelector = fixture.nativeElement.querySelector('#reactive iron-selector');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.componentInstance.model.selector).toBe(0);
        expect(fixture.componentInstance.reactiveForm.value.selector).toBe(0);
        templateSelector.selected = 1;
        reactiveSelector.selected = 1;
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(fixture.componentInstance.model.selector).toBe(1);
        expect(fixture.componentInstance.reactiveForm.value.selector).toBe(1);
      });
    }));

    it('should detect selected values change', async(() => {
      const fixture = TestBed.createComponent(MultiSelectorComponent);
      const templateSelector = fixture.nativeElement.querySelector('#template iron-selector');
      const reactiveSelector = fixture.nativeElement.querySelector('#reactive iron-selector');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.componentInstance.model.multiSelector).toEqual([]);
        expect(fixture.componentInstance.reactiveForm.value.multiSelector).toEqual([]);
        templateSelector.selectedValues = [0, 1];
        reactiveSelector.selectedValues = [0, 1];
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(fixture.componentInstance.model.multiSelector).toEqual([0, 1]);
        expect(fixture.componentInstance.reactiveForm.value.multiSelector).toEqual([0, 1]);
      });
    }));
  });

  describe('registerOnTouched()', () => {
    it('should detect input blur', async(() => {
      const fixture = TestBed.createComponent(InputComponent);
      const templateInput = fixture.nativeElement.querySelector('#template paper-input');
      const reactiveInput = fixture.nativeElement.querySelector('#reactive paper-input');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.componentInstance.templateForm.controls['input'].touched).toBe(false);
        expect(fixture.componentInstance.reactiveForm.controls['input'].touched).toBe(false);
        templateInput.dispatchEvent(new Event('blur'));
        reactiveInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(fixture.componentInstance.templateForm.controls['input'].touched).toBe(true);
        expect(fixture.componentInstance.reactiveForm.controls['input'].touched).toBe(true);
      });
    }));

    it('should detect select iron-active events', async(() => {
      const fixture = TestBed.createComponent(SelectorComponent);
      const templateSelector = fixture.nativeElement.querySelector('#template iron-selector');
      const reactiveSelector = fixture.nativeElement.querySelector('#reactive iron-selector');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.componentInstance.templateForm.controls['selector'].touched).toBe(false);
        expect(fixture.componentInstance.reactiveForm.controls['selector'].touched).toBe(false);
        templateSelector.dispatchEvent(new CustomEvent('iron-activate'));
        reactiveSelector.dispatchEvent(new CustomEvent('iron-activate'));
        fixture.detectChanges();
        return fixture.whenStable();
      }).then(() => {
        expect(fixture.componentInstance.templateForm.controls['selector'].touched).toBe(true);
        expect(fixture.componentInstance.reactiveForm.controls['selector'].touched).toBe(true);
      });
    }));
  });

  describe('setDisabledState()', () => {
    it('should set disabled property', () => {
      const fixture = TestBed.createComponent(InputComponent);
      const templateInput = fixture.nativeElement.querySelector('#template paper-input');
      const reactiveInput = fixture.nativeElement.querySelector('#reactive paper-input');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(reactiveInput.disabled).toBe(false);
        fixture.componentInstance.reactiveForm.get('input').disable();
        expect(reactiveInput.disabled).toBe(true);
        fixture.componentInstance.reactiveForm.get('input').enable();
        expect(reactiveInput.disabled).toBe(false);
      });
    });
  });
});
