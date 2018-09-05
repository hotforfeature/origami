import { IncludeStyles, resetIncludeStyles } from './include-styles';

describe('styles', () => {
  describe('modules', () => {
    describe('IncludeStyles', () => {
      afterEach(() => {
        resetIncludeStyles();
      });

      describe('.getRegisteredTypes()', () => {
        it('should return all types that were decorated', () => {
          @IncludeStyles('style-module')
          class Comp1 {}

          @IncludeStyles('style-module', 'other-style-module')
          class Comp2 {}

          expect(IncludeStyles.getRegisteredTypes()).toEqual([Comp1, Comp2]);
        });
      });

      describe('.getStyleModulesFor()', () => {
        it('should register one or more styles for a type', () => {
          @IncludeStyles('style-module')
          class Comp1 {}

          @IncludeStyles('style-module', 'other-style-module')
          class Comp2 {}

          expect(IncludeStyles.getStyleModulesFor(Comp1)).toEqual([
            'style-module'
          ]);
          expect(IncludeStyles.getStyleModulesFor(Comp2)).toEqual([
            'style-module',
            'other-style-module'
          ]);
        });

        it('should return an empty array if the type was not decorated', () => {
          expect(
            IncludeStyles.getStyleModulesFor(class Unregistered {})
          ).toEqual([]);
        });
      });
    });
  });
});
