import {
  Component,
  ComponentFactoryResolver,
  NgModule,
  Type
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IncludeStyles, resetIncludeStyles } from './include-styles';
import {
  getTypeFor,
  resetTypeSelectors,
  scanComponentFactoryResolver
} from './type-selectors';

describe('styles', () => {
  describe('modules', () => {
    describe('getTypeFor()', () => {
      it('should return undefined if type was not scanned', () => {
        expect(getTypeFor('unknown-component')).toBeUndefined();
      });
    });

    describe('scanComponentFactoryResolver()', () => {
      let AppComponent: Type<any>;
      let AppModule: Type<any>;

      beforeEach(() => {
        @IncludeStyles('style-module')
        @Component({
          selector: 'app-component',
          template: '<div>Decorated</div>'
        })
        class DecoratedComponent {}

        @NgModule({
          declarations: [DecoratedComponent],
          bootstrap: [DecoratedComponent]
        })
        class Module {}

        AppComponent = DecoratedComponent;
        AppModule = Module;
      });

      afterEach(() => {
        resetIncludeStyles();
        resetTypeSelectors();
      });

      it('should scan decorated types and add them to getTypeFor()', () => {
        TestBed.configureTestingModule({
          imports: [AppModule]
        });

        scanComponentFactoryResolver(TestBed.get(ComponentFactoryResolver));
        expect(getTypeFor('app-component')).toBe(AppComponent);
      });

      it('should handle scanning multiple times', () => {
        TestBed.configureTestingModule({
          imports: [AppModule]
        });

        const resolver = TestBed.get(ComponentFactoryResolver);
        scanComponentFactoryResolver(resolver);
        scanComponentFactoryResolver(resolver);
        expect(getTypeFor('app-component')).toBe(AppComponent);
      });

      it('should handle types that were not decorated', () => {
        @Component({
          selector: 'undecorated-component',
          template: '<div>Undecorated</div>'
        })
        class UndecoratedComponent {}

        @NgModule({
          declarations: [UndecoratedComponent],
          bootstrap: [UndecoratedComponent]
        })
        class UndecoratedModule {}

        TestBed.configureTestingModule({
          imports: [UndecoratedModule]
        });

        expect(() => {
          scanComponentFactoryResolver(TestBed.get(ComponentFactoryResolver));
        }).not.toThrow();
      });
    });
  });
});
