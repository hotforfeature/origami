import { APP_INITIALIZER, ValueProvider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  WEBCOMPONENTS_READY_PROVIDER,
  WebComponentsReadyModule
} from './webcomponents-ready.module';
import { webcomponentsReady } from './webcomponents-ready';

describe('polyfills', () => {
  describe('WEBCOMPONENTS_READY_PROVIDER', () => {
    it('should provide webcomponentsReady to APP_INITIALIZER', () => {
      expect(WEBCOMPONENTS_READY_PROVIDER).toEqual({
        provide: APP_INITIALIZER,
        multi: true,
        useValue: webcomponentsReady
      });
    });
  });

  describe('WebComponentsReadyModule', () => {
    it('should call webcomponentsReady on startup', () => {
      expect((<ValueProvider>WEBCOMPONENTS_READY_PROVIDER).useValue).toBe(
        webcomponentsReady
      );
      spyOn(
        <ValueProvider>WEBCOMPONENTS_READY_PROVIDER,
        'useValue'
      ).and.callThrough();
      TestBed.configureTestingModule({
        imports: [WebComponentsReadyModule]
      });

      TestBed.get(APP_INITIALIZER);
      expect(
        (<ValueProvider>WEBCOMPONENTS_READY_PROVIDER).useValue
      ).toHaveBeenCalled();
    });
  });
});
