# Data Binding

## One-Way

Custom element properties can be one-way bound easily and natively in Angular. After all, they're just properties.

```ts
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">
    <button (click)="toggleDisabled()">Update from Polymer</button>

    <paper-button #paperButton [disabled]="isDisabled"></paper-button>
  `
})
export class PolyComponent {
  isDisabled: boolean;
  @ViewChild('paperButton') paperButton: ElementRef;

  toggleDisabled() {
    this.paperButton.nativeElement.disabled = !this.paperButton.nativeElement.disabled;
  }
}
```

The checkbox represents a change from Angular, and the button represents a change from Polymer.

Both the checkbox and button disable the `<paper-button>`, but clicking the button does not change the checkbox value. This is because we aren't listening for Polymer change events yet.

## Two-Way

Two-way binding is more complicated, but not impossible.

Angular listens for a <em>property</em>Change event when using the `[( )]` syntax. Polymer fires a <em>property</em>-changed event.

> `<element [(property)]="value">`
>
> desugars to
>
> `<element [property]="value" (propertyChange)="value = $event">`

```ts
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">
    <button (click)="toggleDisabled()">Update from Polymer</button>

    <paper-button #paperButton [disabled]="isDisabled"
        (disabled-changed)="isDisabled = $event.detail.value"></paper-button>
  `
})
export class PolyComponent {
  isDisabled: boolean;
  @ViewChild('paperButton') paperButton: ElementRef;

  toggleDisabled() {
    this.paperButton.nativeElement.disabled = !this.paperButton.nativeElement.disabled;
  }
}
```

Remember that Polymer fires `CustomEvent`s. The value that was changed exists on `$event.detail.value`, not the `$event` itself.

Now clicking the button to simulate a change from Polymer will correctly update the checkbox value.
