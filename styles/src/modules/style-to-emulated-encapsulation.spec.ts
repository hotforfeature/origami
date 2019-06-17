import {
  CONTENT_ATTR,
  HOST_ATTR,
  styleToEmulatedEncapsulation
} from './style-to-emulated-encapsulation';

describe('styles', () => {
  describe('modules', () => {
    describe('styleToEmulatedEncapsulation()', () => {
      it('should replace :host', () => {
        expect(styleToEmulatedEncapsulation(':host {display: block;}')).toBe(
          `[${HOST_ATTR}] {display: block;}`
        );
      });

      it('should replace :host in @media', () => {
        expect(
          styleToEmulatedEncapsulation(
            '@media (print) {:host {display: block;}}'
          )
        ).toBe(`@media (print) {[${HOST_ATTR}] {display: block;}}`);
      });

      it('should replace :host-context()', () => {
        expect(
          styleToEmulatedEncapsulation(
            ':host-context(.hidden) {display: block;}'
          )
        ).toBe(`*.hidden [${HOST_ATTR}] {display: block;}`);
        expect(
          styleToEmulatedEncapsulation(
            ':host-context(:not(.hidden)) {display: block;}'
          )
        ).toBe(`*:not(.hidden) [${HOST_ATTR}] {display: block;}`);
        expect(
          styleToEmulatedEncapsulation(
            ':host-context([disabled]) {display: block;}'
          )
        ).toBe(`*[disabled] [${HOST_ATTR}] {display: block;}`);
      });

      it('should replace :host-context() in @media', () => {
        expect(
          styleToEmulatedEncapsulation(
            '@media (print) {:host-context(.hidden) {display: block;}}'
          )
        ).toBe(`@media (print) {*.hidden [${HOST_ATTR}] {display: block;}}`);
        expect(
          styleToEmulatedEncapsulation(
            '@media (print) {:host-context(:not(.hidden)) {display: block;}}'
          )
        ).toBe(
          `@media (print) {*:not(.hidden) [${HOST_ATTR}] {display: block;}}`
        );
        expect(
          styleToEmulatedEncapsulation(
            '@media (print) {:host-context([disabled]) {display: block;}}'
          )
        ).toBe(`@media (print) {*[disabled] [${HOST_ATTR}] {display: block;}}`);
      });

      it('should ignore single and double quoted :host', () => {
        expect(
          styleToEmulatedEncapsulation(":host {content: ':host{}';}")
        ).toBe(`[${HOST_ATTR}] {content: ':host{}';}`);
        expect(
          styleToEmulatedEncapsulation(':host {content: ":host{}";}')
        ).toBe(`[${HOST_ATTR}] {content: ":host{}";}`);
        expect(
          styleToEmulatedEncapsulation(
            ":host {content: ':host-context(.any){}';}"
          )
        ).toBe(`[${HOST_ATTR}] {content: ':host-context(.any){}';}`);
        expect(
          styleToEmulatedEncapsulation(
            ':host {content: ":host-context(.any){}";}'
          )
        ).toBe(`[${HOST_ATTR}] {content: ":host-context(.any){}";}`);
        expect(
          styleToEmulatedEncapsulation(
            ":host-context(.any) {content: ':host{}';}"
          )
        ).toBe(`*.any [${HOST_ATTR}] {content: ':host{}';}`);
        expect(
          styleToEmulatedEncapsulation(
            ':host-context(.any) {content: ":host{}";}'
          )
        ).toBe(`*.any [${HOST_ATTR}] {content: ":host{}";}`);
        expect(
          styleToEmulatedEncapsulation(
            ":host-context(.any) {content: ':host-context(.any){}';}"
          )
        ).toBe(`*.any [${HOST_ATTR}] {content: ':host-context(.any){}';}`);
        expect(
          styleToEmulatedEncapsulation(
            ':host-context(.any) {content: ":host-context(.any){}";}'
          )
        ).toBe(`*.any [${HOST_ATTR}] {content: ":host-context(.any){}";}`);
      });

      it('should add content attribute to selectors', () => {
        expect(styleToEmulatedEncapsulation('.blue {color: blue;}')).toBe(
          `.blue[${CONTENT_ATTR}] {color: blue;}`
        );
        expect(styleToEmulatedEncapsulation('div.blue {color: blue;}')).toBe(
          `div.blue[${CONTENT_ATTR}] {color: blue;}`
        );
        expect(
          styleToEmulatedEncapsulation('.color,.blue {color: blue;}')
        ).toBe(`.color[${CONTENT_ATTR}],.blue[${CONTENT_ATTR}] {color: blue;}`);
      });

      it('should add content attribute to selectors in @media', () => {
        expect(
          styleToEmulatedEncapsulation('@media (print) {.blue {color: blue;}}')
        ).toBe(`@media (print) {.blue[${CONTENT_ATTR}] {color: blue;}}`);
        expect(
          styleToEmulatedEncapsulation(
            '@media (print) {div.blue {background: blue;}}'
          )
        ).toBe(
          `@media (print) {div.blue[${CONTENT_ATTR}] {background: blue;}}`
        );
        expect(
          styleToEmulatedEncapsulation(
            '@media (print) {.color,.blue {color: blue;}}'
          )
        ).toBe(
          `@media (print) {.color[${CONTENT_ATTR}],.blue[${CONTENT_ATTR}] {color: blue;}}`
        );
      });
    });
  });
});
