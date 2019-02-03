import { InjectionToken } from '@angular/core';
import xhrMock, { MockRequest, MockResponse } from 'xhr-mock';
import { ShadyCSS } from './models';
import {
  isStyleNode,
  processStylesheets,
  USING_APPLY
} from './process-stylesheets';

describe('styles', () => {
  describe('shadycss', () => {
    describe('USING_APPLY', () => {
      it('should be an injection token', () => {
        expect(USING_APPLY).toEqual(jasmine.any(InjectionToken));
      });
    });

    describe('processStylesheets()', () => {
      let $ShadyCSS: ShadyCSS;
      let $styles: Array<HTMLStyleElement | HTMLLinkElement>;

      beforeEach(() => {
        xhrMock.setup();
        $styles = Array.from(
          document.querySelectorAll('style,link[rel=stylesheet]')
        );
        $styles.forEach(style => style.parentNode!.removeChild(style));
        $ShadyCSS = window.ShadyCSS;
        window.ShadyCSS = {
          nativeCss: false,
          nativeShadow: false,
          CustomStyleInterface: {
            addCustomStyle: jasmine.createSpy('addCustomStyle')
          },
          flushCustomStyles: jasmine.createSpy('flushCustomStyles')
        };
      });

      afterEach(() => {
        xhrMock.teardown();
        window.ShadyCSS = $ShadyCSS;
        Array.from(
          document.querySelectorAll('style,link[rel=stylesheet]')
        ).forEach(style => {
          style.parentNode!.removeChild(style);
        });

        $styles.forEach(style => document.head!.appendChild(style));
      });

      it('should pass non-scoped style nodes to CustomStyleInterface', async () => {
        const style = document.createElement('style');
        document.head!.appendChild(style);
        const scoped = document.createElement('style');
        scoped.setAttribute('scope', 'paper-button');
        document.head!.appendChild(scoped);
        await processStylesheets();
        expect(
          window.ShadyCSS.CustomStyleInterface!.addCustomStyle
        ).toHaveBeenCalledWith(style);
        expect(
          window.ShadyCSS.CustomStyleInterface!.addCustomStyle
        ).not.toHaveBeenCalledWith(scoped);
      });

      it('should fetch link styles and replace them with style node', async () => {
        const link = document.createElement('link');
        const linkLoad = new Promise(resolve => (link.onload = resolve));
        link.rel = 'stylesheet';
        const cssText = '.blue { color: blue; }';
        link.href = `data:text/css;base64,${btoa(cssText)}`;
        xhrMock.get(link.href, (_req, res) => {
          return res.status(200).body(cssText);
        });

        document.head!.appendChild(link);
        await linkLoad;
        await processStylesheets();
        const createdStyle: HTMLStyleElement = Array.from(
          document.querySelectorAll('style')
        ).find(style => {
          return style.innerText.includes(cssText);
        })!;

        expect(createdStyle).toBeDefined();
        expect(
          window.ShadyCSS.CustomStyleInterface!.addCustomStyle
        ).toHaveBeenCalledWith(createdStyle);
        expect(createdStyle.parentNode).toBe(document.head);
        expect(link.parentNode).toBeFalsy();
      });

      it('should not make multiple requests to link style hrefs', async () => {
        const link = document.createElement('link');
        const linkLoad = new Promise(resolve => (link.onload = resolve));
        link.rel = 'stylesheet';
        const cssText = '.blue { color: blue; }';
        link.href = `data:text/css;base64,${btoa(cssText)}`;
        const xhrHandler = jasmine
          .createSpy('handler')
          .and.callFake((_req: MockRequest, res: MockResponse) => {
            return res.status(200).body(cssText);
          });

        xhrMock.get(link.href, xhrHandler);
        document.head!.appendChild(link);
        await linkLoad;
        await Promise.all([processStylesheets(), processStylesheets()]);
        expect(xhrHandler).toHaveBeenCalledTimes(1);
        document.head!.removeChild(
          Array.from(document.querySelectorAll('style')).find(style => {
            return style.innerText.includes(cssText);
          })!
        );
      });

      it('should not process styles if nativeCss is supported', async () => {
        const style = document.createElement('style');
        document.head!.appendChild(style);
        window.ShadyCSS.nativeCss = true;
        await processStylesheets();
        expect(
          window.ShadyCSS.CustomStyleInterface!.addCustomStyle
        ).not.toHaveBeenCalled();
      });

      it('should process styles if nativeCss is supported and usingApply is true', async () => {
        const style = document.createElement('style');
        document.head!.appendChild(style);
        window.ShadyCSS.nativeCss = true;
        await processStylesheets(true);
        expect(
          window.ShadyCSS.CustomStyleInterface!.addCustomStyle
        ).toHaveBeenCalledWith(style);
      });
    });

    describe('isStyleNode()', () => {
      it('should return true if the element is a style node', () => {
        expect(isStyleNode(document.createElement('style'))).toBe(true);
        expect(isStyleNode(document.createElement('div'))).toBe(false);
      });
    });
  });
});
