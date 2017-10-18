import { getShadyCSS } from './ShadyCSS';

describe('getShadyCSS()', () => {
  it('should return window.ShadyCSS', () => {
    expect(window.ShadyCSS).toBeDefined();
    expect(getShadyCSS()).toBe(window.ShadyCSS);
  });
});
