import { InjectionToken } from '@angular/core';
import { POLYMER_HOST, patchPolymerHost, polymerHost } from './polymerHost';

describe('templates', () => {
  describe('POLYMER_HOST', () => {
    it('should be an InjectionToken', () => {
      expect(POLYMER_HOST).toEqual(jasmine.any(InjectionToken));
    });
  });

  describe('polymerHost()', () => {
    it('should return provider using patchPolymerHost and provided dependency', () => {
      class AppComponent {}
      expect(polymerHost(AppComponent)).toEqual({
        provide: POLYMER_HOST,
        useFactory: patchPolymerHost,
        deps: [AppComponent]
      });
    });
  });

  describe('patchPolymerHost()', () => {
    it('should patch _addEventListenerToNode on dataHost that calls addEventListener', () => {
      const target = <any>{};
      patchPolymerHost(target);
      expect(target._addEventListenerToNode).toEqual(jasmine.any(Function));
      const node = {
        addEventListener: jasmine.createSpy('addEventListener')
      };

      const eventName = 'click';
      const handler = () => {};
      target._addEventListenerToNode(node, eventName, handler);
      expect(node.addEventListener).toHaveBeenCalledWith(eventName, handler);
    });

    it('should return patched dataHost', () => {
      const target = {};
      const result = patchPolymerHost(target);
      expect(result).toBe(target);
    });

    it('should preserve existing _addEventListenerToNode method', () => {
      const _addEventListenerToNode = () => {};
      const target = { _addEventListenerToNode };
      patchPolymerHost(target);
      expect(target._addEventListenerToNode).toBe(_addEventListenerToNode);
    });
  });
});
