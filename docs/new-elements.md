# New Elements

Consuming Polymer elements is great, but what if a project needs to define its own web component? Sometimes this may be required. `<iron-list>` and `<vaadin-grid>` are good examples.

When using a Polymer `<template>`, it is not possible to use Angular data binding. We can, however, use Polymer's data binding features. Don't forget to add `[ngNonBindable]` to the `<template>` when using Polymer's binding syntax to make sure Angular doesn't try and parse the bindings.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-poly',
  template: `
    <iron-list [items]="items" as="item">
      <template ngNonBindable>
        <div><strong>[[item.name]]</strong></div>
        <div>[[item.folds]] folds</div>
      </template>
    </iron-list>
  `
})
export class PolyComponent {
  items = [
    {
      name: 'Crane',
      folds: 23
    },
    {
      name: 'Frog',
      folds: 29
    },
    {
      name: 'Flower',
      folds: 18
    }
  ];
}
```

This component shows a list of items. Data binding must be done using Polymer since [Angular has no power in Polymer templates](polymer-templates.md). What if we want to use this template elsewhere in our app? We would need to re-define it, styles, and logic associated.

It makes more sense to use an element.

```html
<iron-list [items]="items" as="item">
  <template ngNonBindable>
    <app-item item="[[item]]"></app-item>
  </template>
</iron-list>
```

Since we cannot use Angular components inside Polymer templates, we need to use a web component. Where do we define this component?

## Element Definition

Origami's build process includes two locations in your app root that Polymer Webpack loader will use to recognize Polymer element HTML: `bower_components/` and `elements/`. Any non-Bower Polymer element should be included in the `elements/` folder.

src/elements/app-item.html
```html
<link href="../bower_components/polymer/polymer.html" rel="import">

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

Note the use of `<link>` to import other elements relative to the `elements/` directory.

After declaring our element, the next step is to import it into our component.

src/app.component.ts
```ts
import { Component } from '@angular/core';

import 'iron-list/iron-list.html'; // Import from Bower, no relative path

import './elements/app-item.html'; // Relative import to a file in the project, requires a "./"

@Component({
  selector: 'app-root',
  template: `
    <iron-list [items]="items" as="item">
      <template ngNonBindable>
        <app-item item="[[item]]"></app-item>
      </template>
    </iron-list>
  `
})
export class AppComponent { 
  items = [{
    name: 'Crane',
    folds: 22
  }, {
    name: 'Frog',
    folds: 30
  }];
}
```

Remember to import element definitions relatively. Otherwise, `import 'elements/app-item.html'` would look for a file in `bower_components/elements/app-item.html`;
