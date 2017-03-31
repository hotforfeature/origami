# Change Detection

Angular automagically fires rounds of change detection constantly in an app. A quick way to gain performance is to switch to the OnPush change detection strategy. Aside from some core events (such as `@Input()`s changing), the component is responsible for determining when to mark and detect changes.

What if Polymer updates a property? How does Angular know to re-run change detection?

Properties decorated with `@PolymerProperty()` will notify a component of the change if the component implements `OnPolymerChange`. Then the component can determine if it needs to run change detection.

```ts
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PolymerProperty, OnPolymerChange } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">

    <paper-button [(disabled)]="isDisabled"></paper-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolyComponent implements OnPolymerChange {
  @PolymerProperty() isDisabled: boolean;

  constructor(private changeRef: ChangeDetectorRef) { }

  onPolymerChange(property?: string, event?: CustomEvent, detail?: any) {
    // property - the name of the property changed
    // event - the CustomEvent fired from Polymer
    // detail - event.detail
    this.changeRef.detectChanges();
  }
}
```
