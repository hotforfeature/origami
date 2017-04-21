import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import {} from 'jasmine';

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
  const SHADY_CSS_TIMEOUT = 20;

  let CustomElement: any;
  let fixture: ComponentFixture<TestComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      declarations: [TestComponent, NativeComponent],
      providers: [CustomStyleService]
    });

    fixture = TestBed.createComponent(TestComponent);
  });

  afterEach(() => {
    const customStyles = document.head.querySelectorAll('custom-style');
    for (let i = 0; i < customStyles.length; i++) {
      document.head.removeChild(customStyles[i]);
    }
  });

  describe('updateCustomStyles()', () => {
    it('should wrap <head> <style>s with <custom-style>', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(document.head.querySelectorAll('custom-style').length).toBeGreaterThan(0);
      });
    }));

    it('should ensure CSS variables work', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        setTimeout(() => {
          const h1 = fixture.nativeElement.querySelector('h1');
          expect(getComputedStyle(h1).color).toBe('rgb(255, 0, 0)');
        }, SHADY_CSS_TIMEOUT);
      });
    }));

    it('should ensure CSS mixins work', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        setTimeout(() => {
          const h1 = fixture.nativeElement.querySelector('h1');
          expect(getComputedStyle(h1).fontSize).toBe('10px');
        }, SHADY_CSS_TIMEOUT);
      });
    }));

    if (HTMLElement.prototype['createShadowRoot']) {
      it('should wrap <style>s with <custom-style> in shadow DOM', async(() => {
        fixture = TestBed.createComponent(NativeComponent);
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(fixture.nativeElement.shadowRoot.querySelectorAll('custom-style').length)
            .toBeGreaterThan(0);
        });
      }));

      it('should ensure CSS variables work in shadow DOM', async(() => {
        fixture = TestBed.createComponent(NativeComponent);
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          setTimeout(() => {
            const h1 = fixture.nativeElement.shadowRoot.querySelector('h1');
            expect(getComputedStyle(h1).color).toBe('rgb(0, 0, 255)');
          }, SHADY_CSS_TIMEOUT);
        });
      }));

      it('should ensure CSS mixins work in shadow DOM', async(() => {
        fixture = TestBed.createComponent(NativeComponent);
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          setTimeout(() => {
            const h1 = fixture.nativeElement.shadowRoot.querySelector('h1');
            expect(getComputedStyle(h1).fontSize).toBe('8px');
          }, SHADY_CSS_TIMEOUT);
        });
      }));
    }
  });
});
