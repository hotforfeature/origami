[![NPM Package](https://badge.fury.io/js/%40codebakery%2Forigami.svg)](https://www.npmjs.com/package/@codebakery/origami)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[![Build Status](https://saucelabs.com/browser-matrix/codebakery-origami.svg)](https://saucelabs.com/open_sauce/user/codebakery-origami)

# Origami

_Origami is the art of folding paper with sharp angles to form beautiful creations._

Angular + Polymer

_Note: This Origami fork is for Polymer 3 and Angular 4+_

## Intro

Origami bridges the gap between the Angular platform and Polymer-built web components. This opens up [a huge ecosystem](https://www.webcomponents.org/) of high quality custom elements that can be used in Angular!

### "The Gap"

[Angular and custom elements are BFFs](https://custom-elements-everywhere.com/). There are only a few areas specific to Polymer that Origami can help out with.

- Angular Template/Reactive Form Support (`[(ngModel)]`)
- Native `<template>` elements
- Seamless production-ready build process

## Setup

### 1. Install Dependencies

```sh
npm i --save @codebakery/origami
npm i --save-dev babel-loader babel-core babel-preset-es2015
```

Origami needs to patch the Angular CLI to insert the loaders that we installed. Modify your `package.json` and add a postinstall script to create the patch.

package.json
```json
{
  "scripts": {
    "postinstall": "node ./node_modules/@codebakery/origami/patch-cli.js"
  }
}
```
```sh
npm run postinstall
```

### 3. Load polyfills

We're going to use a dynamic loader to only add polyfills if the browser needs them. In order to do this, Angular needs to include all the polyfill scripts at runtime as part of its assets. 

Since we'll be referencing these assets in our `index.html`, they must be part of the app's root directory. A typical Angular CLI-generated project will have a `src/` directory that is the app root.

For make this we can modify the .angular-cli.json as follow:

`.angular-cli.json`
```
{
  "apps": [
    {
      "root": "src",
      "assets": [
        "assets",
        "favicon.ico",
        { "glob": "web*.js", "input": "../node_modules/@webcomponents/webcomponentsjs", "output": "./wc_polyfills/" },
        { "glob": "custom*.js", "input": "../node_modules/@webcomponents/webcomponentsjs", "output": "./wc_polyfills/" },
        { "glob": "**/*", "input": "./wc_polyfills", "output": "./wc_polyfills/" }
      ],
      /* remaining app config */
    }
  ],
  /* remaining CLI config */
}
```


Now all polyfills dependencies are available for `.angular-cli.json` and our `index.html`.

Next, we install the webcomponents polyfill.

```sh
npm install --save @webcomponents/webcomponentsjs
```

Later, modify the `index.html` shell to include the polyfills.

`index.html`
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Origami for Polymer 3</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- This div is needed when targeting ES5. 
  It will add the adapter to browsers that support customElements, which 
  require ES6 classes -->
  <div id="ce-es5-shim">
    <script type="text/javascript">
      if (!window.customElements) {
        var ceShimContainer = document.querySelector('#ce-es5-shim');
        ceShimContainer.parentElement.removeChild(ceShimContainer);
      }
    </script>
    <script type="text/javascript" src="wc_polyfills/custom-elements-es5-adapter.js"></script>
  </div>
  <script src="wc_polyfills/webcomponents-loader.js"></script>
</head>
<body>
  <app-root>Loading...</app-root>
</body>
</html>
```

Custom elements must be defined as ES6 classes. The `custom-elements-es5-adapter.js` script will allow our transpiled elements to work in ES6-ready browsers. `webcomponents-loader.js` will check the browser's abilities and load the correct polyfill from the `wc_polyfills/` folder.

The last piece is to wait to bootstrap Angular until the polyfills are loaded. Modify your `main.ts` and wait for the polyfills.

`main.ts`
```ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { webcomponentsReady } from '@codebakery/origami';

import { AppModule } from './app/app.module';

webcomponentsReady().then(() => {
  platformBrowserDynamic().bootstrapModule(AppModule);
});
```

#### Angular 4 templates

_Note: This step no yet test because the example project was created with Angular 5, also will must work for Angular 4, if you have any trouble, please create a issue._

Angular 4 consumes native `<template>` tags, which are commonly used in web components. Add the following configuration to the app's bootstrap to prevent this.

`main.ts`
```ts
webcomponentsReady().then(() => {
  platformBrowserDynamic().bootstrapModule(AppModule, {
    enableLegacyTemplate: false // Required for Angular 4 to use native <template>s
  });
});
```

`enableLegacyTemplate: false` will prevent Angular 4 from turning native `<template>` elements into `<ng-template>`s. Bootstrap options must also be specified in your `tsconfig.json` for Ahead-of-Time compilation.

`tsconfig.app.json`
```
{
  "compilerOptions": {
    ...
  },
  "angularCompilerOptions": {
    "enableLegacyTemplate": false
  }
}
```

Angular 5+ defaults this value to `false`. You do not need to include it in your bootstrap function or `tsconfig.json`.

### 4. Import Origami

Import Origami into your topmost root `NgModule`. In any modules where you use custom elements, add `CUSTOM_ELEMENTS_SCHEMA` to the module. This prevents the Angular compiler from emitting errors on unknown element tags.

`app.module.ts`
```ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PolymerModule } from '@codebakery/origami';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, // Origami requires the Angular Forms module
    PolymerModule.forRoot() // Do not call .forRoot() when importing in child modules
  ],
  declarations: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add to every @NgModule() that uses custom elements
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 5. Import and use custom elements

Install elements! Persist them to `package.json` with the `--save` flag.

```sh
npm install --save @polymer/paper-checkbox@next
npm install --save @polymer/paper-input@next
```
_Note: The polymer components have the suffix @next, this is necesary for now beacuse Polymer is still on preview._

Next, import the element in the Angular component that you want to use it in. Add the `[ironControl]` directive to elements that use Angular form directives.

`app.component.ts`
```ts
import { Component } from '@angular/core';

import '@polymer/paper-checkbox/paper-checkbox';
import '@polymer/paper-input/paper-input';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <label>Hello from Angular</label>
      <input [(ngModel)]="value">
    </div>
    <paper-input label="Hello from Polymer" ironControl [(ngModel)]="value"></paper-input>

    <div>
      <label>Non-form two-way bindings!</label>
      <input type="checkbox" [(value)]="checked">
    </div>
    <paper-checkbox [checked]="checked" (checked-changed)="checked = $event.detail.value"></paper-checkbox>
  `
})
export class AppComponent {
  value: string;
  checked: boolean;
}
```

## Support

- Angular 4.2.0 +
- Polymer 3.0

This Origami fork does not support Polymer 1 and 2. 
If your Polymer components are based on Polymer 2 you can use polymer-modulizer (https://github.com/Polymer/polymer-modulizer) for migrate these to Polymer 3.

Check out [angular-polymer](https://github.com/platosha/angular-polymer) if you need Polymer 1 support.

### Browsers

- Chrome
- Safari 9+
- Firefox
- Edge
- Internet Explorer 11

[Polymer](https://www.polymer-project.org/2.0/docs/browsers) and [Angular](https://angular.io/guide/browser-support) support different browsers. Using Polymer means that you will lose support for IE 9 and 10 as well as Safari/iOS 7 and 8.
