# v3 Breaking Changes

- `PolymerModule` has been renamed to `OrigamiModule` and no longer requires `.forRoot()`
- `[ironControl]` directive has been renamed to `[polymer]`
- Control validation errors are reported as `{ "validate": true }` instead of `{ "polymer": true }`, and may be configured by setting `[validationErrorsKey]`
- `<template [polymer]="this">` is no longer supported, instead add `polymerHost(AppComponent)` to the component providers
- `webcomponentsReady()` is no longer required and will no longer throw an error if a polyfill is not detected
- `getCustomElementClass()` has been removed
- `getTagName()` has been removed
- `unwrapPolymerEvent()` has been removed

Additionally, Origami has been split into several modules. `OrigamiModule` will include all of these modules by default. If an application does not need a specific module, you can import them individually.

```ts
import { OrigamiModule } from '@codebakery/origami';
// or
import { OrigamiFormsModule } from '@codebakery/origami/forms';
import { ShadyCSSModule } from '@codebakery/origami/shadycss';
import { TemplateModule } from '@codebakery/origami/templates';
```

# Upgrade Guide

## Remove `patch-cli.js` Script

Polymer 3 uses npm instead of Bower, so we no longer need the `patch-cli.js` script. Modify `package.json` and remove it from the postinstall task.

```diff
{
  "name": "app",
  "scripts": {
-    "postinstall": "node ./node_modules/@codebakery/origami/patch-cli.js",
    "start": "ng serve"
  }
}
```

Additionally, remove the extra dependencies required for the `patch-cli.js` script.

```sh
npm rm polymer-webpack-loader babel-core babel-loader babel-preset-es2015 script-loader
```

## Update Angular to v6

Follow the guide at https://update.angular.io/ to update Angular. This will include moving from `.angular-cli.json` to `angular.json`.

## Update Origami

```sh
npm install @codebakery/origami@latest
```

## Install Bower Elements from NPM

Review the project's `bower.json` file and install all dependencies from NPM.

Example `bower.json`:

```json
{
  "dependencies": {
    "webcomponentsjs": "^1.0.14",
    "polymer": "Polymer/polymer#^2.2.0",
    "app-layout": "PolymerElements/app-layout#^2.0.4",
    "paper-icon-button": "PolymerElements/paper-icon-button#^2.0.1",
    "iron-iconset-svg": "PolymerElements/iron-iconset-svg#^2.1.0",
    "paper-styles": "PolymerElements/paper-styles#^2.1.0"
  }
}
```

Example install command:

```
npm install @webcomponents/webcomponentsjs @polymer/{polymer,app-layout,paper-icon-button,iron-iconset-svg,paper-styles}
```

Finally, remove `bower.json`, `.bowerrc`, and the `bower_components` folder.

```sh
rm bower.json
rm .bowerrc
rm -rf src/bower_components/
```

### Additional HTML `src/elements/`

If you have any `.html` Polymer elements in the `src/elements/` folder, convert them to `.js` or `.ts` files at this time. [polymer-modulizer](https://github.com/Polymer/polymer-modulizer) may assist in the conversion.

## Update `angular.json` Polyfill Assets

### ES6 (es2015) Target Apps

```diff
{
  "projects": {
    "es6App": {
      "architect": {
        "build": {
          "options": {
            "assets": [
-              { "glob": "web*.js", "input": "src/bower_components/webcomponentsjs/", "output": "/bower_components/webcomponentsjs/" }
+                { "glob": "{*loader.js,bundles/*.js}", "input": "node_modules/@webcomponents/webcomponentsjs", "output": "/node_modules/@webcomponents/webcomponentsjs" }
            ]
          }
        },
        "test": {
          "options": {
            "assets": [
-              { "glob": "web*.js", "input": "src/bower_components/webcomponentsjs/", "output": "/bower_components/webcomponentsjs/" }
+                { "glob": "{*loader.js,bundles/*.js}", "input": "node_modules/@webcomponents/webcomponentsjs", "output": "/node_modules/@webcomponents/webcomponentsjs" }
            ]
          }
        }
      }
    }
  }
}
```

### ES5 Target Apps

```diff
{
  "projects": {
    "es5App": {
      "architect": {
        "build": {
          "options": {
            "assets": [
-              { "glob": "*adapter.js", "input": "src/bower_components/webcomponentsjs/", "output": "/bower_components/webcomponentsjs/" }
-              { "glob": "web*.js", "input": "src/bower_components/webcomponentsjs/", "output": "/bower_components/webcomponentsjs/" }
+                { "glob": "{*loader.js,*adapter.js,bundles/*.js}", "input": "node_modules/@webcomponents/webcomponentsjs", "output": "/node_modules/@webcomponents/webcomponentsjs" }
            ]
          }
        },
        "test": {
          "options": {
            "assets": [
-              { "glob": "*adapter.js", "input": "src/bower_components/webcomponentsjs/", "output": "/bower_components/webcomponentsjs/" }
-              { "glob": "web*.js", "input": "src/bower_components/webcomponentsjs/", "output": "/bower_components/webcomponentsjs/" }
+                { "glob": "{*loader.js,*adapter.js,bundles/*.js}", "input": "node_modules/@webcomponents/webcomponentsjs", "output": "/node_modules/@webcomponents/webcomponentsjs" }
            ]
          }
        }
      }
    }
  }
}
```

## Update `index.html` Polyfill Paths

```diff
<!-- ONLY include this div if your app compiles to ES5 -->
<div id="es5-adapter">
  <script>
    if (!window.customElements) {
      var container = document.querySelector('#es5-adapter');
      container.parentElement.removeChild(container);
    }
  </script>
-  <script src="bower_components/webcomponentsjs/custom-elements-es5-adapter.js"></script>
+  <script src="node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
</div>
-<script src="bower_components/webcomponentsjs/webcomponents-loader.js"></script>
+<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
```

## Update Bower Imports

Update all Bower `.html` imports to their new NPM package path.

Example:

```diff
-import 'paper-button/paper-button.html';
+import '@polymer/paper-button/paper-button';
```

## Origami Changes

### Remove `webcomponentsReady()` from `main.ts`

This is no longer needed thanks to [`shim-custom-elements.ts`](util/src/shim-custom-elements.ts) which Origami automatically calls.

```diff
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
-import { webcomponentsReady } from '@codebakery/origami';
import { AppModule } from './app/app.module';

-webcomponentsReady().then(() => {
  platformBrowserDynamic().bootstrapModule(AppModule);
-});
```

### Replace `PolymerModule` with `OrigamiModule`

```diff
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
-import { PolymerModule } from '@codebakery/origami';
+import { OrigamiModule } from '@codebakery/origami';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
-    PolymerModule.forRoot()
+    OrigamiModule
  ],
  declarations: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Replace `ironControl` with `origami`

```diff
-<paper-input [(ngModel)]="value" ironControl></paper-input>
+<paper-input [(ngModel)]="value" origami></paper-input>
```

### Provide `polymerHost()` and Remove `<template [polymer]="this">`

```diff
import { Component } from '@angular/core';
+import { polymerHost } from '@codebakery/origami/templates';
import '@polymer/iron-list/iron-list';

@Component({
  selector: 'app-component',
+  providers: [
+    polymerHost(AppComponent)
+  ],
  template: `
    <iron-list [items]="items">
-      <template ngNonBindable [polymer]="this">
+      <template ngNonBindable>
        <div>[[getLabel(item)]]</div>
      </template>
    </iron-list>
  `
})
export class AppComponent {
  items = [1, 2, 3];

  getLabel(item: number): string {
    return `# ${item}`;
  }
}
```
