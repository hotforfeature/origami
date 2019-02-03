# Origami

_Origami is the art of folding paper with angles to form beautiful creations._

Angular + Polymer

[![NPM Package](https://badge.fury.io/js/%40codebakery%2Forigami.svg)](https://www.npmjs.com/package/@codebakery/origami)

[![Test Status](https://saucelabs.com/browser-matrix/codebakery-origami.svg)](https://saucelabs.com/open_sauce/user/codebakery-origami)

## Summary

[Angular and custom elements are BFFs](https://custom-elements-everywhere.com/). With Polymer, there are a few gaps that Origami fills. The library is divided into several modules that can be imported individually to address these gaps.

- [Angular Form Support](forms/README.md)
- [ShadyCSS Support](styles/README.md#shadycss)
- [Style Modules](styles/README.md#style-modules)
- [Polymer `<template>` Stamping](templates/README.md)
- [Polyfill Utilities](polyfills/README.md)

To setup Origami, follow these steps:

1. [Install and import](#install) `OrigamiModule`
2. Set up [polyfills](#polyfills)
3. [Prepare dependencies](#prepare-dependencies-es5-only) if targeting ES5
4. Read the [Usage Summary](#usage-summary)

## Install

> Upgrading from Origami v2? Follow [this guide](UPGRADE.md).

```sh
npm install @codebakery/origami
```

Import each module as described in the links above, or if you need all of the modules you can simply import `OrigamiModule`. Include `CUSTOM_ELEMENTS_SCHEMA` to enable custom elements in Angular templates.

```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
// If @angular/router is not used, import modules individually
// and use IncludeStylesNoRouterModule instead of IncludeStylesModule.
import { OrigamiModule } from '@codebakery/origami';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, FormsModule, RouterModule, OrigamiModule],
  declarations: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Polyfills

[Polyfills](polyfills/README.md) are needed to support browsers that do not support all webcomponent features. To quickly set up polyfills, use the Origami CLI.

```sh
npm install @webcomponents/webcomponentsjs
./node_modules/.bin/origami polyfill
```

### Wait for WebComponentsReady

Some imports (such as Polymer's `TemplateStamp` mixin) have side effects that require certain features to be immediately available. For example, `TemplateStamp` expects `HTMLTemplateElement` to be defined. These imports should be deferred until after `webcomponentsReady()` resolves.

```ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { webcomponentsReady } from '@codebakery/origami/polyfills';

webcomponentsReady()
  .then(() => {
    // requires "module": "esnext" in tsconfig.json "compilerOptions" and
    // "angularCompilerOptions": {
    //   "entryModule": "app/app.module#AppModule"
    // }
    return import('./app/app.module');
  })
  .then(({ AppModule }) => {
    platformBrowserDynamic().bootstrapModule(AppModule);
  });
```

## Prepare Dependencies (ES5 only)

Angular will not transpile `node_modules/`, and a common pattern among webcomponents is to be distributed as ES2015 classes. Use Origami's CLI to effeciently transpile dependencies to ES5 or back to ES2015 before building.

Example:

```sh
origami prepare es5 node_modules/{@polymer/*,@vaadin/*,@webcomponents/shadycss}

# to restore to ES2015
origami prepare es2015 node_modules/{@polymer/*,@vaadin/*,@webcomponents/shadycss}

# for more info
origami --help
```

> Note that `@webcomponents/webcomponentsjs` should _not_ be transpiled. However, `@webcomponents/shadycss` _should_ be if it's used.

The CLI can also restore the previous ES2015 files for projects that compile to both targets.

It is recommended to add a script before `ng build` and `ng serve` tasks in `package.json`.

```json
{
  "scripts": {
    "prepare:es5": "origami prepare es5 node_modules/{@polymer/*,@vaadin/*,@webcomponents/shadycss}",
    "prepare:es2015": "origami prepare es2015 node_modules/{@polymer/*,@vaadin/*,@webcomponents/shadycss}",
    "start": "npm run prepare:es5 && ng serve es5App",
    "start:es2015": "npm run prepare:es2015 && ng serve es2015App",
    "build": "npm run prepare:es5 && ng build es5App --prod",
    "build:es2015": "npm run prepare:es2015 && ng build es2015App --prod"
  }
}
```

## Usage Summary

### [Angular Form Support](forms/README.md)

Add the `origami` attribute to any custom element using `[ngModel]`, `[formControl]` or `[formControlName]`.

> Requires the `@angular/forms` module.

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

### [ShadyCSS Support](styles/README.md#shadycss)

Enables the use of CSS custom properties in Angular styles on browsers that do not support them via [ShadyCSS](https://github.com/webcomponents/shadycss), with some [limitations](styles/README.md#limitations).

```ts
import { Component } from '@angular/core';
import '@polymer/paper-button/paper-button';

@Component({
  selector: 'app-component',
  styles: [
    `
      paper-button {
        --paper-button-ink-color: blue;
      }
    `
  ],
  template: `
    <paper-button>Blue Ink!</paper-button>
  `
})
export class AppComponent {}
```

### [Style Modules](styles/README.md#style-modules)

Allows for [style modules](https://www.polymer-project.org/3.0/docs/devguide/style-shadow-dom#style-modules) defined in Polymer to be injected into Angular components.

> Requires the `@angular/router` module. Use `IncludeStylesNoRouterModule` if `@angular/router` is not used.

```ts
import { Component } from '@angular/core';
import { IncludeStyles } from '@codebakery/origami/styles';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';

@IncludeStyles('iron-flex')
@Component({
  selector: 'app-component',
  styles: [':host { display: block; }'], // See Limitations
  template: `
    <div class="layout horizontal">
      <div class="flex">Column 1</div>
      <div class="flex">Column 2</div>
    </div>
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
