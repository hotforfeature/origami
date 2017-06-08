// tslint:disable:max-classes-per-file
import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import {
  BrowserModule,
  ɵDomSharedStylesHost as DomSharedStylesHost
} from '@angular/platform-browser';
import {} from 'jasmine';

import { PolymerDomSharedStylesHost } from './shared-styles-host';

@Component({
  selector: 'test-component',
  template: `<h1>Hello World</h1>`,
  styles: [
    `
    :host {
      --red: red;
      --mixin: {
        font-size: 10px;
      }
    }
    h1 {
      @apply --mixin;
      color: var(--red);
    }
    `
  ]
})
class TestComponent { }

@Component({
  selector: 'native-component',
  template: `<h1>Hello Native</h1>`,
  styles: [
    `
    :host {
      --blue: blue;
      --mixin: {
        font-size: 8px;
      }
    }
    h1 {
      @apply --mixin;
      color: var(--blue);
    }
    `
  ],
  encapsulation: ViewEncapsulation.Native
})
class NativeComponent { }

describe('DomSharedCustomStylesHost', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      declarations: [TestComponent, NativeComponent],
      providers: [{
        provide: DomSharedStylesHost, useClass: PolymerDomSharedStylesHost
      }]
    });

    fixture = TestBed.createComponent(TestComponent);
  });

  afterEach(() => {
    Array.from(document.head.querySelectorAll('custom-style')).forEach(customStyle => {
      document.head.removeChild(customStyle);
    });
  });

  it('should wrap <head> <style>s with <custom-style>', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(document.head.querySelectorAll('custom-style').length).toBeGreaterThan(0);
    });
  }));

  if (HTMLElement.prototype['createShadowRoot']) { // tslint:disable-line:no-string-literal
    it('should wrap <style>s with <custom-style> in shadow DOM', async(() => {
      fixture = TestBed.createComponent(NativeComponent);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.nativeElement.shadowRoot.querySelectorAll('custom-style').length)
          .toBeGreaterThan(0);
      });
    }));
  }
});
