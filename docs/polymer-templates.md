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
      <ng-template polymer> <!-- Will be <template> when issues are fixed -->
        <div>[[item]]</div>
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
}
```

Note the `[[ ]]` syntax. This is a Polymer template, which means we must use Polymer template syntax when data binding.

Similarly, we cannot use an Angular component inside our `<iron-list>`, since it will not be instantiated by Angular. It will simply be an HTMLUnknownElement that was stamped by Polymer.

Luckily there are few elements in Polymer where a user-defined template is needed. Many Polymer utility templates (such as `dom-if` and `dom-repeat`) are present in Angular as `*ngIf` and `*ngFor`.

### Polymer Elements inside Templates

When templates are required in a Polymer element, the app must fully commit and only use Polymer elements for data binding.

index.html
```html
<html>
<head>
  <meta charset="utf-8">
  <title>Angular-Polymer App</title>
  <base href="/">

  <script src="assets/bower_components/webcomponentsjs/webcomponents-loader.js"></script>
  <link href="assets/bower_components/paper-button/paper-button.html" rel="import">
</head>
<body>
  <dom-module id="my-item">
    <template>
      <div>The item is [[item]]</div>
    </template>
    <script>
      // This example is a hybrid Polymer element that works in ES5
      // TypeScript will not transpile code here or in the assets folder
      Polymer({
        is: 'my-item',
        properties: {
          item: String
        }
      });
    </script>
  </dom-module>

  <app-root>Loading...</app-root>
  <script>
    window.webComponentsReady = false;
    window.addEventListener('WebComponentsReady', function() {
      window.webComponentsReady = true;
    });
  </script>
</body>
</html>
```

app.component.ts
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <iron-list [items]="items" as="item">
      <ng-template polymer>
        <my-item item="[[item]]"></my-item>
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
}
```

## Method Host

When `<template>`s are used inside a Polymer element, method bindings in the template refer to methods of the host element. An Angular component does not automatically set this, which can be problematic for computed properties inside templates.

To get around this, `template[polymer]` has a `methodHost` input to specify what should be used as the host for template methods.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <iron-list [items]="items" as="item">
      <ng-template polymer [methodHost]="this">
        <my-item item="[[item]]" color="[[getColor(item)]]"></my-item>
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

  getColor(item: string) {
    return item === 'one' ? 'blue' : 'red';
  }
}
```

## Broken Templates

`enableLegacyTemplate` and `<template>` elements are not currently working.

This documentation refers to Polymer `<template>` elements. Until the below issues are resolved, use `<ng-template polymer>` instead of `<template>`.

See
- https://github.com/angular/angular/issues/15555
- https://github.com/angular/angular/issues/15557
