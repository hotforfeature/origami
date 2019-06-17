import {
  APP_INITIALIZER,
  Component,
  NgModule,
  NgModuleFactoryLoader,
  NgModuleRef,
  ViewEncapsulation
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  RouterTestingModule,
  SpyNgModuleFactoryLoader
} from '@angular/router/testing';
import { IncludeStyles, resetIncludeStyles } from './include-styles';
import { INJECT_STYLES_PROVIDER, injectIncludeStyles } from './inject-styles';
import { resetTypeSelectors } from './type-selectors';

describe('styles', () => {
  describe('modules', () => {
    describe('INJECT_STYLES_PROVIDER', () => {
      it('should provide injectIncludeStyles() as part of APP_INITIALIZER', () => {
        expect(INJECT_STYLES_PROVIDER).toEqual({
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: injectIncludeStyles,
          deps: [NgModuleRef]
        });
      });
    });

    describe('injectIncludeStyles()', () => {
      let fixture: ComponentFixture<any>;
      let styleModuleDiv: HTMLDivElement;
      beforeAll(() => {
        styleModuleDiv = document.createElement('div');
        styleModuleDiv.innerHTML = `
          <dom-module id="blue-class">
            <template>
              <style>
                .blue {
                  color: blue;
                }
              </style>
            </template>
          </dom-module>
        `;

        document.head!.appendChild(styleModuleDiv);
      });

      afterEach(() => {
        resetIncludeStyles();
        resetTypeSelectors();
        fixture.destroy();
      });

      afterAll(() => {
        document.head!.removeChild(styleModuleDiv);
      });

      it('should inject @IncludeStyles() for emulated encapsulation components', () => {
        @IncludeStyles('blue-class')
        @Component({
          selector: 'emulated-comp',
          styles: [':host { display: block; }'],
          template: '<div class="blue">blue</div>',
          encapsulation: ViewEncapsulation.Emulated
        })
        class EmulatedComponent {}

        @Component({
          template:
            '<div class="root blue">not blue</div><emulated-comp></emulated-comp>'
        })
        class EmulatedRoot {}

        @NgModule({
          declarations: [EmulatedComponent, EmulatedRoot],
          entryComponents: [EmulatedComponent],
          bootstrap: [EmulatedRoot]
        })
        class EmulatedModule {}

        debugger;
        TestBed.configureTestingModule({
          imports: [EmulatedModule, RouterTestingModule.withRoutes([])],
          providers: [INJECT_STYLES_PROVIDER]
        });

        fixture = TestBed.createComponent(EmulatedRoot);
        expect(
          getComputedStyle(
            fixture.nativeElement.querySelector('emulated-comp .blue')
          ).color
        ).toBe('rgb(0, 0, 255)');
        expect(
          getComputedStyle(fixture.nativeElement.querySelector('.root.blue'))
            .color
        ).not.toBe('rgb(0, 0, 255)');
      });

      it('should inject @IncludeStyles() for non-encapsulation components', () => {
        @IncludeStyles('blue-class')
        @Component({
          selector: 'global-comp',
          styles: [':host { display: block; }'],
          template: '<div class="blue">blue</div>',
          encapsulation: ViewEncapsulation.None
        })
        class GlobalComponent {}

        @Component({
          template:
            '<div class="root blue">also blue</div><global-comp></global-comp>'
        })
        class GlobalRoot {}

        @NgModule({
          declarations: [GlobalComponent, GlobalRoot],
          entryComponents: [GlobalComponent],
          bootstrap: [GlobalRoot]
        })
        class GlobalModule {}

        TestBed.configureTestingModule({
          imports: [GlobalModule, RouterTestingModule.withRoutes([])],
          providers: [INJECT_STYLES_PROVIDER]
        });

        fixture = TestBed.createComponent(GlobalRoot);
        expect(
          getComputedStyle(
            fixture.nativeElement.querySelector('global-comp .blue')
          ).color
        ).toBe('rgb(0, 0, 255)');
        expect(
          getComputedStyle(fixture.nativeElement.querySelector('.root.blue'))
            .color
        ).toBe('rgb(0, 0, 255)');
      });

      it('should inject @IncludeStyles() for lazy-loaded components', async () => {
        @IncludeStyles('blue-class')
        @Component({
          selector: 'lazy-comp',
          styles: [':host { display: block; }'],
          template: '<div class="blue">blue</div>'
        })
        class LazyComponent {}

        @NgModule({
          imports: [
            RouterTestingModule.withRoutes([
              { path: '', component: LazyComponent }
            ])
          ],
          declarations: [LazyComponent],
          entryComponents: [LazyComponent]
        })
        class LazyModule {}

        @Component({
          template:
            '<div class="root blue">not blue</div><router-outlet></router-outlet>'
        })
        class RootComponent {}

        @NgModule({
          imports: [
            RouterTestingModule.withRoutes([
              { path: 'lazy', loadChildren: 'LazyModule' }
            ])
          ],
          declarations: [RootComponent],
          bootstrap: [RootComponent]
        })
        class RootModule {}

        TestBed.configureTestingModule({
          imports: [RootModule],
          providers: [INJECT_STYLES_PROVIDER]
        });

        const moduleLoader = <SpyNgModuleFactoryLoader>(
          TestBed.get(NgModuleFactoryLoader)
        );
        moduleLoader.stubbedModules = { LazyModule };
        fixture = TestBed.createComponent(RootComponent);
        const router = <Router>TestBed.get(Router);
        router.initialNavigation();
        await router.navigateByUrl('/lazy');
        expect(
          getComputedStyle(
            fixture.nativeElement.querySelector('lazy-comp .blue')
          ).color
        ).toBe('rgb(0, 0, 255)');
        expect(
          getComputedStyle(fixture.nativeElement.querySelector('.root.blue'))
            .color
        ).not.toBe('rgb(0, 0, 255)');
      });
    });
  });
});
