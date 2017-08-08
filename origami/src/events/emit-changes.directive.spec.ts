// tslint:disable:max-classes-per-file
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { Polymer, getPolymer } from '../util/Polymer';
import { EmitChangesDirective } from './emit-changes.directive';

@Component({
  selector: 'test-component',
  template: `
    <emit-changes-element #polymer emitChanges></emit-changes-element>
    <emit-changes-behavior-element #behavior emitChanges></emit-changes-behavior-element>
    <unknown-element #unknown emitChanges></unknown-element>
    <mixin-test #mixin emitChanges></mixin-test>
  `
})
class TestComponent {
  @ViewChild('polymer') emitChangesElementRef: ElementRef;
  @ViewChild('behavior') emitChangesBehaviorElementRef: ElementRef;
  @ViewChild('unknown') unknownElementRef: ElementRef;
  @ViewChild('mixin') mixinElementRef: ElementRef;

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

    const mixin = Polymer.dedupingMixin(base => {
      return class Mixin extends base {
        static get properties() {
          return {
            totallyLegal: {
              type: Boolean,
              value: true,
              notify: true,
              reflectToAttribute: true
            }
          };
        }
      };
    });

    class MixinTest extends mixin(Polymer.Element) {
      static get properties() {
        return {
          ownProp: {
            type: Boolean,
            value: true,
            notify: true,
            reflectToAttribute: true
          }
        };
      }
    }

    customElements.define('mixin-test', MixinTest);
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
        done.fail('it should not listen to change events');
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

  it('should listen to mixin properties', done => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const element = fixture.componentInstance.mixinElementRef.nativeElement;
      element.addEventListener('totallyLegalChange', event => {
        expect(event).toEqual(jasmine.any(CustomEvent));
        done();
      });

      element.totallyLegal = false;
    });
  });
});
