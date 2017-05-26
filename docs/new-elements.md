# New Elements

Consuming Polymer elements is great, but what if a project needs to define its own web component? Sometimes this may be required. `<iron-list>` is a good example.

When using a Polymer `<template>` inside `<iron-list>`, it is not possible to use Angular data binding. List templates may be complex, and you may find yourself wanting to create a component.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <iron-list [items]="items" as="item">
      <ng-template polymer> <!-- Will be <template> when issues are fixed -->
        <div><strong>[[item.name]]</strong></div>
        <div>[[item.folds]] folds</div>
      </ng-template>
    </iron-list>
  `
})
export class PolyComponent {
  items = [
    {
      name: "Crane",
      folds: 23
    },
    {
      name: "Frog",
      folds: 29
    },
    {
      name: "Flower",
      folds: 18
    }
  ];
}
```

This component shows a list of items. Data binding must be done using Polymer since [Angular has no power in Polymer templates](polymer-templates.md). What if we want to use this template elsewhere in our app? We would need to re-define it, styles, and logic associated.

It makes more sense to use an element.

```html
<iron-list [items]="items" as="item">
  <ng-template polymer> <!-- Will be <template> when issues are fixed -->
    <app-item item="[[item]]"></app-item>
  </ng-template>
</iron-list>
```

Since we cannot use Angular components inside Polymer templates, we need to use a web component. Where do we define this component?

## Asset Definition

Remember that Angular html templates aren't "real HTML". They are consumed by the build process and exist as JavaScript when compiled. To define our own web component, we need an HTML file that the app will see at runtime.

We could define a bower component in a separate repository, then import it. This would be great if we reuse our component in other projects. If, like our example, you just want a component for the Angular project, it makes more sense to define it in our project.

The `assets/` folder, or any other folder that is included with the project's build, is a great place to define things.

assets/app-item.html
```html
<link href="bower_components/polymer/polymer.html" rel="import">

<dom-module id="app-item">
  <template>
    <div><strong>[[item.name]]</strong></div>
    <div>[[item.folds]]</div>
  </template>
  <script>
    class AppItem extends Polymer.Element {
      static get is() { return 'app-item'; }
      static get properties() {
        return {
          item: Object
        };
      }
    }

    customElements.define(AppItem.is, AppItem);
  </script>
</dom-module>
```

This element has access to `bower_components/` so it can import other dependencies. The last thing to do is import it.

index.html
```html
<html>
<head>
  <meta charset="utf-8">
  <title>Paper Crane</title>
  <base href="/">

  <script src="assets/bower_components/webcomponentsjs/webcomponents-loader.js"></script>
  <link href="assets/app-item.html" rel="import">
</head>
<body>
  <app-root>Loading...</app-root>
</body>
</html>
```

We could also import this element in `assets/elements.html` if following the [recommended way to import elements](importing-elements.md).

## TypeScript

We declare our element as an ES6-style class. There's no need to use the legacy `Polymer()` function since our element doesn't need to support Polymer 1.x.

However, we cannot use TypeScript at this time. Angular won't process anything in the `assets/` folder, they're static. As such, they won't be compiled from TypeScript to JavaScript. A project would need a highly customized build to use TypeScript in custom element definitions, and that's outside the scope of this documentation.

