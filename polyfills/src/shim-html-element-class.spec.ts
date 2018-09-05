import { shimHtmlElementClass } from './shim-html-element-class';

describe('polyfills', () => {
  describe('shimHtmlElementClass()', () => {
    let $HTMLElement: typeof HTMLElement;

    beforeAll(() => {
      $HTMLElement = window.HTMLElement;
    });

    afterAll(() => {
      window.HTMLElement = $HTMLElement;
    });

    it('should do nothing if HTMLElement is a class', () => {
      class MockHTMLElement {}
      (<any>window.HTMLElement) = MockHTMLElement;
      shimHtmlElementClass();
      expect(window.HTMLElement).toBe(MockHTMLElement);
    });

    it('should replace "object" type HTMLElement with function and preserve prototype', () => {
      const MockHTMLElement = {
        prototype: {}
      };

      (<any>window.HTMLElement) = MockHTMLElement;
      shimHtmlElementClass();
      expect(window.HTMLElement).toEqual(jasmine.any(Function));
      expect(window.HTMLElement.prototype).toBe(<any>MockHTMLElement.prototype);
      const ele = new window.HTMLElement();
      expect(ele).toBeDefined();
    });
  });
});
