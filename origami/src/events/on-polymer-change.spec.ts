import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {} from 'jasmine';

import { OnPolymerChange } from './on-polymer-change';
import { PolymerChanges } from './polymer-changes';

@Component({
  selector: 'test-component',
  template: ''
})
class TestComponent implements OnPolymerChange {
  @PolymerChanges() property: boolean;
  @PolymerChanges() objProp = {
    modified: false
  };

  onPolymerChange() {
    // noop
  }
}

describe('OnPolymerChange', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent]
    });

    fixture = TestBed.createComponent(TestComponent);
  });

  it('should not be called when @PolymerChanges property changes normally', () => {
    spyOn(fixture.componentInstance, 'onPolymerChange');
    expect(fixture.componentInstance.property).toBeUndefined();
    fixture.componentInstance.property = true;
    expect(fixture.componentInstance.property).toBe(true);
    expect(fixture.componentInstance.onPolymerChange).not.toHaveBeenCalled();
  });

  it('should be called when @PolymerChanges property changes from CustomEvent', () => {
    spyOn(fixture.componentInstance, 'onPolymerChange');
    expect(fixture.componentInstance.property).toBeUndefined();
    const event = new CustomEvent('propertyChange', {
      detail: {
        value: true
      }
    });

    fixture.componentInstance.property = <any>event;
    expect(fixture.componentInstance.property).toBe(true);
    expect(fixture.componentInstance.onPolymerChange).toHaveBeenCalledWith('property', event,
      event.detail);
  });

  it('should not be called when property value does not change', () => {
    spyOn(fixture.componentInstance, 'onPolymerChange');
    expect(fixture.componentInstance.property).toBeUndefined();
    fixture.componentInstance.property = true;
    expect(fixture.componentInstance.property).toBe(true);
    const event = new CustomEvent('propertyChange', {
      detail: {
        value: true
      }
    });

    fixture.componentInstance.property = <any>event;
    expect(fixture.componentInstance.property).toBe(true);
    expect(fixture.componentInstance.onPolymerChange).not.toHaveBeenCalled();
  });

  it('should be called when mutation event is fired', () => {
    spyOn(fixture.componentInstance, 'onPolymerChange');
    const obj = fixture.componentInstance.objProp;
    expect(obj).toBeDefined();
    expect(obj.modified).toBe(false);
    const event = new CustomEvent('objPropChange', {
      detail: {
        path: 'objProp.modified',
        value: true
      }
    });

    fixture.componentInstance.objProp = <any>event;
    expect(fixture.componentInstance.objProp).toBe(obj);
    // @PolymerChanges does not propagate mutation events, they come from Polymer which means
    // Polymer already changed the value. Since we're faking it, obj.modified is still false
    expect(obj.modified).toBe(false);
    expect(fixture.componentInstance.onPolymerChange).toHaveBeenCalledWith('objProp', event,
      event.detail);
  });
});
