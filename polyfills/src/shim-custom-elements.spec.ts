import { shimCustomElements } from './shim-custom-elements';
import {
  resetWebcomponentsReady,
  webcomponentsReady
} from './webcomponents-ready';

describe('polyfills', () => {
  describe('shimCustomElements()', () => {
    let $customElements: CustomElementRegistry;
    let $WebComponents: typeof window.WebComponents;

    beforeEach(() => {
      $customElements = window.customElements;
      $WebComponents = window.WebComponents;
      delete window.customElements;
      resetWebcomponentsReady();
    });

    afterEach(() => {
      window.customElements = $customElements;
      window.WebComponents = $WebComponents;
    });

    it('should do nothing if customElements already exists', () => {
      const mockCustomElements = <any>{};
      window.customElements = mockCustomElements;
      shimCustomElements();
      expect(window.customElements).toBe(mockCustomElements);
    });

    it('should shim customElements when it is not present', () => {
      expect(window.customElements).toBeUndefined();
      shimCustomElements();
      expect(window.customElements).toBeDefined();
      expect(window.customElements.define).toEqual(jasmine.any(Function));
      expect(window.customElements.get).toEqual(jasmine.any(Function));
      expect(window.customElements.whenDefined).toEqual(jasmine.any(Function));
    });

    it('should shim define and get', () => {
      shimCustomElements();
      class ShimCeElement extends HTMLElement {}
      expect(() => {
        window.customElements.define('shim-ce-element', ShimCeElement);
      }).not.toThrow();

      expect(window.customElements.get('shim-ce-element')).toBe(ShimCeElement);
      expect(window.customElements.get('not-defined')).toBeFalsy();
    });

    it('should define elements when webcomponents are ready', async () => {
      shimCustomElements();
      class ShimCeElement extends HTMLElement {}
      window.customElements.define('shim-ce-element', ShimCeElement, {
        extends: 'button'
      });
      window.customElements = {
        define: jasmine.createSpy('define'),
        get: jasmine.createSpy('get'),
        whenDefined: jasmine.createSpy('whenDefined'),
        upgrade: jasmine.createSpy('upgrade')
      };

      window.WebComponents = { ready: true };
      await webcomponentsReady();
      expect(window.customElements.define).toHaveBeenCalledWith(
        'shim-ce-element',
        ShimCeElement,
        { extends: 'button' }
      );
    });

    it('should resolve promises from whenDefined after webcomponents are ready', async () => {
      shimCustomElements();
      const promiseThen = jasmine.createSpy();
      const promise = window.customElements
        .whenDefined('shim-ce-element')
        .then(promiseThen);
      class ShimCeElement extends HTMLElement {}
      window.customElements.define('shim-ce-element', ShimCeElement, {
        extends: 'button'
      });
      expect(promiseThen).not.toHaveBeenCalled();
      window.customElements = {
        define: jasmine.createSpy('define'),
        get: jasmine.createSpy('get'),
        whenDefined: jasmine
          .createSpy('whenDefined')
          .and.returnValue(Promise.resolve()),
        upgrade: jasmine.createSpy('upgrade')
      };

      expect(promiseThen).not.toHaveBeenCalled();
      await webcomponentsReady();
      await promise;
      expect(promiseThen).toHaveBeenCalled();
    });

    it('should handle multiple calls to whenDefined', async () => {
      shimCustomElements();
      const promiseThen = jasmine.createSpy();
      const promises = [
        window.customElements.whenDefined('shim-ce-element').then(promiseThen),
        window.customElements.whenDefined('shim-ce-element').then(promiseThen)
      ];

      class ShimCeElement extends HTMLElement {}
      window.customElements.define('shim-ce-element', ShimCeElement, {
        extends: 'button'
      });
      expect(promiseThen).not.toHaveBeenCalled();
      window.customElements = {
        define: jasmine.createSpy('define'),
        get: jasmine.createSpy('get'),
        whenDefined: jasmine
          .createSpy('whenDefined')
          .and.returnValue(Promise.resolve()),
        upgrade: jasmine.createSpy('upgrade')
      };

      expect(promiseThen).not.toHaveBeenCalled();
      await webcomponentsReady();
      await Promise.all(promises);
      expect(promiseThen).toHaveBeenCalled();
    });

    it('should upgrade nodes when webcomponents are ready', async () => {
      shimCustomElements();
      const node = document.createElement('div');
      window.customElements.upgrade(node);
      window.customElements = {
        define: jasmine.createSpy('define'),
        get: jasmine.createSpy('get'),
        whenDefined: jasmine.createSpy('whenDefined'),
        upgrade: jasmine.createSpy('upgrade')
      };

      window.WebComponents = { ready: true };
      await webcomponentsReady();
      expect(window.customElements.upgrade).toHaveBeenCalledWith(node);
    });
  });
});
