import { getShadyCSS } from './ShadyCSS';

describe('getShadyCSS()', () => {
  let originalShadyCSS: any;

  beforeAll(() => {
    originalShadyCSS = window.ShadyCSS;
    if (!window.ShadyCSS) {
      window.ShadyCSS = <any>{};
    }
  });

  afterAll(() => {
    window.ShadyCSS = originalShadyCSS;
  });

  it('should return window.ShadyCSS', () => {
    expect(window.ShadyCSS).toBeDefined();
    expect(getShadyCSS()).toBe(window.ShadyCSS);
  });
});
