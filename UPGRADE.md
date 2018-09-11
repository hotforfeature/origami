# v3 Breaking Changes

- Dropped Angular 4 support
- Dropped Polymer 2 support
- `PolymerModule` has been renamed to `OrigamiModule` and no longer requires `.forRoot()`
- `[ironControl]` directive has been renamed to `[origami]`
- Control validation errors are reported as `{ "validate": true }` instead of `{ "polymer": true }`, and may be configured by setting `[validationErrorsKey]`
- `<template [polymer]="this">` is no longer supported, instead add `polymerHost(AppComponent)` to the component providers
- `webcomponentsReady()` has been moved to `@codebakery/origami/polyfills` and will no longer throw an error if the polyfill is not detected
- `getCustomElementClass()` has been removed
- `getTagName()` has been removed
- `unwrapPolymerEvent()` has been removed

Additionally, Origami has been split into several modules. `OrigamiModule` will include all of these modules by default. If an application does not need a specific module, you can import them individually.

```ts
import { OrigamiModule } from '@codebakery/origami';
// or
import { OrigamiFormsModule } from '@codebakery/origami/forms';
import {
  IncludeStylesModule,
  ShadyCSSModule
} from '@codebakery/origami/styles';
import { TemplateModule } from '@codebakery/origami/templates';
import { WebComponentsReadyModule } from '@codebakery/origami/polyfills';
```

# Upgrade Guide

## Remove `patch-cli.js` Script

Polymer 3 uses NPM instead of Bower, so we no longer need the `patch-cli.js` script. Modify `package.json` and remove it from the postinstall task.

```diff
{
  "name": "app",
  "scripts": {
-    "postinstall": "node ./node_modules/@codebakery/origami/patch-cli.js",
    "start": "ng serve"
  }
}
```

Additionally, remove the extra dependencies that were required for the `patch-cli.js` script.

```sh
npm rm polymer-webpack-loader babel-core babel-loader babel-preset-es2015 script-loader
```

Finally, re-install `@angular-devkit/build-angular` (Angular 6) or `@angular/cli` (Angular 5) to remove the changes applied by `patch-cli.js`.

```sh
rm -rf node_modules/@angular-devkit/build-angular
# or
rm -rf node_modules/@angular/cli

npm install
```

## (Optional) Update Angular

If you plan on updating Angular, do so at this time and follow the guide at https://update.angular.io/. This may include moving from `.angular-cli.json` to `angular.json`.

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
npm install @polymer/{polymer,app-layout,paper-icon-button,iron-iconset-svg,paper-styles}
```

Finally, remove `bower.json`, `.bowerrc`, and the `bower_components/` folder.

```sh
rm bower.json
rm .bowerrc
rm -rf src/bower_components/
```

### Additional HTML `src/elements/`

If you have any `.html` Polymer elements in the `src/elements/` folder, convert them to `.js` or `.ts` files at this time. [polymer-modulizer](https://github.com/Polymer/polymer-modulizer) may assist in the conversion.

## Add prepare dependencies script (ES5 only)

If an app is targeting ES5, add a script to `package.json` before `ng serve` and `ng build` tasks to prepare dependencies for ES5 or ES2015 targets. This section may be skipped if an app does not target ES5.

`origami prepare es5 <globs...>` must be added before serve and build commands targeting ES5.

`origami prepare es2015 <globs...>` must be added before serve and build commands targeting ES6 (ES2015).

Change the glob, or add additional globs, to target all webcomponent npm folders.

```diff
{
  "scripts": {
+    "prepare:es5": "origami prepare es5 node_modules/{@polymer/*,@webcomponents/shadycss}",
-    "start": "ng serve",
-    "build": "ng build --prod"
+    "start": "npm run prepare:es5 && ng serve",
+    "build": "npm run prepare:es5 && ng build --prod"
  }
}
```

## Update Polyfill Paths

Run the following command to update `index.html` and `angular.json` or `.angular-cli.json` with the new webcomponent polyfill script paths.

```sh
./node_modules/.bin/origami polyfill
```

## Update Bower Imports

Update all Bower `.html` imports to their new NPM package path.

Example:

```diff
-import 'paper-button/paper-button.html';
+import '@polymer/paper-button/paper-button';
```

## Origami Changes

### Update `webcomponentsReady()` import

```diff
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
-import { webcomponentsReady } from '@codebakery/origami';
+import { webcomponentsReady } from '@codebakery/origami/polyfills';

webcomponentsReady().then(() => {
  // requires "module: "esnext" in tsconfig.json "compilerOptions" and
  // "angularCompilerOptions": {
  //   "entryModule": "app/app.module#AppModule"
  // }
  return import('./app/app.module');
}).then(({ AppModule }) => {
  platformBrowserDynamic().bootstrapModule(AppModule);
});
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
