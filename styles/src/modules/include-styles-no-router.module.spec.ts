import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IncludeStylesNoRouterModule } from './include-styles-no-router.module';
import {
  INJECT_STYLES_NO_ROUTER_PROVIDER,
  injectIncludeStylesNoRouter
} from './inject-styles';

describe('styles', () => {
  describe('modules', () => {
    describe('IncludeStylesNoRouterModule', () => {
      it('should call injectIncludeStylesNoRouter on startup', () => {
        expect(
          (<FactoryProvider>INJECT_STYLES_NO_ROUTER_PROVIDER).useFactory
        ).toBe(injectIncludeStylesNoRouter);
        spyOn(
          <FactoryProvider>INJECT_STYLES_NO_ROUTER_PROVIDER,
          'useFactory'
        ).and.callThrough();
        TestBed.configureTestingModule({
          imports: [IncludeStylesNoRouterModule]
        });

        TestBed.get(APP_INITIALIZER);
        expect(
          (<FactoryProvider>INJECT_STYLES_NO_ROUTER_PROVIDER).useFactory
        ).toHaveBeenCalled();
      });
    });
  });
});
