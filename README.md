[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Origami

_Origami is the art of folding paper with sharp angles to form beautiful creations._

Angular + Polymer

## Intro

Origami bridges gaps between the Angular framework and Polymer-built custom elements. Origami also works with _any_ v1 Custom Element that follows Polymer's event naming conventions.

[Check out the Quick Start](#quick-start) for a quick overview of how to import and use Origami.

### Features

- [Two-Way `[( )]` Databinding ✅](docs/data-binding.md)
- [Angular Template/Reactive Form Support ✅](#ocs/forms.md)
- [Polymer Templates (`<iron-list>`) ✅](docs/polymer-templates.md)
- Angular Components in Polymer Templates ❌
- [OnPush Change Detection ✅](docs/change-detection.md)
- Object/Array mutation detection ❌
- [CSS custom property/mixin support](docs/custom-style.md) ✅
- Ahead-of-Time Compilation ✅
- Bundled builds ❌
- ES5 compilation (IE11 and Safari 9 support) ❌

## Support

### Libraries

- Angular 4.0.0 +
- Polymer 2.0 +

Origami does not support Polymer 1.x or the v0 Custom Element spec. Check out [angular-polymer](https://github.com/platosha/angular-polymer) for Angular 2.x and Polymer 1.x love.

### Browsers

Polymer is built off of WebComponents, which is comprised of

- [Custom Elements](http://caniuse.com/#feat=custom-elementsv1)
- [Templates](http://caniuse.com/#feat=template)
- [HTML imports](http://caniuse.com/#feat=imports)
- [Shadow DOM](http://caniuse.com/#feat=shadowdomv1)

[Polyfills are available](https://www.webcomponents.org/polyfills) and support the following browsers:

- Chrome
- Opera
- Firefox
- Safari 7+
- Edge/IE11+

Note that at the moment, Polymer 2 does not support IE11 or Safari 9 out of the box. Code must be compiled to ES5. Origami will soon offer documentation and/or tools to ease the process.

## Installation

```
$ npm install --save @codebakery/origami
```

### Bower

Polymer and most custom elements are installed with [`bower`](https://bower.io/). Install `bower` globally and initialize the project. This will create a `bower.json` (similar to `package.json`).

```
$ npm install -g bower
$ bower init
```

Make sure bower components are installed to a directory that is included in the project's final build. For example, an Angular CLI-generated project includes `src/assets/`. Create a `.bowerrc` file to redirect bower installations to the correct folder.

```json
{
  "directory": "src/assets/bower_components"
}
```

Next install Polymer and any other custom elements.

```
$ bower install --save Polymer/polymer#2.0-preview
```

Projects should add the `bower_components/` directory to their `.gitignore` file.

### Polyfills

When targeting browsers that do not natively support WebComponents, polyfills are required. The app must wait for the `WebComponentsReady` event before bootstrapping.

Origami recommends using the `webcomponents-loader.js` polyfill. This script will check for native browser support before loading the required polyfills.

index.html
```html
<html>
<head>
  <title>Paper Crane</title>

  <!-- webcomponentsjs is included when installing Polymer -->
  <script src="assets/bower_components/webcomponentsjs/webcomponents-loader.js"></script>
</head>
<body>
  <app-root>Loading...</app-root>
  <script>
    // For browsers that support webcomponents, the loader will immediately fire the ready event
    // before Angular bootstraps. This flag will let main.ts know to continue rather than wait for
    // the event.
    window.webComponentsReady = false;
    window.addEventListener('WebComponentsReady', function() {
      window.webComponentsReady = true;
    });
  </script>
</body>
</html>
```

main.ts
```ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

function bootstrap() {
  platformBrowserDynamic().bootstrapModule(AppModule);
}

if ((<any>window).webComponentsReady) {
  // Polyfills not needed
  bootstrap();
} else {
  // Wait for polyfills before bootstrapping
  window.addEventListener('WebComponentsReady', bootstrap);
}
```

### Templates

Angular 4 consumes all `<template>` elements instead of letting Polymer use them. The app should set `enableLegacyTemplate` to false when bootstrapping to prevent this.

Angular 5+ defaults this value to false, so no additional steps are needed.

```ts
platformBrowserDynamic().bootstrapModule(AppModule, {
  enableLegacyTemplate: false
});
```

Remember to use `<ng-template>` for Angular templates, and `<template>` for Polymer templates.

#### Broken Templates

`enableLegacyTemplate` and `<template>` elements are not currently working in Angular 4.0.1. See https://github.com/angular/angular/issues/15555 and https://github.com/angular/angular/issues/15557.

Origami includes a `[polymer-template]` attribute directive to compensate. Use it on an `<ng-template>` to convert it to a Polymer `<template>` at runtime.

```html
<iron-list [items]="items">
  <!-- This is the correct way that doesn't work
  <template>
    <div>[[item]]</div>
  </template>
  -->

  <ng-template polymer-template>
    <div>[[item]]</div>
  </ng-template>
</iron-list>
```

`[polymer-template]` will be deprecated as soon as the above issues are fixed. Remember that anytime Origami's documentation mentions using a `<template>`, the app should use `<ng-template polymer-template>` instead.

## Quick Start

### Import

Import the `PolymerModule` from Origami into the app's main module and enable custom element support. That's it!

Optionally, the app can also import selectors from Origami for Polymer's collections. This is highly recommended (+10 to sanity), but is not required.


```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PolymerModule } from '@codebakery/origami';
import { IronElementsModule, PaperElementsModule } from '@codebakery/origami/lib/collections'; // Optional
// There are many collections to import, such as iron, paper, and gold elements

@NgModule({
  declarations: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FormsModule, // Required to connect elements to Angular forms
    PolymerModule,

    // Optional modules to help reduce markup complexity
    IronElementsModule,
    PaperElementsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

For non-Polymer collection elements, the app will need to use the `[polymer]` and `[ironControl]` attributes.

### Markup

Add the `[polymer]` directive to all custom elements. Optionally add `[ironControl]` to elements that should work in Angular forms.

```html
<my-custom-checkbox label="Check me out" polymer></my-custom-checkbox>

<form #ngForm="ngForm">
  <paper-input label="Name" polymer ironControl required [(ngModel)]="name"></paper-input>

  <paper-button polymer [disabled]="!ngForm.form.valid" (click)="onSubmit()">Submit</paper-button>
</form>
```

If the app imported `PaperElementsModule`, `[polymer]` and `[ironControl]` are not needed for paper elements. They are still required for elements that do not have a collections module.

```html
<my-custom-checkbox label="Check me out" polymer></my-custom-checkbox>

<form #ngForm="ngForm">
  <paper-input label="Name" required [(ngModel)]="name"></paper-input>

  <paper-button [disabled]="!ngForm.form.valid" (click)="onSubmit()">Submit</paper-button>
</form>
```
