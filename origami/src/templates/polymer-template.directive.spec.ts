// tslint:disable:no-string-literal
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import {} from 'jasmine';

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

describe('PolymerTemplateDirective', () => {
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
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const directive = fixture.componentInstance.polymerDirectives.first;
        expect(directive.host).toBe(fixture.componentInstance);
      });
    }));
  });

  describe('methodHost', () => {
    it('should set host and give deprecation warning', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
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
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const host = fixture.componentInstance;
        expect(ngTemplate['__dataHost']).toBe(host);
        expect(firstSiblingTemplate['__dataHost']).toBeUndefined();
      });
    }));

    it('should shim _addEventListenerToNode', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
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
      fixture.whenStable().then(() => {
        fixture.detectChanges();
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
