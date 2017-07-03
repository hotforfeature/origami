import {} from 'jasmine';

import { getCustomElements } from './customElements';

describe('getCustomElements()', () => {
  it('should return window.customElements', () => {
    expect(window.customElements).toBeDefined();
    expect(getCustomElements()).toBe(window.customElements);
  });
});
