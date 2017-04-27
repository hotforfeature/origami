import {} from 'jasmine';

import { getPolymer } from './Polymer';

describe('getPolymer()', () => {
  it('should return window.Polymer', () => {
    expect(window.Polymer).toBeDefined();
    expect(getPolymer()).toBe(window.Polymer);
  });
});
