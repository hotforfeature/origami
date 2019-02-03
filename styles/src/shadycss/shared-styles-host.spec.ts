import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ɵDomSharedStylesHost as DomSharedStylesHost } from '@angular/platform-browser';
import '@webcomponents/shadycss/entrypoints/apply-shim';
import '@webcomponents/shadycss/entrypoints/custom-style-interface';
import { USING_APPLY } from './process-stylesheets';
import {
  ShadyCSSSharedStylesHost,
  SHADYCSS_SHARED_STYLES_HOST_PROVIDER
} from './shared-styles-host';

describe('styles', () => {
  describe('shadycss', () => {
    describe('SHADYCSS_SHARED_STYLES_HOST_PROVIDER', () => {
      it('should provide ShadyCSSSharedStylesHost instead of DomSharedStylesHost', () => {
        expect(SHADYCSS_SHARED_STYLES_HOST_PROVIDER).toEqual({
          provide: DomSharedStylesHost,
          useClass: ShadyCSSSharedStylesHost
        });
      });
    });

    describe('ShadyCSSSharedStylesHost', () => {
      let globalStyle: HTMLStyleElement;

      beforeEach(() => {
        expect(window.ShadyCSS).toBeDefined();
        expect(window.ShadyCSS.CustomStyleInterface).toBeDefined();
        globalStyle = document.createElement('style');
        document.head!.appendChild(globalStyle);
      });

      afterEach(() => {
        document.head!.removeChild(globalStyle);
      });

      it('should ensure @apply mixins work', () => {
        globalStyle.innerHTML = `
          html {
            --blue-mixin: {
              color: blue;
            }
          }
        `;

        @Component({
          selector: 'mixin-component',
          template: '<div class="blue">blue</div>',
          styles: [
            `
              .blue {
                @apply --blue-mixin;
              }
            `
          ]
        })
        class MixinComponent {}

        TestBed.configureTestingModule({
          declarations: [MixinComponent],
          providers: [
            SHADYCSS_SHARED_STYLES_HOST_PROVIDER,
            { provide: USING_APPLY, useValue: true }
          ]
        });

        const fixture = TestBed.createComponent(MixinComponent);
        window.ShadyCSS.flushCustomStyles();
        expect(
          getComputedStyle(fixture.nativeElement.querySelector('.blue')).color
        ).toBe('rgb(0, 0, 255)');
      });

      it('should ensure CSS custom properties work', () => {
        globalStyle.innerHTML = `
          html {
            --blue-property: blue;
          }
        `;

        @Component({
          selector: 'property-component',
          template: '<div class="blue">blue</div>',
          styles: [
            `
              .blue {
                color: var(--blue-property);
              }
            `
          ]
        })
        class PropertyComponent {}

        TestBed.configureTestingModule({
          declarations: [PropertyComponent],
          providers: [SHADYCSS_SHARED_STYLES_HOST_PROVIDER]
        });

        const fixture = TestBed.createComponent(PropertyComponent);
        window.ShadyCSS.flushCustomStyles();
        expect(
          getComputedStyle(fixture.nativeElement.querySelector('.blue')).color
        ).toBe('rgb(0, 0, 255)');
      });
    });
  });
});
