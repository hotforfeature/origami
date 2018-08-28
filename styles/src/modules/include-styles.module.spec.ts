import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IncludeStylesModule } from './include-styles.module';
import { INJECT_STYLES_PROVIDER, injectIncludeStyles } from './inject-styles';

describe('styles', () => {
  describe('modules', () => {
    describe('IncludeStylesModule', () => {
      it('should call injectIncludeStyles on startup', () => {
        expect((<FactoryProvider>INJECT_STYLES_PROVIDER).useFactory).toBe(
          injectIncludeStyles
        );
        spyOn(
          <FactoryProvider>INJECT_STYLES_PROVIDER,
          'useFactory'
        ).and.callThrough();
        TestBed.configureTestingModule({
          imports: [IncludeStylesModule, RouterTestingModule]
        });

        TestBed.get(APP_INITIALIZER);
        expect(
          (<FactoryProvider>INJECT_STYLES_PROVIDER).useFactory
        ).toHaveBeenCalled();
      });
    });
  });
});
