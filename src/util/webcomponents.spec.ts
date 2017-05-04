import {} from 'jasmine';

import { webcomponentsReady, webcomponentsSupported } from './webcomponents';

describe('webcomponentsReady', () => {
  it('should return a Promise', () => {
    expect(webcomponentsReady()).toEqual(jasmine.any(Promise));
  });

  it('should not create multiple Promises', () => {
    const result = webcomponentsReady();
    expect(webcomponentsReady()).toBe(result);
  });
});

describe('webcomponentsSupported', () => {
  it('should return true in test environment', () => {
    expect(webcomponentsSupported()).toBe(true);
  });
});
