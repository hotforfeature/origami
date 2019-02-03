import { DomModule } from '@polymer/polymer/lib/elements/dom-module';
import {
  clearStyleModuleCache,
  importStyleModule
} from './import-style-module';

describe('styles', () => {
  describe('modules', () => {
    describe('importStyleModule()', () => {
      const styleText = '.yellow { color: yellow }';
      let styleModuleDiv: HTMLDivElement;
      let multiStyleModuleDiv: HTMLDivElement;

      beforeAll(() => {
        styleModuleDiv = document.createElement('div');
        styleModuleDiv.innerHTML = `
          <dom-module id="style-module">
            <template>
              <style>
                ${styleText}
              </style>
            </template>
          </dom-module>
        `;

        multiStyleModuleDiv = document.createElement('div');
        multiStyleModuleDiv.innerHTML = `
          <dom-module id="multi-style-module">
            <template>
              <style>
                ${styleText}
              </style>
              <style>
                .green { color: green }
              </style>
            </template>
          </dom-module>
        `;

        document.head!.appendChild(styleModuleDiv);
        document.head!.appendChild(multiStyleModuleDiv);
      });

      afterEach(() => {
        clearStyleModuleCache();
      });

      afterAll(() => {
        document.head!.removeChild(styleModuleDiv);
        document.head!.removeChild(multiStyleModuleDiv);
      });

      it('should return string of CSS from Polymer style module', () => {
        const style = importStyleModule('style-module');
        expect(style).toEqual(jasmine.any(String));
        expect(style).toContain(styleText);
      });

      it('should return empty string if style module does not exist', () => {
        expect(importStyleModule('unknown-style')).toBe('');
      });

      it('should concatenate all <style> elements in module', () => {
        const style = importStyleModule('multi-style-module');
        expect(style).toEqual(jasmine.any(String));
        expect(style).toContain(styleText);
        expect(style).toContain('.green { color: green }');
      });

      it('should cache calls to DomModule.import()', () => {
        spyOn(DomModule, 'import').and.callThrough();
        importStyleModule('style-module');
        importStyleModule('style-module');
        expect(DomModule.import).toHaveBeenCalledTimes(1);
      });
    });
  });
});
