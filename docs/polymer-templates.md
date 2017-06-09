# Polymer Templates

It's a good idea to think of three different type of "templates" in Angular.

- Component templates
- Angular's `<ng-template>` element
- Native `<template>` elements

Component templates and `<ng-template>` elements are parsed and created by Angular using a Renderer.

Polymer uses its Templatizer library to stamp native `<template>` elements onto the DOM.

Angular is unaware of any DOM manipulations Polymer makes. This means that an app _cannot_ use an Angular component or syntax in a Polymer template. Polymer stamps the element onto the DOM, but Angular doesn't know it needs to instantiate the element.

Future support may change this, but at the moment remember the cardinal rule:

**Angular has no power in Polymer templates**

## `<iron-list>`

`<iron-list>` is a good real world example of needing a user-defined template in Angular.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <iron-list [items]="items" as="item">
      <template ngNonBindable>
        <div>[[item]]</div>
      </template>
    </iron-list>
  `
})
export class PolyComponent {
  items = [
    'one',
    'two',
    'three'
  ];
}
```

Note the `[[ ]]` syntax. This is a Polymer template, which means we must use Polymer template syntax when data binding.

Similarly, we cannot use an Angular component inside our `<iron-list>`, since it will not be instantiated by Angular. It will simply be an HTMLUnknownElement that was stamped by Polymer.

Also note the addition of `[ngNonBindable]`. Polymer uses a binding syntax similar to Angular. While `[[ ]]` is not used by Angular, we would get weird effects if we used `{{ }}`, which _is_ recognized by Angular. Remember our cardinal rule, and explicitly tell Angular to ignore all data binding syntax by adding `[ngNonBindable]` to any Polymer template that you use Polymer data binding with.

Luckily there are few elements in Polymer where a user-defined template is needed. Many Polymer utility templates (such as `dom-if` and `dom-repeat`) are present in Angular as `*ngIf` and `*ngFor`.

### Polymer Templates vs New Elements

Mixing data binding systems is never a good idea for maintenance. While it is possible to use Polymer templates and data binding inside an Angular component, it may make more sense to [define a new element](new-elements.md) and use bindings to connect the new element to the Angular component. Let the new element lay out and define the templates, and take property inputs from Angular for its data.

## Host Bindings

When `<template>`s are used inside a Polymer element, event method bindings in the template refer to methods of the host element. An Angular component does not automatically set this, which can be problematic for computed properties inside templates.

To get around this, use `template[polymer]` to specify what instance (usually "this") should be used as the host for template methods.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <iron-list [items]="items" as="item">
      <template [polymer]="this">
        <my-item item="[[item]]" color="[[getColor(item)]]"></my-item>
      </template>
    </iron-list>
  `
})
export class PolyComponent {
  items = [
    'one',
    'two',
    'three'
  ];

  getColor(item: string) {
    return item === 'one' ? 'blue' : 'red';
  }
}
```

At the moment only functions for computed properties are supported. You cannot bind to a host property directly. If you need to bind to a host property, create a simple accessor function to do so.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <iron-list [items]="items" as="item">
      <template [polymer]="this" ngNonBindable>
        <!-- This won't work -->
        <!-- <my-item item="[[item]]" color="[[everythingIsRed]]"></my-item>-->

        <!-- This will! -->
        <my-item item="[[item]]" color="[[getColor()]]"></my-item>
      </template>
    </iron-list>
  `
})
export class PolyComponent {
  everythingIsRed = 'red';
  items = [
    'one',
    'two',
    'three'
  ];

  getColor() {
    return this.everythingIsRed;
  }
}
```

### Events

Polymer-style event bindings such as `on-click` or `on-tap` may also be bound to a host function.

Angular will parse attribute event bindings! Don't forget to add `[ngNonBindable]` to instruct Angular *not* to perform binding.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <iron-list [items]="items" as="item">
      <ng-template [polymer]="this" ngNonBindable>
        <my-item item="[[item]]" on-click="alertClick"></my-item>
      </ng-template>
    </iron-list>
  `
})
export class PolyComponent {
  items = [
    'one',
    'two',
    'three'
  ];

  alertClick(e: MouseEvent) {
    alert('Clicked on ' + e.target.item);
  }
}
```
