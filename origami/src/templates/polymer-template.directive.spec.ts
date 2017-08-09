// tslint:disable:no-string-literal max-classes-per-file
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PolymerChanges } from '../events/polymer-changes';
import { getPolymer } from '../util/Polymer';
import { PolymerTemplateDirective } from './polymer-template.directive';

@Component({
  selector: 'test-component',
  template: `
    <div #ngTemplate>
      <ng-template [polymer]="this">
        <div id="first"></div>
        <div id="second"></div>
      </ng-template>
    </div>
    <div #firstSibling>
      <ng-template polymer></ng-template>
      <div id="lastSibling"></div>
    </div>
    <div #lastSibling>
      <div id="firstSibling"></div>
      <ng-template polymer></ng-template>
    </div>
  `
})

class TestComponent {
  @ViewChild('ngTemplate') ngTemplateDiv: ElementRef;
  @ViewChild('firstSibling') firstSiblingDiv: ElementRef;
  @ViewChild('lastSibling') lastSiblingDiv: ElementRef;
  @ViewChildren(PolymerTemplateDirective) polymerDirectives: QueryList<PolymerTemplateDirective>;
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
  @PolymerChanges() ngChecked: boolean;
}

describe('PolymerTemplateDirective (legacy)', () => {
  let fixture: ComponentFixture<TestComponent>;
  let ngTemplate: HTMLTemplateElement;
  let firstSiblingTemplate: HTMLTemplateElement;
  let lastSiblingTemplate: HTMLTemplateElement;

  beforeEach(() => {
    spyOn(console, 'warn');
    TestBed.configureTestingModule({
      declarations: [
        PolymerTemplateDirective,
        TestComponent
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    ngTemplate = fixture.componentInstance.ngTemplateDiv.nativeElement.children[0];
    firstSiblingTemplate = fixture.componentInstance.firstSiblingDiv.nativeElement.children[0];
    lastSiblingTemplate = fixture.componentInstance.lastSiblingDiv.nativeElement.children[1];
  });

  it('should replace <ng-template> with <template>', () => {
    expect(ngTemplate.tagName).toEqual('TEMPLATE');
  });

  it('should replace <ng-template> in correct position from parent', () => {
    expect(firstSiblingTemplate.parentElement.children[0]).toBe(firstSiblingTemplate);
    expect(firstSiblingTemplate.parentElement.children[1].id).toBe('lastSibling');
    expect(lastSiblingTemplate.parentElement.children[0].id).toBe('firstSibling');
    expect(lastSiblingTemplate.parentElement.children[1]).toBe(lastSiblingTemplate);
  });

  it('should add <ng-template> children to <template> content', () => {
    // IE11/Edge do not implement ParentNode interface for DocumentFragment, which provides the
    // children property
    expect(ngTemplate.content).toBeDefined();
    const first = ngTemplate.content.querySelector('#first');
    expect(first).toBeDefined();
    expect(first.nextElementSibling.id).toBe('second');
  });

  describe('host', () => {
    it('should be [polymer] input', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const directive = fixture.componentInstance.polymerDirectives.first;
        expect(directive.host).toBe(fixture.componentInstance);
      });
    }));
  });

  describe('methodHost', () => {
    it('should set host and give deprecation warning', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const directive = fixture.componentInstance.polymerDirectives.first;
        const host = {};
        directive.methodHost = host;
        expect(directive.host).toBe(host);
        expect(console.warn).toHaveBeenCalledWith(jasmine.stringMatching('deprecated'));
      });
    }));
  });

  describe('ngOnInit()', () => {
    it('should set template.__dataHost to host', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const host = fixture.componentInstance;
        expect(ngTemplate['__dataHost']).toBe(host);
        expect(firstSiblingTemplate['__dataHost']).toBeUndefined();
      });
    }));

    it('should shim _addEventListenerToNode', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const host = fixture.componentInstance;
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
        const host = fixture.componentInstance;
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

describe('PolymerTemplateDirective', () => {
  let fixture: ComponentFixture<HostBindComponent>;

  beforeEach(() => {
    TestBed.configureCompiler(<any>{
      enableLegacyTemplate: false
    });

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        PolymerTemplateDirective,
        HostBindComponent
      ]
    });

    fixture = TestBed.createComponent(HostBindComponent);
  });

  describe('host', () => {
    it('should propagate Angular host bindings to and from template', done => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const ironList = fixture.debugElement.nativeElement.querySelector('iron-list');
        getPolymer().RenderStatus.afterNextRender(this, () => {
          const checkboxes = Array.from(ironList.querySelectorAll('paper-checkbox'));
          expect(checkboxes.length).toEqual(3);
          fixture.componentInstance.ngChecked = true;
          checkboxes.forEach((checkbox: any) => {
            expect(checkbox.checked).toBe(true);
          });

          (<any>checkboxes[0]).checked = false;
          expect(fixture.componentInstance.ngChecked).toBe(false);
          checkboxes.forEach((checkbox: any) => {
            expect(checkbox.checked).toBe(false);
          });

          done();
        });
      }).catch(done.fail);
    });
  });
});
