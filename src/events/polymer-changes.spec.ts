import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {} from 'jasmine';

import { PolymerChanges } from './polymer-changes';

@Component({
  selector: 'test-component',
  template: ''
})
class TestComponent {
  @PolymerChanges() property: boolean;

  get setterProp(): boolean { return this._setterProp; }

  @PolymerChanges() set setterProp(value: boolean) { this._setterProp = value; }

  _setterProp: boolean;
}

describe('PolymerChanges', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent]
    });

    fixture = TestBed.createComponent(TestComponent);
  });

  it('should set and retrieve values normally', () => {
    expect(fixture.componentInstance.property).toBeUndefined();
    fixture.componentInstance.property = false;
    expect(fixture.componentInstance.property).toBe(false);
    fixture.componentInstance.property = true;
    expect(fixture.componentInstance.property).toBe(true);
  });

  it('should work with getters and setters', () => {
    expect(fixture.componentInstance.setterProp).toBeUndefined();
    fixture.componentInstance.setterProp = false;
    expect(fixture.componentInstance.setterProp).toBe(false);
    expect(fixture.componentInstance._setterProp).toBe(false);
    fixture.componentInstance.setterProp = true;
    expect(fixture.componentInstance.setterProp).toBe(true);
    expect(fixture.componentInstance._setterProp).toBe(true);
  });

  it('should unwrap CustomEvent and use event.detail.value', () => {
    expect(fixture.componentInstance.property).toBeUndefined();
    fixture.componentInstance.property = <any>new CustomEvent('propertyChange', {
      detail: {
        value: true
      }
    });

    expect(fixture.componentInstance.property).toBe(true);

    expect(fixture.componentInstance.setterProp).toBeUndefined();
    fixture.componentInstance.setterProp = <any>new CustomEvent('setterPropChange', {
      detail: {
        value: true
      }
    });

    expect(fixture.componentInstance.setterProp).toBe(true);
    expect(fixture.componentInstance._setterProp).toBe(true);
  });

  it('should ignore mutation event values', () => {
    expect(fixture.componentInstance.property).toBeUndefined();
    fixture.componentInstance.property = <any>new CustomEvent('propertyChange', {
      detail: {
        path: 'propertyChange.modified',
        value: true
      }
    });

    expect(fixture.componentInstance.property).toBeUndefined();
  });
});
