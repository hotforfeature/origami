import { TestBed } from '@angular/core/testing';
import { ɵDomSharedStylesHost as DomSharedStylesHost } from '@angular/platform-browser';
import { USING_APPLY } from './process-stylesheets';
import { ShadyCSSModule } from './shadycss.module';
import { ShadyCSSSharedStylesHost } from './shared-styles-host';

describe('styles', () => {
  describe('shadycss', () => {
    describe('ShadyCSSModule', () => {
      it('should provide ShadyCSSSharedStylesHost', () => {
        TestBed.configureTestingModule({
          imports: [ShadyCSSModule]
        });

        const stylesHost = TestBed.get(DomSharedStylesHost);
        expect(stylesHost).toEqual(jasmine.any(ShadyCSSSharedStylesHost));
      });

      it('should have be USING_APPLY be default', () => {
        TestBed.configureTestingModule({
          imports: [ShadyCSSModule]
        });

        const usingApply = TestBed.get(USING_APPLY, null);
        expect(usingApply).toBeFalsy();
      });

      describe('.usingApply()', () => {
        it('should provide USING_APPLY as true', () => {
          TestBed.configureTestingModule({
            imports: [ShadyCSSModule.usingApply()]
          });

          const usingApply = TestBed.get(USING_APPLY);
          expect(usingApply).toBe(true);
        });
      });
    });
  });
});
