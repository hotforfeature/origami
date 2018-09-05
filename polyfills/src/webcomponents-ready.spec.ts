import {
  resetWebcomponentsReady,
  webcomponentsReady
} from './webcomponents-ready';

describe('polyfills', () => {
  describe('webcomponentsReady()', () => {
    let $WebComponents: typeof window.WebComponents;
    beforeEach(() => {
      $WebComponents = window.WebComponents;
      delete window.WebComponents;
      resetWebcomponentsReady();
    });

    afterEach(() => {
      window.WebComponents = $WebComponents;
    });

    it('should resolve when WebComponentsReady event fires', async () => {
      const promiseThen = jasmine.createSpy();
      const promise = webcomponentsReady().then(promiseThen);
      window.WebComponents = {
        ready: false
      };

      expect(promiseThen).not.toHaveBeenCalled();
      document.dispatchEvent(new CustomEvent('WebComponentsReady'));
      await promise;
      expect(promiseThen).toHaveBeenCalled();
    });

    it('should resolve if WebComponents.ready is true', async () => {
      const promiseThen = jasmine.createSpy();
      const promise = webcomponentsReady().then(promiseThen);
      expect(promiseThen).not.toHaveBeenCalled();
      window.WebComponents = {
        ready: true
      };

      await promise;
      expect(promiseThen).toHaveBeenCalled();
    });
  });
});
