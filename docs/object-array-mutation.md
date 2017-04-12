# Object and Array Mutation

Before starting, it is good to understand [how Polymer works with object and array data](https://www.polymer-project.org/2.0/docs/devguide/model-data).

Most properties bound between Angular and Polymer using `@PolymerProperty()` are primitive types, such as strings or numbers, and are passed by value. However, objects and arrays are passed by reference in JavaScript.

```js
let primitive = 'Hello World';
let newPrimitive = primitive;
primitive === newPrimitive; // true, values are the same
newPrimitive = 'Goodbye';
primitive !== newPrimitive; // true, values are not the same

let array = [1, 2, 3];
let newArray = array;
array === newArray; // true, references are the same
newArray.push(4); // this mutates the value, which array and newArray reference
array !== newArray; // false, references are the same
```

Angular solves this problem with change detection, which runs automatically by default at key events or application ticks. Change detection will re-evaluate bindings. This means that even if an object or array is mutated, the binding will re-evaluate to the correct result.

Polymer is more conservative, and will only update its bindings when it has been notified of a [subproperty change](https://www.polymer-project.org/2.0/docs/devguide/model-data#notify-path) or an [array mutation](https://www.polymer-project.org/2.0/docs/devguide/model-data#notifysplices). It is more performant, but requires extra work.

## Polymer -> Angular

Luckily, `@PolymerProperty()` already listens to object and array mutation events from Polymer.

Usually, properties are mutated by a user interaction, such as a click. By default, Angular will run change detection on these key events, and no further work is required.

However, if a mutation occurs in Polymer programmatically, or if a component is using `ChangeDetection.OnPush`, change detection will need to be run manually from the `onPolymerChange()` callback.

```ts
import { Component, ChangeDetectorRef } from '@angular/core';
import { PolymerProperty, OnPolymerChange } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <my-list [items]="myItems"></my-list>
  `
})
export class PolyComponent implements OnPolymerChange {
  @PolymerProperty() myItems = [1, 2, 3, 4];

  constructor(private changeRef: ChangeDetectorRef) { }

  onPolymerChange() {
    // Even when not using ChangeDetectionStrategy.OnPush, it may be necessary
    // to fire change detection if Angular does not
    this.changeRef.detectChanges();
  }
}
```

## Angular -> Polymer

Polymer will not automatically check for mutations like Angular does. This means we need to manually inform Polymer of changes.

```ts
import { Component, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { PolymerProperty, OnPolymerChange } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <paper-button (click)="addItem()">Add Item</paper-button>
    <my-list #myList [items]="myItems"></my-list>
  `
})
export class PolyComponent implements OnPolymerChange {
  @PolymerProperty() myItems = [1, 2, 3, 4];
  @ViewChild('myList') myListRef: ElementRef;

  constructor(private changeRef: ChangeDetectorRef) { }

  addItem() {
    this.myItems.push(5);
    this.myListRef.nativeElement.notifySplices('items', [
      { index: 3, addedCount: 1, removed: [], object: this.myItems, type: 'splice' }
    ]);
  }

  onPolymerChange() {
    this.changeRef.detectChanges();
  }
}
```

Remember that it is necessary to notify the Polymer element of the name of its own property. Even though we mutate the `myItems` property in Angular, it is bound to the `items` property in `<my-list>`.

It's easy to see how quickly notifying Polymer will turn into a maintenance nightmare.

Whenever possible, it's recommended to use Polymer's [property or subproperty path setters](https://www.polymer-project.org/2.0/docs/devguide/model-data#set-path) or [array mutation methods](https://www.polymer-project.org/2.0/docs/devguide/model-data#array-mutation) when mutating an object or array from Angular.

Origami provides the `Polymer.PropertyEffects` interface to assist in correctly typing the methods.

```ts
import { Component, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Polymer, PolymerProperty, OnPolymerChange } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <paper-button (click)="addItem()">Add Item</paper-button>
    <my-list #myList [items]="myItems"></my-list>
  `
})
export class PolyComponent implements OnPolymerChange {
  @PolymerProperty() myItems = [1, 2, 3, 4];
  @ViewChild('myList') myListRef: ElementRef;

  constructor(private changeRef: ChangeDetectorRef) { }

  addItem() {
    (<Polymer.PropertyEffects>this.myListRef.nativeElement).push('items', 5);
  }

  onPolymerChange() {
    this.changeRef.detectChanges();
  }
}
```

## MutableData

The above dirty-checking mechanism is what Polymer uses by default. Polymer 2.0 provides the `Polymer.MutableData` mixin to allow elements to opt out of dirty checking.

```js
class MyListElement extends Polymer.MutableData(Polymer.Element)
```

Elements using `MutableData` can using `notifyPath()` to invoke their property effects, even if the mutation was in a deep path.

```ts
import { Component, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Polymer, PolymerProperty, OnPolymerChange } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <paper-button (click)="addItem()">Add Item</paper-button>
    <my-list #myList [items]="myItems"></my-list>
  `
})
export class PolyComponent implements OnPolymerChange {
  @PolymerProperty() myItems = [1, 2, 3, 4];
  @ViewChild('myList') myListRef: ElementRef;

  constructor(private changeRef: ChangeDetectorRef) { }

  addItem() {
    this.myItems.push(5);
    this.myListRef.nativeElement.notifyPath('items');
  }

  onPolymerChange() {
    this.changeRef.detectChanges();
  }
}
```

Many built-in elements extend the `Polymer.OptionalMutableData` mixin, where `MutableData` mode can be set by the `mutableData` property.

```js
class MyListElement extends Polymer.OptionalMutableData(Polymer.Element)
```

```ts
import { Component, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Polymer, PolymerProperty, OnPolymerChange } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <paper-button (click)="addItem()">Add Item</paper-button>
    <my-list #myList [items]="myItems" mutable-data></my-list>
  `
})
export class PolyComponent implements OnPolymerChange {
  @PolymerProperty() myItems = [1, 2, 3, 4];
  @ViewChild('myList') myListRef: ElementRef;

  constructor(private changeRef: ChangeDetectorRef) { }

  addItem() {
    this.myItems.push(5);
    this.myListRef.nativeElement.notifyPath('items');
  }

  onPolymerChange() {
    this.changeRef.detectChanges();
  }
}
```
