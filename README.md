# Origami

_Origami is the art of folding paper with sharp angles to form beautiful creations._

Angular + Polymer

[![NPM Package](https://badge.fury.io/js/%40codebakery%2Forigami.svg)](https://www.npmjs.com/package/@codebakery/origami)

[![Test Status](https://saucelabs.com/browser-matrix/codebakery-origami.svg)](https://saucelabs.com/open_sauce/user/codebakery-origami)

## Summary

[Angular and custom elements are BFFs](https://custom-elements-everywhere.com/). With Polymer, there are a few gaps that Origami fills. The library is divided into several modules that can be imported individually to address these gaps.

- [Angular Form Support]('forms/README.md')
- [ShadyCSS Polyfill]('shadycss/README.md')
- [Polymer `<template>` Stamping]('templates/README.md')

To setup Origami, follow these steps:

1. [Install and import](#install) `OrigamiModule`]
2. Install [webcomponent polyfills](#polyfills)
   1. Add links to them in [`index.html`](#indexhtml)
   2. Add assets to include them in [`angular.json`](#angularjson-angular-6) or [`.angular-cli.json`](#angular-clijson-angular-5)
3. [Use it!](#usage)

## Install

> Upgrading from Origami v2? Follow [this guide](UPGRADE.md).

```sh
npm install @codebakery/origami
```

Import each module as described in the links above, or if you need all of the modules you can simply import `OrigamiModule`. Include the `CUSTOM_ELEMENTS_SCHEMA` schema to enable custom elements in Angular templates.

```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { OrigamiModule } from '@codebakery/origami';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, FormsModule, OrigamiModule],
  declarations: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Polyfills

Polyfills are needed to support browsers that do not support all webcomponent features.

```sh
npm install @webcomponents/webcomponentsjs
```

Next, add the polyfills to `index.html` and `angular.json`

### `index.html`

Add a `<script>` importing `webcomponents-loader.js`. If your app compiles to ES5, include the `<div>` container to handle importing `custom-elements-es5-adapter.js`.

```html
<html>
<head>
  <!-- ONLY include this div if your app compiles to ES5 -->
  <div id="es5-adapter">
    <script>
      if (!window.customElements) {
        // If the browser does not implement customElements, it should not load the adapter
        var container = document.querySelector('#es5-adapter');
        container.parentElement.removeChild(container);
      }
    </script>
    <!-- Allows customElements to define ES5 functions instead of ES6 classes -->
    <script src="node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
  </div>

  <!-- Required polyfill loader -->
  <script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
</head>
<body>
  <app-root></app-root>
  <!-- Angular scripts will be added here -->
</body>
</html>
```

### `angular.json` (Angular 6+)

> Skip this section and go to [`.angular-cli.json`](#angular-clijson-angular-5) if you are using Angular 5.

Add an asset glob to the architect `"build"` and `"test"` sections. The glob will vary depending on if the project is set to compile to ES6 or ES5, since ES5 needs the `custom-elements-es5-adapter.js` file. The `"input"` property of the asset must be relative to the project's `"root"`.

#### ES6

```json
{
  "projects": {
    "es6App": {
      "root": "",
      "sourceRoot": "src",
      "architect": {
        "build": {
          "options": {
            "assets": [
              "src/assets",
              {
                "glob": "{*loader.js,bundles/*.js}",
                "input": "node_modules/@webcomponents/webcomponentsjs",
                "output": "node_modules/@webcomponents/webcomponentsjs"
              }
            ]
          }
        },
        "test": {
          "options": {
            "assets": [
              "src/assets",
              {
                "glob": "{*loader.js,bundles/*.js}",
                "input": "node_modules/@webcomponents/webcomponentsjs",
                "output": "node_modules/@webcomponents/webcomponentsjs"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### ES5

```json
{
  "projects": {
    "es5App": {
      "root": "",
      "sourceRoot": "src",
      "architect": {
        "build": {
          "assets": [
            "src/assets",
            {
              "glob": "{*loader.js,*adapter.js,bundles/*.js}",
              "input": "node_modules/@webcomponents/webcomponentsjs",
              "output": "node_modules/@webcomponents/webcomponentsjs"
            }
          ]
        },
        "test": {
          "options": {
            "assets": [
              "src/assets",
              {
                "glob": "{*loader.js,*adapter.js,bundles/*.js}",
                "input": "node_modules/@webcomponents/webcomponentsjs",
                "output": "node_modules/@webcomponents/webcomponentsjs"
              }
            ]
          }
        }
      }
    }
  }
}
```

### `.angular-cli.json` (Angular 5)

> Skip this section and refer to [`angular.json`](#angularjson-angular-6) if you are using Angular 6+.

Add an asset glob to the app's `"assets"` array. The glob will vary depending on if the project is set to compile to ES6 or ES5, since ES5 needs the `custom-elements-es5-adapter.js` file. The `"input"` property of the asset must be relative to the project's `"root"`.

#### ES6

```json
{
  "apps": [
    {
      "name": "es6App",
      "root": "src",
      "assets": [
        "assets",
        {
          "glob": "{*loader.js,bundles/*.js}",
          "input": "../node_modules/@webcomponents/webcomponentsjs",
          "output": "node_modules/@webcomponents/webcomponentsjs"
        }
      ]
    }
  ]
}
```

#### ES5

```json
{
  "apps": [
    {
      "name": "es5App",
      "root": "src",
      "assets": [
        "assets",
        {
          "glob": "{*loader.js,*adapter.js,bundles/*.js}",
          "input": "../node_modules/@webcomponents/webcomponentsjs",
          "output": "node_modules/@webcomponents/webcomponentsjs"
        }
      ]
    }
  ]
}
```

## Usage

### [Angular Form Support](forms/README.md)

Add the `origami` attribute to any custom element using `[ngModel]`, `[formControl]` or `[formControlName]`.

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

### [ShadyCSS Polyfill](shadycss/README.md)

Enables the use of CSS custom properties in Angular styles.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-component',
  styles: [
    `
      :host {
        --my-color: blue;
      }

      h1 {
        color: var(--my-color);
      }
    `
  ],
  template: `
    <h1>I'm blue!</h1>
  `
})
export class AppComponent {}
```

### [Polymer `<template>` Stamping](templates/README.md)

Call `polymerHost()` and add it to the providers for a component that uses Polymer's data binding syntax in `<template>` elements. Add `ngNonBindable` to all `<template>` elements.

```ts
import { Component } from '@angular/core';
import { polymerHost } from '@codebakery/origami/templates';
import '@polymer/iron-list/iron-list';

@Component({
  selector: 'app-component',
  template: `
    <iron-list [items]="items">
      <template ngNonBindable>
        <div on-click="itemClicked">
          <div>[[getLabel(item)]]</div>
        </div>
      </template>
    </iron-list>
  `,
  providers: [polymerHost(AppComponent)]
})
export class AppComponent {
  items = [1, 2, 3];

  getLabel(item: number) {
    return `# ${item}`;
  }

  itemClicked(event: Event) {
    console.log(event);
  }
}
```
