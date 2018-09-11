# polyfills

This module provides utilities to make working with Angular and the [webcomponentsjs polyfills](https://github.com/webcomponents/webcomponentsjs/) easier. The follow steps must be taken to set up webcomponent polyfills.

## Install

```sh
npm install @webcomponents/webcomponentsjs
```

Origami provides a CLI to make setting up polyfills easier. Run the following command to initialize an Angular project with polyfills.

```sh
# initialize all projects in the directory
./node_modules/.bin/origami polyfill

# or initialize projects by angular.json/.angular-cli.json name
./node_modules/.bin/origami polyfill app1 app2
```

> See [Manual Setup](#manual-setup) for a brief description of what the CLI is updating if you do not wish to use the CLI to setup polyfills.

Finally, import `WebComponentsReadyModule` into the root module of the app.

```ts
import { NgModule } from '@angular/core';
import { WebComponentsReadyModule } from '@codebakery/origami/polyfills';
import { AppComponent } from './app.component';

@NgModule({
  imports: [WebComponentsReadyModule],
  declarations: [AppComponent]
})
export class AppModule {}
```

## Wait for WebComponentsReady

Some imports (such as Polymer's `TemplateStamp` mixin) have side effects that require certain features to be immediately available. For example, `TemplateStamp` expects `HTMLTemplateElement` to be defined. These imports should be deferred until after `webcomponentsReady()` resolves.

There are many solutions to this problem, such as using Angular's built-in code splitting with lazy loaded router modules to load any modules that use these elements.

However, the easiest way is to use dynamic imports and defer importing and bootstrapping the root module of the app.

```ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { webcomponentsReady } from '@codebakery/origami/polyfills';

webcomponentsReady()
  .then(() => {
    // requires "module: "esnext" in tsconfig.json "compilerOptions" and
    // "angularCompilerOptions": {
    //   "entryModule": "app/app.module#AppModule"
    // }
    return import('./app/app.module');
  })
  .then(({ AppModule }) => {
    platformBrowserDynamic().bootstrapModule(AppModule);
  });
```

## Manual Setup

The Origami CLI will perform the following steps. Polyfills may be set up manually instead of using the CLI. Scripts must be added to `index.html` and assets added to either `angular.json` or `.angular-cli.json`.

### `index.html`

Add a `<script>` importing `webcomponents-loader.js`. If your app compiles to ES5, include the `custom-elements-es5-adapter.js` script before it.

```html
<html>
<head>
  <!-- ONLY include this if your app compiles to ES5 -->
  <script src="node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
  <!-- Required polyfill loader. It must `defer` so that Angular's polyfills load first. -->
  <script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js" defer></script>
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
