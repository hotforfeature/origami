# Data Binding

[TL;DR;](#tldr)

## One-Way + Angular

Custom element properties can be one-way bound easily and natively in Angular. After all, they're just properties. Origami is not needed for that.

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

At this point, everything works! If you wanted, you could stop here and make Angular + Polymer work without Origami.

What if we need to bind 3-4 events though? Things will start to look extremely verbose and complicated.

## Two-Way + Origami

Origami introduces the `[emitChanges]` directive. This directive will map Polymer change events to Angular change events.

When Polymer fires `disabled-changed`, Origami will fire a `disabledChange` event. This allows two-way data binding with the `[( )]` syntax.

```ts
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">
    <button (click)="toggleDisabled()">Update from Polymer</button>

    <paper-button #paperButton emitChanges [(disabled)]="isDisabled"></paper-button>
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

This works (sort of).

Whenever an update comes from Polymer, `isDisabled` is set to a `CustomEvent` instead of a boolean.

Remember that `[( )]` desugars to `(disabledChange)="isDisabled = $event`. The actual boolean is in `event.detail.value`.

We can decorate the `isDisabled` property to automatically unwrap Polymer events.

```ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import { PolymerChanges } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">
    <button (click)="toggleDisabled()">Update from Polymer</button>

    <paper-button #paperButton emitChanges [(disabled)]="isDisabled"></paper-button>
  `
})
export class PolyComponent {
  @PolymerChanges() isDisabled: boolean;
  @ViewChild('paperButton') paperButton: ElementRef;

  toggleDisabled() {
    this.paperButton.nativeElement.disabled = !this.paperButton.nativeElement.disabled;
  }
}
```

Now `isDisabled` changes to the correct boolean value when changed from Polymer!

`@PolymerChanges()` works under the hood by replacing the property with custom getters and setters. What if the property already has a getter or setter?

## Two-Way + Setters + Origami

Simply add `@PolymerChanges()` to either the getter or setter (not both) and the value provided will always be unwrapped.

```ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import { PolymerChanges } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">
    <button (click)="toggleDisabled()">Update from Polymer</button>

    <paper-button #paperButton emitChanges [(disabled)]="isDisabled"></paper-button>
  `
})
export class PolyComponent {
  private _isDisabled: boolean;

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  @PolymerChanges() set isDisabled(value: boolean) {
    this._isDisabled = value;
  }

  @ViewChild('paperButton') paperButton: ElementRef;

  toggleDisabled() {
    this.paperButton.nativeElement.disabled = !this.paperButton.nativeElement.disabled;
  }
}
```

Remember that `@PolymerChanges()` unwraps events coming from Polymer, so it only affects a property's setter. The decorator is not needed if the property is readonly with a getter and no setter. Origami will issue a warning if `@PolymerChanges()` is not needed.

## Collection Modules

The `[emitChanges]` directive will map any custom element (that follows Polymer's <em>property-changed</em> event syntax) to Angular events that can easily be bound with `@PolymerChanges()`.

Why not define a directive to automatically select all custom elements and apply the `[emitChanges]` directive logic?

Enter collection modules!

Origami provides modules that select several custom elements. In our example, we could import the `PaperElementsModule` and not need to use `[emitChanges]`. It would "Just Work" (TM).

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
    PolymerModule.forRoot(),
    PaperElementsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

poly.component.ts
```ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import { PolymerChanges } from '@codebakery/origami';

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
  @PolymerChanges() isDisabled: boolean;
  @ViewChild('paperButton') paperButton: ElementRef;

  toggleDisabled() {
    this.paperButton.nativeElement.disabled = !this.paperButton.nativeElement.disabled;
  }
}
```

This is what Origami was created for. Using Polymer custom elements seamlessly in Angular!

<a name="tldr"></a>
## Recap (TL;DR;)

To use a Polymer-built custom element in Angular:

1. Add the `[emitChanges]` attribute to two-way bound elements (or import a module that does this for you)
2. Use `@PolymerChanges()` decorators on properties bound to custom elements
