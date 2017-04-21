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
    expect(template.content).toBeDefined();
    expect(template.content.children[0].id).toBe('first');
    expect(template.content.children[1].id).toBe('second');
  });

  describe('ngOnInit()', () => {
    it('should set template.__dataHost to methodHost', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(template['__dataHost']).toBe(fixture.componentInstance);
        expect(firstSiblingTemplate['__dataHost']).toBeUndefined();
      });
    }));
  });
});
