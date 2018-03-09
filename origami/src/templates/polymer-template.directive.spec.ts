// tslint:disable:no-string-literal max-classes-per-file
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import 'iron-list/iron-list.html';
import 'paper-checkbox/paper-checkbox.html';

import '../types/Polymer';
import { unwrapPolymerEvent } from '../util/unwrapPolymerEvent';
import { PolymerTemplateDirective } from './polymer-template.directive';

@Component({
  selector: 'test-component',
  template: `
    <template #template [polymer]="this"></template>
    <template #noHost polymer></template>
  `
})
class TestComponent {
  @ViewChild('template', { read: ElementRef }) templateRef: ElementRef;
  @ViewChild('template', {
    read: PolymerTemplateDirective
  }) polymerDirective: PolymerTemplateDirective;
  @ViewChild('noHost', { read: ElementRef }) noHostTemplateRef: ElementRef;
}

@Component({
  selector: 'test-component',
  template: `
    <iron-list style="width: 100px; height: 100px" [items]="items">
      <template ngNonBindable [polymer]="this">
        <paper-checkbox checked="{{ngChecked}}"></paper-checkbox>
      </template>
    </iron-list>
  `
})
class HostBindComponent {
  items = [1, 2, 3];
  ngChecked: boolean;
}

describe('PolymerTemplateDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let template: any;
  let noHost: any;

  beforeEach(() => {
    TestBed.configureCompiler(<any>{
      enableLegacyTemplate: false
    });

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        PolymerTemplateDirective,
        TestComponent,
        HostBindComponent
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    template = fixture.componentInstance.templateRef.nativeElement;
    noHost = fixture.componentInstance.noHostTemplateRef.nativeElement;
  });

  describe('host', () => {
    it('should be [polymer] input', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const directive = fixture.componentInstance.polymerDirective;
        expect(directive.host).toBe(fixture.componentInstance);
      });
    }));

    it('should propagate Angular host bindings to and from template', done => {
      const bindFixture = TestBed.createComponent(HostBindComponent);
      bindFixture.detectChanges();
      bindFixture.whenStable().then(() => {
        const ironList = bindFixture.debugElement.nativeElement.querySelector('iron-list');
        window.Polymer.RenderStatus.afterNextRender({}, () => {
          const checkboxes = Array.from(ironList.querySelectorAll('paper-checkbox'));
          expect(checkboxes.length).toEqual(3);
          bindFixture.componentInstance.ngChecked = true;
          checkboxes.forEach((checkbox: any) => {
            expect(checkbox.checked).toBe(true);
          });

          (<any>checkboxes[0]).checked = false;
          expect(bindFixture.componentInstance.ngChecked).toBe(false);
          checkboxes.forEach((checkbox: any) => {
            expect(checkbox.checked).toBe(false);
          });

          done();
        });
      }).catch(done.fail);
    });
  });

  describe('ngOnInit()', () => {
    it('should set template.__dataHost to host', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const host = fixture.componentInstance;
        expect(template['__dataHost']).toBe(host);
        expect(noHost['__dataHost']).toBeUndefined();
      });
    }));

    it('should shim _addEventListenerToNode', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const host: any = fixture.componentInstance;
        expect(host['_addEventListenerToNode']).toEqual(jasmine.any(Function));
        const node = document.createElement('div');
        const handler = () => { /* noop */ };
        spyOn(node, 'addEventListener');
        host['_addEventListenerToNode'](node, 'click', handler);
        expect(node.addEventListener).toHaveBeenCalledWith('click', handler);
      });
    }));

    it('should shim _removeEventListenerFromNode', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const host: any = fixture.componentInstance;
        expect(host['_removeEventListenerFromNode']).toEqual(jasmine.any(Function));
        const node = document.createElement('div');
        const handler = () => { /* noop */ };
        spyOn(node, 'removeEventListener');
        host['_removeEventListenerFromNode'](node, 'click', handler);
        expect(node.removeEventListener).toHaveBeenCalledWith('click', handler);
      });
    }));
  });
});
