# Forms

Adds support for Angular template and reactive form directives on custom elements.

## Usage

Import the `OrigamiFormsModule` from Origami in addition to the Angular `FormsModule` or `ReactiveFormsModule`.

```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { OrigamiFormsModule } from '@codebakery/origami/forms';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, FormsModule, OrigamiFormsModule],
  declarations: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Add the `origami` directive to any custom elements that use template or reactive form directives.

```ts
import { Component } from '@angular/core';
import '@polymer/paper-input/paper-input';

@Component({
  selector: 'app-component',
  template: `
    <div>Angular value: {{value}}</div>
    <paper-input [(ngModel)]="value" origami></paper-input>
  `
})
export class AppComponent {
  value: string;
}
```

## Custom Element Types

There are four supported form element types. Each type defines a specific property to hold their value and will dispatch events to notify of value changes.

Origami will automatically determine which events to listen to and which properties to update for an element if it fits into one of these categories.

### Default

- sets the `value` property
- updates from `(input)` or `(value-changed)` events

Example:

```html
<paper-input [(ngModel)]="input" origami></paper-input>

<vaadin-date-picker [(ngModel)]="date" origami></vaadin-date-picker>
```

### Checkboxes

- sets the `checked` property to a boolean
- updates from `(checked-changed)` event

Example:

```html
<paper-checkbox [(ngModel)]="isChecked" origami></paper-checkbox>

<vaadin-checkbox [(ngModel)]="isChecked" origami></vaadin-checkbox>
```

### Select

- sets the `selected` or `selectedItem` property
- updates from `(selected-changed)` or `(selected-item-changed)` events

The element must define a `selected` and/or `selectedItem` property. Origami will automatically determine the correct property to update based on what the element has defined and the value type.

Example:

```html
<!-- Updates the `selected` property -->
<paper-listbox [(ngModel)]="selectedIndex" origami>
  <paper-item>Item 1</paper-item>
  <paper-item>Item 2</paper-item>
</paper-listbox>

<!-- Updates the `selectedItem` property -->
<vaadin-combo-box [items]="items" [(ngModel)]="selectedItem" origami></vaadin-combo-box>
```

### Multi-Select

- sets the `selectedValues` or `selectedItems` property
- updates from `(selected-values-changed)` or `(selected-items-changed)` events

The element must define a `selectedValues` and/or `selectedItems` property. If the element also defines a `selected` and/or `selectedItem` property, then it must additional have a `multi` property that is set to `true`. Origami will automatically determine the correct property to update based on what the element has defined and the value type.

Example:

```html
<!-- Updates the `selectedValues` property -->
<paper-listbox multi [(ngModel)]="selectedIndices" origami>
  <paper-item>Item 1</paper-item>
  <paper-item>Item 2</paper-item>
</paper-listbox>
```

## Validation

If an element defines an `invalid` property, Origami will update it whenever the Angular control's validity changes. The default is to set `invalid` to `true` when a control is both invalid and dirty.

This behavior can be changed by providing a callback function to `[isInvalid]` on the element.

```ts
@Component({
  selector: 'app-component',
  template: `
    <paper-input pattern="[0-9]+" [(ngModel)]="value" origami [isInvalid]="isInvalid"></paper-input>
  `
})
export class AppComponent {
  value?: string;

  isInvalid(ngControl: NgControl): boolean {
    // Marks an element as invalid if the control is invalid and it is either dirty or touched.
    return ngControl.invalid && (ngControl.dirty || ngControl.touched);
  }
}
```

Additionally, if the element defines a `validate()` function, Origami will include that function's logic in the Angular control's validators. It will be run every time the value changes.
