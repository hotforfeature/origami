import {
  Component,
  ElementRef,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import '@polymer/polymer/lib/elements/dom-repeat';
import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { polymerHost } from './polymerHost';
import { shimHTMLTemplateAppend } from './shim-template-append';
import { TemplateDirective } from './template.directive';
import { TEMPLATES_READY_PROVIDER } from './template.module';

describe('templates', () => {
  describe('TemplateDirective', () => {
    class CustomElement extends PolymerElement {
      static get is() {
        return 'template-directive-element';
      }
      static get properties() {
        return {
          checked: {
            type: Boolean,
            notify: true
          },
          obj: {
            type: Object,
            notify: true
          },
          arr: {
            type: Array,
            notify: true
          }
        };
      }

      static get template() {
        return html`
          <input type="checkbox" value="{{checked}}" />
        `;
      }

      checked?: boolean;
      obj?: Object;
      arr?: Array<any>;
    }

    customElements.define(CustomElement.is, CustomElement);

    class RepeatComponent {
      @ViewChild(TemplateDirective, { static: true })
      template!: TemplateDirective;
      @ViewChild('repeat', { static: true })
      repeatRef!: ElementRef;
      items = [1, 2, 3];
    }

    @Component({
      selector: 'event-bindings',
      template: `
        <dom-repeat #repeat [items]="items">
          <template ngNonBindable>
            <!-- prettier-ignore -->
            <div on-click="onClick">[[item]]</div>
          </template>
        </dom-repeat>
      `,
      providers: [polymerHost(EventBindings)]
    })
    class EventBindings extends RepeatComponent {
      onClick = jasmine.createSpy('onClick');
    }

    @Component({
      selector: 'property-bindings',
      template: `
        <dom-repeat #repeat [items]="items">
          <template #template ngNonBindable>
            <div>[[label]] [[item]]</div>
          </template>
        </dom-repeat>
      `,
      providers: [polymerHost(PropertyBindings)]
    })
    class PropertyBindings extends RepeatComponent {
      label = 'Item:';
    }

    @Component({
      selector: 'computed-bindings',
      template: `
        <dom-repeat #repeat [items]="items">
          <template #template ngNonBindable>
            <div>[[getLabel(item)]]</div>
          </template>
        </dom-repeat>
      `,
      providers: [polymerHost(ComputedBindings)]
    })
    class ComputedBindings extends RepeatComponent {
      getLabel(item: number): string {
        return `#${item}`;
      }
    }

    @Component({
      selector: 'no-bindings',
      template: `
        <dom-repeat #repeat [items]="items">
          <template #template ngNonBindable>
            <div>[[item]]</div>
          </template>
        </dom-repeat>
      `,
      providers: [polymerHost(NoBindings)]
    })
    class NoBindings extends RepeatComponent {}

    @Component({
      selector: 'polymer-bindings',
      template: `
        <dom-repeat #repeat [items]="items">
          <template #template ngNonBindable>
            <template-directive-element
              checked="{{ checked }}"
              obj="{{ obj }}"
              arr="{{ items }}"
            ></template-directive-element>
          </template>
        </dom-repeat>
      `,
      providers: [polymerHost(PolymerBindings)]
    })
    class PolymerBindings extends RepeatComponent {
      obj: any = {};
      get checked(): boolean {
        return this._checked;
      }

      set checked(checked: boolean) {
        this._checked = checked;
        this.checkedSet++;
      }

      checkedSet = 0;
      private _checked = false;
    }

    @Component({
      selector: 'no-host',
      template: `
        <dom-repeat #repeat [items]="items">
          <template #template ngNonBindable>
            <div>[[item]]</div>
          </template>
        </dom-repeat>
      `
    })
    class NoHost extends RepeatComponent {}

    beforeAll(async () => {
      await shimHTMLTemplateAppend();
    });

    it('should enable event bindings', () => {
      TestBed.configureTestingModule({
        declarations: [TemplateDirective, EventBindings],
        providers: [TEMPLATES_READY_PROVIDER],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });

      const fixture = TestBed.createComponent(EventBindings);
      fixture.detectChanges();
      fixture.componentInstance.repeatRef.nativeElement.render();
      const item = fixture.nativeElement.querySelector('div');
      item.dispatchEvent(new MouseEvent('click'));
      expect(fixture.componentInstance.onClick).toHaveBeenCalledTimes(1);
    });

    it('should enable Angular -> Polymer property bindings', async () => {
      TestBed.configureTestingModule({
        declarations: [TemplateDirective, PropertyBindings],
        providers: [TEMPLATES_READY_PROVIDER],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });

      const fixture = TestBed.createComponent(PropertyBindings);
      fixture.detectChanges();
      fixture.componentInstance.repeatRef.nativeElement.render();
      await fixture.componentInstance.template.ready;
      const item = fixture.nativeElement.querySelector('div');
      expect(item.innerText).toBe('Item: 1');
      expect;
    });

    it('should do nothing if Angular -> Polymer property does not change', async () => {
      TestBed.configureTestingModule({
        declarations: [TemplateDirective, PropertyBindings],
        providers: [TEMPLATES_READY_PROVIDER],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });

      const fixture = TestBed.createComponent(PropertyBindings);
      fixture.detectChanges();
      const nativeTemplate =
        fixture.componentInstance.template.elementRef.nativeElement;
      fixture.componentInstance.repeatRef.nativeElement.render();
      spyOn(nativeTemplate, '_setProperty').and.callThrough();
      await fixture.componentInstance.template.ready;
      expect(nativeTemplate._setProperty).toHaveBeenCalled();
      const calledTimes = nativeTemplate._setProperty.calls.count();
      fixture.componentInstance.label = fixture.componentInstance.label;
      expect(nativeTemplate._setProperty).toHaveBeenCalledTimes(calledTimes);
    });

    it('should enable Angular -> Polymer computed bindings', async () => {
      TestBed.configureTestingModule({
        declarations: [TemplateDirective, ComputedBindings],
        providers: [TEMPLATES_READY_PROVIDER],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });

      const fixture = TestBed.createComponent(ComputedBindings);
      fixture.detectChanges();
      fixture.componentInstance.repeatRef.nativeElement.render();
      await fixture.componentInstance.template.ready;
      const item = fixture.nativeElement.querySelector('div');
      expect(item.innerText).toBe('#1');
    });

    it('should do nothing if there are no Angular -> Polymer bindings', async () => {
      TestBed.configureTestingModule({
        declarations: [TemplateDirective, NoBindings],
        providers: [TEMPLATES_READY_PROVIDER],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });

      const $enablePropertyBindings =
        TemplateDirective.prototype.enablePropertyBindings;
      spyOn(TemplateDirective.prototype, 'enablePropertyBindings').and.callFake(
        function(this: TemplateDirective) {
          spyOn(
            this.elementRef.nativeElement,
            'addEventListener'
          ).and.callThrough();
          return $enablePropertyBindings.apply(this, <any>arguments);
        }
      );

      const fixture = TestBed.createComponent(NoBindings);
      fixture.detectChanges();
      fixture.componentInstance.repeatRef.nativeElement.render();
      await fixture.componentInstance.template.ready;
      expect(
        fixture.componentInstance.template.enablePropertyBindings
      ).toHaveBeenCalled();
      expect(
        fixture.componentInstance.template.elementRef.nativeElement
          .addEventListener
      ).not.toHaveBeenCalled();
    });

    it('should enable Polymer -> Angular bindings', async () => {
      TestBed.configureTestingModule({
        declarations: [TemplateDirective, PolymerBindings],
        providers: [TEMPLATES_READY_PROVIDER],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });

      const fixture = TestBed.createComponent(PolymerBindings);
      fixture.detectChanges();
      fixture.componentInstance.repeatRef.nativeElement.render();
      await fixture.componentInstance.template.ready;
      const checkboxes = Array.from<CustomElement>(
        fixture.nativeElement.querySelectorAll('template-directive-element')
      );

      expect(fixture.componentInstance.checked).toBe(false);
      expect(checkboxes.length).toBe(3);
      expect(checkboxes[0].checked).toBe(false);
      expect(checkboxes[1].checked).toBe(false);
      expect(checkboxes[2].checked).toBe(false);
      checkboxes[0].checked = true;
      expect(checkboxes[0].checked).toBe(true);
      expect(checkboxes[1].checked).toBe(true);
      expect(checkboxes[2].checked).toBe(true);
      expect(fixture.componentInstance.checked).toBe(true);
    });

    it('should handle Polymer -> Angular object splices', async () => {
      TestBed.configureTestingModule({
        declarations: [TemplateDirective, PolymerBindings],
        providers: [TEMPLATES_READY_PROVIDER],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });

      const fixture = TestBed.createComponent(PolymerBindings);
      fixture.detectChanges();
      fixture.componentInstance.repeatRef.nativeElement.render();
      await fixture.componentInstance.template.ready;
      const element = <CustomElement>(
        fixture.nativeElement.querySelector('template-directive-element')
      );
      expect(fixture.componentInstance.obj).toEqual({});
      expect(element.obj).toBe(fixture.componentInstance.obj);
      element.set('obj.foo', 'bar');
      expect(element.obj).toEqual({ foo: 'bar' });
      expect(fixture.componentInstance.obj).toEqual({ foo: 'bar' });
      expect(fixture.componentInstance.obj).toBe(element.obj);
    });

    it('should handle Polymer -> Angular array splices', async () => {
      TestBed.configureTestingModule({
        declarations: [TemplateDirective, PolymerBindings],
        providers: [TEMPLATES_READY_PROVIDER],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });

      const fixture = TestBed.createComponent(PolymerBindings);
      fixture.detectChanges();
      fixture.componentInstance.repeatRef.nativeElement.render();
      await fixture.componentInstance.template.ready;
      const element = <CustomElement>(
        fixture.nativeElement.querySelector('template-directive-element')
      );

      expect(fixture.componentInstance.items).toEqual([1, 2, 3]);
      expect(element.arr).toBe(fixture.componentInstance.items);
      element.push('arr', 4);
      expect(element.arr).toEqual([1, 2, 3, 4]);
      expect(fixture.componentInstance.items).toEqual([1, 2, 3, 4]);
      expect(fixture.componentInstance.items).toBe(element.arr!);
    });

    it('should do nothing if POLYMER_HOST is not provided', async () => {
      TestBed.configureTestingModule({
        declarations: [TemplateDirective, NoHost],
        providers: [TEMPLATES_READY_PROVIDER],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      });

      const fixture = TestBed.createComponent(NoHost);
      spyOn(
        fixture.componentInstance.template,
        'enableEventBindings'
      ).and.callThrough();
      spyOn(
        fixture.componentInstance.template,
        'enablePropertyBindings'
      ).and.callThrough();
      fixture.detectChanges();
      await fixture.componentInstance.template.ready;
      expect(
        fixture.componentInstance.template.enableEventBindings
      ).not.toHaveBeenCalled();
      expect(
        fixture.componentInstance.template.enablePropertyBindings
      ).not.toHaveBeenCalled();
    });

    describe('enablePropertyBindings()', () => {
      it('should do nothing if _templateInfo does not have hostProps', async () => {
        TestBed.configureTestingModule({
          declarations: [TemplateDirective, EventBindings],
          providers: [TEMPLATES_READY_PROVIDER],
          schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });

        const fixture = TestBed.createComponent(EventBindings);
        const nativeTemplate =
          fixture.componentInstance.template.elementRef.nativeElement;
        fixture.componentInstance.repeatRef.nativeElement.render();
        expect(nativeTemplate._templateInfo).toBeDefined();
        nativeTemplate._templateInfo.hostProps = undefined;
        expect(nativeTemplate._templateInfo.hostProps).toBeUndefined();
        spyOn(nativeTemplate, 'addEventListener').and.callThrough();
        await fixture.componentInstance.template.enablePropertyBindings(
          nativeTemplate
        );
        expect(nativeTemplate.addEventListener).not.toHaveBeenCalled();
      });
    });

    describe('getTemplateInfo()', () => {
      it('should resolve with _templateInfo before it is set', async () => {
        TestBed.configureTestingModule({
          declarations: [TemplateDirective, EventBindings],
          providers: [TEMPLATES_READY_PROVIDER],
          schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });

        const fixture = TestBed.createComponent(EventBindings);
        const nativeTemplate =
          fixture.componentInstance.template.elementRef.nativeElement;
        expect(nativeTemplate._templateInfo).toBeUndefined();
        const promise = fixture.componentInstance.template.getTemplateInfo(
          nativeTemplate
        );

        fixture.componentInstance.repeatRef.nativeElement.render();
        const result = await promise;
        expect(result).toBe(nativeTemplate._templateInfo);
      });

      it('should resolve with _templateInfo after it is set', async () => {
        TestBed.configureTestingModule({
          declarations: [TemplateDirective, EventBindings],
          providers: [TEMPLATES_READY_PROVIDER],
          schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });

        const fixture = TestBed.createComponent(EventBindings);
        const nativeTemplate =
          fixture.componentInstance.template.elementRef.nativeElement;
        expect(nativeTemplate._templateInfo).toBeUndefined();
        fixture.componentInstance.repeatRef.nativeElement.render();
        expect(nativeTemplate._templateInfo).toBeDefined();
        const result = await fixture.componentInstance.template.getTemplateInfo(
          nativeTemplate
        );
        expect(result).toBe(nativeTemplate._templateInfo);
      });
    });
  });
});
