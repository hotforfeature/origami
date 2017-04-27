import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import {} from 'jasmine';

import { Polymer, getPolymer } from '../util/Polymer';
import { EmitChangesDirective } from './emit-changes.directive';

@Component({
  selector: 'test-component',
  template: `
    <emit-changes-element #polymer emitChanges></emit-changes-element>
    <emit-changes-behavior-element #behavior emitChanges></emit-changes-behavior-element>
    <unknown-element #unknown emitChanges></unknown-element>
  `
})
class TestComponent {
  @ViewChild('polymer') emitChangesElementRef: ElementRef;
  @ViewChild('behavior') emitChangesBehaviorElementRef: ElementRef;
  @ViewChild('unknown') unknownElementRef: ElementRef;

  get emitChangesElement(): HTMLElement & Polymer.PropertyEffects {
    return this.emitChangesElementRef.nativeElement;
  }

  toggleFromPolymer(property: string) {
    this.emitChangesElement[property] = !this.emitChangesElement[property];
  }

  modifyObjFromPolymer(value: any) {
    this.emitChangesElement.set('objProp.modified', value);
  }

  modifyArrayFromPolymer(value: any) {
    this.emitChangesElement.push('arrayProp', value);
  }
}

describe('EmitChangesDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeAll(() => {
    const Polymer = getPolymer(); // tslint:disable-line:variable-name
    Polymer({
      is: 'emit-changes-element',
      properties: {
        _privateProp: {
          type: Boolean,
          notify: true,
          value: false
        },
        notifyProp: {
          type: Boolean,
          notify: true,
          value: false
        },
        silentProp: {
          type: Boolean,
          value: false
        },
        objProp: {
          type: Object,
          value: {},
          observer: '_propChanged'
        },
        arrayProp: {
          type: Array,
          value: [],
          observer: '_propChanged'
        }
      },
      _propChanged() {
        // Add observer to fire changed events for non-notify object/array properties
      }
    });

    Polymer({
      is: 'emit-changes-behavior-element',
      behaviors: [
        {
          properties: {
            behaviorProp: {
              type: Boolean,
              notify: true,
              value: false
            }
          }
        }
      ]
    });
  });

  beforeEach(() => {
    spyOn(console, 'warn');
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        EmitChangesDirective,
        TestComponent
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
  });

  it('should fire propertyChange CustomEvents when Polymer changes', done => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const element = fixture.componentInstance.emitChangesElement;
      element.addEventListener('notifyPropChange', (event: CustomEvent) => {
        expect(event).toEqual(jasmine.any(CustomEvent));
        expect(event.detail.value).toBe(true);
        done();
      });

      fixture.componentInstance.toggleFromPolymer('notifyProp');
    });
  });

  it('should ignore private properties', done => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const element = fixture.componentInstance.emitChangesElement;
      element.addEventListener('_privatePropChange', () => {
        done.fail('_privatePropChange should not fire');
      });

      fixture.componentInstance.toggleFromPolymer('_privateProp');
      done();
    });
  });

  it('should fire object mutation events', done => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const element = fixture.componentInstance.emitChangesElement;
      element.addEventListener('objPropChange', (event: CustomEvent) => {
        expect(event).toEqual(jasmine.any(CustomEvent));
        expect(event.detail.path).toBe('objProp.modified');
        expect(event.detail.value).toBe('newValue');
        done();
      });

      fixture.componentInstance.modifyObjFromPolymer('newValue');
    });
  });

  it('should fire array mutation events', done => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const element = fixture.componentInstance.emitChangesElement;
      element.addEventListener('arrayPropChange', (event: CustomEvent) => {
        expect(event).toEqual(jasmine.any(CustomEvent));
        done();
      });

      fixture.componentInstance.modifyArrayFromPolymer('newValue');
    });
  });

  it('should ignore unregistered elements', done => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const element = fixture.componentInstance.unknownElementRef.nativeElement;
      element.addEventListener('propChange', () => {
        done.fail('it should not list to changed events');
      });

      element.dispatchEvent(new CustomEvent('prop-changed'));
      done();
    });
  });

  it('should listen to behavior properties', done => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const element = fixture.componentInstance.emitChangesBehaviorElementRef.nativeElement;
      element.addEventListener('behaviorPropChange', (event: CustomEvent) => {
        expect(event).toEqual(jasmine.any(CustomEvent));
        done();
      });

      element.behaviorProp = !element.behaviorProp;
    });
  });
});
