import { unwrapPolymerEvent } from './unwrapPolymerEvent';

describe('unwrapPolymerEvent', () => {
  it('should return non-CustomEvent values as is', () => {
    expect(unwrapPolymerEvent(true)).toEqual(true);
    const ref = {};
    expect(unwrapPolymerEvent(ref)).toBe(ref);
  });

  it('should unwrap CustomEvent and use event.detail.value', () => {
    const event = new CustomEvent('property-changed', {
      detail: {
        value: true
      }
    });

    expect(unwrapPolymerEvent(<any>event)).toEqual(true);
  });

  it('should recursively unwrap CustomEvents', () => {
    const event = new CustomEvent('property-changed', {
      detail: {
        value: new CustomEvent('subproperty-changed', {
          detail: {
            value: true
          }
        })
      }
    });

    expect(unwrapPolymerEvent(<any>event)).toEqual(true);
  });
});
