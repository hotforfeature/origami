import {} from 'jasmine';

import { getCustomElements } from './customElements';
import { getCustomElementClass } from './getCustomElementClass';
import { getPolymer } from './Polymer';

describe('getCustomElementClass()', () => {
  it('should return constructor function for the element', () => {
    const CustomElement = getPolymer()({ // tslint:disable-line:variable-name
      is: 'custom-element'
    });

    expect(getCustomElementClass({
      nativeElement: document.createElement('custom-element')
    })).toBe(CustomElement);
  });

  it('should return undefined and warn if element is not registered', () => {
    spyOn(console, 'warn');
    expect(getCustomElementClass({
      nativeElement: document.createElement('unregistered-element')
    })).toBeUndefined();
    expect(console.warn).toHaveBeenCalled();
  });

  it('should return undefined when no ElementRef provided', () => {
    expect(getCustomElementClass(undefined)).toBeUndefined();
  });
});
