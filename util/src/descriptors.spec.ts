import { wrapAndDefineDescriptor } from './descriptors';

describe('util', () => {
  describe('wrapAndDefineDescriptor()', () => {
    it('should define a property for the given target', () => {
      const target = {};
      wrapAndDefineDescriptor(target, 'prop', {});
      expect(target.hasOwnProperty('prop')).toBe(true);
    });
  });

  describe('wrapDescriptor()', () => {
    it('should call shouldSet hook before setting value and only set if hook returns true', () => {
      const hooks = {
        shouldSet: jasmine.createSpy('shouldSet').and.returnValue(true)
      };

      const target = { prop: 0 };
      wrapAndDefineDescriptor(target, 'prop', hooks);
      target.prop = 1;
      expect(target.prop).toEqual(1);
      expect(hooks.shouldSet).toHaveBeenCalledWith(1);
      hooks.shouldSet = jasmine.createSpy('shouldSet').and.returnValue(false);
      target.prop = 2;
      expect(target.prop).not.toEqual(2);
      expect(hooks.shouldSet).toHaveBeenCalledWith(2);
    });

    it('should call beforeSet hook and use returned value', () => {
      const hooks = {
        beforeSet: jasmine.createSpy('beforeSet').and.returnValue(42)
      };

      const target = { prop: 0 };
      wrapAndDefineDescriptor(target, 'prop', hooks);
      target.prop = 1;
      expect(hooks.beforeSet).toHaveBeenCalledWith(1);
      expect(target.prop).toEqual(42);
    });

    it('should call afterSet hook with changed status', () => {
      const hooks = {
        afterSet: jasmine.createSpy('afterSet')
      };

      const target = { prop: 0 };
      wrapAndDefineDescriptor(target, 'prop', hooks);
      target.prop = 1;
      expect(hooks.afterSet).toHaveBeenCalledWith(true, 1, 1);
      target.prop = 1;
      expect(hooks.afterSet).toHaveBeenCalledWith(false, 1, 1);
      target.prop = 2;
      expect(hooks.afterSet).toHaveBeenCalledWith(true, 2, 2);
    });

    it('should call afterSet with modified and original values', () => {
      const hooks = {
        afterSet: jasmine.createSpy('afterSet'),
        beforeSet: jasmine.createSpy('beforeSet').and.returnValue(42)
      };

      const target = { prop: 0 };
      wrapAndDefineDescriptor(target, 'prop', hooks);
      target.prop = 1;
      expect(hooks.afterSet).toHaveBeenCalledWith(true, 42, 1);
      target.prop = 1;
      expect(hooks.afterSet).toHaveBeenCalledWith(false, 42, 1);
      target.prop = 2;
      expect(hooks.afterSet).toHaveBeenCalledWith(false, 42, 2);
    });

    it('should preserve existing getters and setters', () => {
      const target = {
        _prop: 0,
        get prop() {
          return this._prop;
        },
        set prop(value) {
          this._prop = value;
        }
      };

      wrapAndDefineDescriptor(target, 'prop', {
        beforeSet: () => 42
      });

      expect(target.prop).toEqual(0);
      target.prop = 1;
      expect(target.prop).toEqual(42);
      expect(target._prop).toEqual(42);
    });

    it('should preserve enumerable properties', () => {
      const target: any = {};
      Object.defineProperty(target, 'prop', {
        configurable: true,
        enumerable: false
      });

      expect(target.propertyIsEnumerable('prop')).toBe(false);
      wrapAndDefineDescriptor(target, 'prop', {
        beforeSet: () => 42
      });

      expect(target.propertyIsEnumerable('prop')).toBe(false);
      target.prop = 1;
      expect(target.prop).toEqual(42);
    });

    it('should set different values for instances when target is a class', () => {
      class Test {
        prop?: number;
      }

      wrapAndDefineDescriptor(Test, 'prop', {});
      const inst1 = new Test();
      const inst2 = new Test();
      inst1.prop = 1;
      inst2.prop = 2;
      expect(inst1.prop).toEqual(1);
      expect(inst2.prop).toEqual(2);
    });
  });
});
