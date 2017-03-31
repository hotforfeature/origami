# Data Binding

[TL;DR;](#tldr)

## One-Way + Angular

Custom element properties can be one-way bound easily and natively in Angular. After all, they're just properties. Origami is not needed for that.

```ts
import { Component, ViewChild } from '@angular/core';

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
  @ViewChild('paperButton') paperButton: any;

  toggleDisabled() {
    this.paperButton.disabled = !this.paperButton.disabled;
  }
}
```

The checkbox and button disable the `<paper-button>`, but clicking the button does not change the checkbox value.

## Two-Way + Angular

Two-way binding is more complicated, but not impossible.

Angular listens for a <em>property</em>Change event when using the `[( )]` syntax. Polymer fires a <em>property</em>-changed event.

> `<element [(property)]="value">`
>
> desugars to
>
> `<element [property]="value" (propertyChange)="value = $event">`

The app can still listen to those events natively.

```ts
import { Component, ViewChild } from '@angular/core';

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
  @ViewChild('paperButton') paperButton: any;

  toggleDisabled() {
    this.paperButton.disabled = !this.paperButton.disabled;
  }
}
```

At this point, everything works! If you wanted, you could stop here and make Angular + Polymer work without Origami.

What if we need to bind 3-4 events though? Things will start to look extremely verbose and complicated.

## Two-Way + Origami

Origami introduces the `[polymer]` directive. This directive will map Polymer change events to Angular change events.

When Polymer fires `disabled-changed`, Origami will fire a `disabledChange` event. This allows two-way data binding with the `[( )]` syntax.

```ts
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">
    <button (click)="toggleDisabled()">Update from Polymer</button>

    <paper-button #paperButton polymer [(disabled)]="isDisabled"></paper-button>
  `
})
export class PolyComponent {
  isDisabled: boolean;
  @ViewChild('paperButton') paperButton: any;

  toggleDisabled() {
    this.paperButton.disabled = !this.paperButton.disabled;
  }
}
```

This works (sort of).

Whenever an update comes from Polymer, `isDisabled` is set to a `CustomEvent` instead of a boolean.

Remember that `[( )]` desugars to `(disabledChange)="isDisabled = $event`. The actual boolean is in `event.detail.value`.

We can decorate the `isDisabled` property to automatically unwrap Polymer events.

```ts
import { Component, ViewChild } from '@angular/core';
import { PolymerProperty } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">
    <button (click)="toggleDisabled()">Update from Polymer</button>

    <paper-button #paperButton polymer [(disabled)]="isDisabled"></paper-button>
  `
})
export class PolyComponent {
  @PolymerProperty() isDisabled: boolean;
  @ViewChild('paperButton') paperButton: any;

  toggleDisabled() {
    this.paperButton.disabled = !this.paperButton.disabled;
  }
}
```

Now `isDisabled` changes to the correct boolean value when changed from Polymer!

`@PolymerProperty()` works under the hood by replacing the property with custom getters and setters. What if the property already has a setter?

## Two-Way + Setters + Origami

TypeScript compiles in such a way that a class getter/setter take priority over anything that a property decorator might define.

```ts
import { Component, ViewChild } from '@angular/core';
import { PolymerProperty } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">
    <button (click)="toggleDisabled()">Update from Polymer</button>

    <paper-button #paperButton polymer [(disabled)]="isDisabled"></paper-button>
  `
})
export class PolyComponent {
  private _isDisabled: boolean;

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  @PolymerProperty() set isDisabled(value: boolean) {
    // value is still a CustomEvent when fired from Polymer!
    this._isDisabled = value;
  }

  @ViewChild('paperButton') paperButton: any;

  toggleDisabled() {
    this.paperButton.disabled = !this.paperButton.disabled;
  }
}
```

Instead of using the decorator, we can use `PolymerProperty.unwrap()` in the setter.

```ts
import { Component, ViewChild } from '@angular/core';
import { PolymerProperty } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">
    <button (click)="toggleDisabled()">Update from Polymer</button>

    <paper-button #paperButton polymer [(disabled)]="isDisabled"></paper-button>
  `
})
export class PolyComponent {
  private _isDisabled: boolean;

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  set isDisabled(value: boolean) {
    value = PolymerProperty.unwrap(value);
    // Value will always be a boolean now
    this._isDisabled = value;
  }

  @ViewChild('paperButton') paperButton: any;

  toggleDisabled() {
    this.paperButton.disabled = !this.paperButton.disabled;
  }
}
```

## Collection Modules

The `[polymer]` directive will map any custom element (that follows Polymer's <em>property-changed</em> event syntax) to Angular events that can easily be bound with `@PolymerProperty()`.

Why not define a directive to automatically select all custom elements and apply the `[polymer]` directive logic?

Enter collection modules!

Origami provides modules that select several custom elements. In our example, we could import the `PaperElementsModule` and not need to use `[polymer]`. It would "Just Work" (TM).

app.module.ts
```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PolymerModule } from '@codebakery/origami';
import { PaperElementsModule } from '@codebakery/origami/lib/collections';

@NgModule({
  declarations: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    PolymerModule,
    PaperElementsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

poly.component.ts
```ts
import { Component, ViewChild } from '@angular/core';
import { PolymerProperty } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">
    <button (click)="toggleDisabled()">Update from Polymer</button>

    <paper-button #paperButton [(disabled)]="isDisabled"></paper-button>
  `
})
export class PolyComponent {
  @PolymerProperty() isDisabled: boolean;
  @ViewChild('paperButton') paperButton: any;

  toggleDisabled() {
    this.paperButton.disabled = !this.paperButton.disabled;
  }
}
```

This is what Origami was created for. Using Polymer custom elements seamlessly in Angular!

<a name="tldr"></a>
## Recap (TL;DR;)

To use a Polymer-built custom element in Angular:

1. Add the `[polymer]` attribute (or import a module that does this for you)
2. Use `@PolymerProperty()` decorators on properties bound to custom elements
3. Optionally use `PolymerProperty.unwrap` on properties with setters
