// tslint:disable:max-classes-per-file
import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';

import { CustomStyleService } from './custom-style.service';

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
class TestComponent {
  constructor(customStyle: CustomStyleService) {
    customStyle.updateCustomStyles();
  }
}

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
class NativeComponent {
  constructor(elementRef: ElementRef, customStyle: CustomStyleService) {
    customStyle.updateCustomStyles(elementRef);
  }
}

describe('CustomStyleService', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    spyOn(console, 'warn');
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      declarations: [TestComponent, NativeComponent],
      providers: [CustomStyleService]
    });

    fixture = TestBed.createComponent(TestComponent);
  });

  afterEach(() => {
    const customStyles = document.head.querySelectorAll('custom-style');
    Array.from(document.head.querySelectorAll('custom-style')).forEach(customStyle => {
      document.head.removeChild(customStyle);
      document.head.appendChild(customStyle.querySelector('style'));
    });
  });

  describe('updateCustomStyles()', () => {
    it('should give deprecation warning', done => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(console.warn).toHaveBeenCalledWith(jasmine.stringMatching('deprecated'));
        done();
      });
    });

    it('should wrap <head> <style>s with <custom-style>', done => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(document.head.querySelectorAll('custom-style').length).toBeGreaterThan(0);
        done();
      });
    });

    if ('createShadowRoot' in HTMLElement.prototype) {
      it('should wrap <style>s with <custom-style> in shadow DOM', done => {
        fixture = TestBed.createComponent(NativeComponent);
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(fixture.nativeElement.shadowRoot.querySelectorAll('custom-style').length)
            .toBeGreaterThan(0);
          done();
        });
      });
    }
  });
});
