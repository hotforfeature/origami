import { styleToEmulatedEncapsulation } from './style-to-emulated-encapsulation';

describe('styles', () => {
  describe('modules', () => {
    describe('styleToEmulatedEncapsulation()', () => {
      it('should replace :host', () => {
        expect(
          styleToEmulatedEncapsulation(':host {display: block;}', 'c1')
        ).toBe('[_nghost-c1] {display: block;}');
      });

      it('should replace :host in @media', () => {
        expect(
          styleToEmulatedEncapsulation(
            '@media (print) {:host {display: block;}}',
            'c1'
          )
        ).toBe('@media (print) {[_nghost-c1] {display: block;}}');
      });

      it('should replace :host-context()', () => {
        expect(
          styleToEmulatedEncapsulation(
            ':host-context(.hidden) {display: block;}',
            'c1'
          )
        ).toBe('*.hidden [_nghost-c1] {display: block;}');
        expect(
          styleToEmulatedEncapsulation(
            ':host-context(:not(.hidden)) {display: block;}',
            'c1'
          )
        ).toBe('*:not(.hidden) [_nghost-c1] {display: block;}');
        expect(
          styleToEmulatedEncapsulation(
            ':host-context([disabled]) {display: block;}',
            'c1'
          )
        ).toBe('*[disabled] [_nghost-c1] {display: block;}');
      });

      it('should replace :host-context() in @media', () => {
        expect(
          styleToEmulatedEncapsulation(
            '@media (print) {:host-context(.hidden) {display: block;}}',
            'c1'
          )
        ).toBe('@media (print) {*.hidden [_nghost-c1] {display: block;}}');
        expect(
          styleToEmulatedEncapsulation(
            '@media (print) {:host-context(:not(.hidden)) {display: block;}}',
            'c1'
          )
        ).toBe(
          '@media (print) {*:not(.hidden) [_nghost-c1] {display: block;}}'
        );
        expect(
          styleToEmulatedEncapsulation(
            '@media (print) {:host-context([disabled]) {display: block;}}',
            'c1'
          )
        ).toBe('@media (print) {*[disabled] [_nghost-c1] {display: block;}}');
      });

      it('should ignore single and double quoted :host', () => {
        expect(
          styleToEmulatedEncapsulation(":host {content: ':host{}';}", 'c1')
        ).toBe("[_nghost-c1] {content: ':host{}';}");
        expect(
          styleToEmulatedEncapsulation(':host {content: ":host{}";}', 'c1')
        ).toBe('[_nghost-c1] {content: ":host{}";}');
        expect(
          styleToEmulatedEncapsulation(
            ":host {content: ':host-context(.any){}';}",
            'c1'
          )
        ).toBe("[_nghost-c1] {content: ':host-context(.any){}';}");
        expect(
          styleToEmulatedEncapsulation(
            ':host {content: ":host-context(.any){}";}',
            'c1'
          )
        ).toBe('[_nghost-c1] {content: ":host-context(.any){}";}');
        expect(
          styleToEmulatedEncapsulation(
            ":host-context(.any) {content: ':host{}';}",
            'c1'
          )
        ).toBe("*.any [_nghost-c1] {content: ':host{}';}");
        expect(
          styleToEmulatedEncapsulation(
            ':host-context(.any) {content: ":host{}";}',
            'c1'
          )
        ).toBe('*.any [_nghost-c1] {content: ":host{}";}');
        expect(
          styleToEmulatedEncapsulation(
            ":host-context(.any) {content: ':host-context(.any){}';}",
            'c1'
          )
        ).toBe("*.any [_nghost-c1] {content: ':host-context(.any){}';}");
        expect(
          styleToEmulatedEncapsulation(
            ':host-context(.any) {content: ":host-context(.any){}";}',
            'c1'
          )
        ).toBe('*.any [_nghost-c1] {content: ":host-context(.any){}";}');
      });

      it('should add content attribute to selectors', () => {
        expect(styleToEmulatedEncapsulation('.blue {color: blue;}', 'c1')).toBe(
          '.blue[_ngcontent-c1] {color: blue;}'
        );
        expect(
          styleToEmulatedEncapsulation('div.blue {color: blue;}', 'c1')
        ).toBe('div.blue[_ngcontent-c1] {color: blue;}');
        expect(
          styleToEmulatedEncapsulation('.color,.blue {color: blue;}', 'c1')
        ).toBe('.color[_ngcontent-c1],.blue[_ngcontent-c1] {color: blue;}');
      });

      it('should add content attribute to selectors in @media', () => {
        expect(
          styleToEmulatedEncapsulation(
            '@media (print) {.blue {color: blue;}}',
            'c1'
          )
        ).toBe('@media (print) {.blue[_ngcontent-c1] {color: blue;}}');
        expect(
          styleToEmulatedEncapsulation(
            '@media (print) {div.blue {background: blue;}}',
            'c1'
          )
        ).toBe('@media (print) {div.blue[_ngcontent-c1] {background: blue;}}');
        expect(
          styleToEmulatedEncapsulation(
            '@media (print) {.color,.blue {color: blue;}}',
            'c1'
          )
        ).toBe(
          '@media (print) {.color[_ngcontent-c1],.blue[_ngcontent-c1] {color: blue;}}'
        );
      });
    });
  });
});
