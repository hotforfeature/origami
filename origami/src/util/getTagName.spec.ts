import {} from 'jasmine';

import { getTagName } from './getTagName';

describe('getTagName()', () => {
  it('should return ElementRef native element tag name', () => {
    expect(getTagName({
      nativeElement: document.createElement('div')
    })).toBe('<div>');
    expect(getTagName({
      nativeElement: document.createElement('custom-element')
    })).toBe('<custom-element>');
  });

  it('should return "<unknown-element>" when no ElementRef provided', () => {
    expect(getTagName(undefined)).toBe('<unknown-element>');
  });
});
