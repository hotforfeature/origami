// tslint:disable:no-string-literal
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import {} from 'jasmine';

import { PolymerTemplateDirective } from './polymer-template.directive';

@Component({
  selector: 'test-component',
  template: `
    <div #template>
      <ng-template polymer [methodHost]="this">
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
  @ViewChild('template') templateDiv: ElementRef;
  @ViewChild('firstSibling') firstSiblingDiv: ElementRef;
  @ViewChild('lastSibling') lastSiblingDiv: ElementRef;
}

describe('PolymerTemplateDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let template: HTMLTemplateElement;
  let firstSiblingTemplate: HTMLTemplateElement;
  let lastSiblingTemplate: HTMLTemplateElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PolymerTemplateDirective,
        TestComponent
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    template = fixture.componentInstance.templateDiv.nativeElement.children[0];
    firstSiblingTemplate = fixture.componentInstance.firstSiblingDiv.nativeElement.children[0];
    lastSiblingTemplate = fixture.componentInstance.lastSiblingDiv.nativeElement.children[1];
  });

  it('should replace <ng-template> with <template>', () => {
    expect(template.tagName).toEqual('TEMPLATE');
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
    expect(template.content).toBeDefined();
    const first = template.content.querySelector('#first');
    expect(first).toBeDefined();
    expect(first.nextElementSibling.id).toBe('second');
  });

  describe('ngOnInit()', () => {
    it('should set template.__dataHost to methodHost', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const host = fixture.componentInstance;
        expect(template['__dataHost']).toBe(host);
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
