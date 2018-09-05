import { whenSet } from './when-set';

describe('util', () => {
  describe('whenSet()', () => {
    it('should resolve when value set', async () => {
      const target: { foo?: string } = {};
      const promise = whenSet(target, 'foo');
      expect(target.foo).toBeUndefined();
      target.foo = 'bar';
      const result = await promise;
      expect(result).toBe('bar');
      expect(target.foo).toBe('bar');
    });

    it('should resolve if value already set', async () => {
      const target = { foo: 'bar' };
      expect(target.foo).toBe('bar');
      const result = await whenSet(target, 'foo');
      expect(result).toBe('bar');
      expect(target.foo).toBe('bar');
    });

    it('should replace property descriptor after being set', async () => {
      const target: { foo?: string } = {};
      const promise = whenSet(target, 'foo');
      let desc = Object.getOwnPropertyDescriptor(target, 'foo');
      expect(desc).toBeDefined();
      expect(desc!.get).toBeDefined();
      expect(desc!.set).toBeDefined();
      expect(desc!.enumerable).toBe(true);
      expect(desc!.configurable).toBe(true);
      target.foo = 'bar';
      await promise;
      desc = Object.getOwnPropertyDescriptor(target, 'foo');
      expect(desc).toBeDefined();
      expect(desc!.get).toBeUndefined();
      expect(desc!.set).toBeUndefined();
      expect(desc!.enumerable).toBe(true);
      expect(desc!.configurable).toBe(true);
      expect(desc!.writable).toBe(true);
    });

    it('should resolve multiple promises', async () => {
      const target: { foo?: string } = {};
      const promises = [whenSet(target, 'foo'), whenSet(target, 'foo')];

      target.foo = 'bar';
      const result = await Promise.all(promises);
      expect(result).toEqual(['bar', 'bar']);
    });

    it('should handle waiting for multiple properties', async () => {
      const target: { foo?: string; baz?: string } = {};
      const promises = [whenSet(target, 'foo'), whenSet(target, 'baz')];

      target.foo = 'bar';
      target.baz = 'qux';
      const result = await Promise.all(promises);
      expect(result).toEqual(['bar', 'qux']);
    });

    it('should allow custom predicate', async () => {
      const target: { foo?: string | null } = {};
      let promise = whenSet(target, 'foo');
      target.foo = null;
      let result = await promise;
      expect(result).toBe(null);
      promise = whenSet(target, 'foo', value => !!value);
      target.foo = undefined;
      target.foo = null;
      target.foo = 'bar';
      result = await promise;
      expect(result).toBe('bar');
    });

    it('should allow synchronous callbacks', () => {
      const target: { foo?: string } = {};
      const callbackSync = jasmine.createSpy('callbackSync');
      whenSet(target, 'foo', undefined, callbackSync);
      target.foo = 'bar';
      expect(callbackSync).toHaveBeenCalledWith('bar');
      expect(target.foo).toBe('bar');
    });

    it('should allow synchronous callbacks when value already set', () => {
      const target = { foo: 'bar' };
      const callbackSync = jasmine.createSpy('callbackSync');
      whenSet(target, 'foo', undefined, callbackSync);
      expect(callbackSync).toHaveBeenCalledWith('bar');
    });

    it('should allow multiple synchronous callbacks', () => {
      const target: { foo?: string } = {};
      const callbacks = [
        jasmine.createSpy('callbackSync1'),
        jasmine.createSpy('callbackSync2'),
        jasmine.createSpy('callbackSync3')
      ];

      callbacks.forEach(callback =>
        whenSet(target, 'foo', undefined, callback)
      );
      target.foo = 'bar';
      callbacks.forEach(callback =>
        expect(callback).toHaveBeenCalledWith('bar')
      );
      expect(target.foo).toBe('bar');
    });
  });
});
