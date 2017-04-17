# Production Build

There are two primary steps when building an Angular and Polymer application for production.

1. Compile Angular
2. Build Polymer

Origami includes a [demo app](../demo) that is built for all supported browsers and can be used as reference.

## Compile Angular

There are several ways to compile an Anglar app for production. Whatever the build process is, it's important that the `bower_components/` directory and any loose HTML files are copied from the source to the build directory.

For this guide, we will assume the application is an Angular CLI application, with `bower_components/` residing in the `assets/` folder.

```sh
ng build --prod
```

This will compile Angular for production to the `dist/` folder by default.

At this point, the app will serve correctly without any further action on ES6 browsers. However, `bower_components/` contains many unused files that will take up server space, and our app is not optimized for HTTP1 by making several import requests.

## Build Polymer

Building Polymer accomplishes a few primary goals:

- Remove unused `bower_components/` files
- Bundle HTML imports for HTTP1 effeciency
- Compile Polymer to ES5 for IE11 and Safari 9 support

We will accomplish these goals using the `polymer` CLI. Configuration options can be specified in [`polymer.json`](https://www.polymer-project.org/2.0/docs/tools/polymer-json).

### polymer.json

#### entrypoint

`polymer` takes an entrypoint HTML file where all imports reside. There are several issues when using an Angular app's `index.html` as the entrypoint, such as `polymer` loading Angular and polyfills twice.

As mentioned in [importing elements](importing-elements.md), a good strategy is to create a single separate `elements.html` file where we include our imports.

assets/elements.html
```html
<link href="bower_components/polymer/polymer.html" rel="import">
<link href="bower_components/paper-button/paper-button.html" rel="import">
<!-- You could even organize imports further into separate bundle html files -->
<link href="iron-elements.html" rel="import">
...
```

index.html
```html
<html>
<head>
  <meta charset="utf-8">
  <title>Paper Crane</title>
  <base href="/">

  <script src="assets/bower_components/webcomponentsjs/webcomponents-loader.js"></script>
  <link href="assets/elements.html" rel="import">
</head>
<body>
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

#### sources

`polymer` includes `src/**/*` files by default for its sources. This is not the desired behavior, since our `src/` directory contains Angular's TypeScript files, not the compiled app.

We need to include all `.js`, `.css`, and `.html` files in the Angular compiled directory as our sources. Remember that `elements.html` is our entrypoint, so we must tell `polymer` to include `index.html` as a source.

#### extraDependencies

If the app links to any scripts or HTML files in `index.html` that are not present in `elements.html`, they must be declared as extra dependencies. This will usually just be the `bower_components/webcomponentsjs/*.js` files.

#### builds

The last step to configuring `polymer` is specifying what build types to generate.

- For fewer imports, include a bundled build
- Optionally, include an unbundled build if the server supports HTTP2
- For IE11 and Safari 9, include a JS compiled build

The app server will need to dynamically serve the correct build to a browser depending on its capabilities.

#### Sample polymer.json

This JSON file assumes the Angular app was built to the `dist/` directory. It will generate three builds in the `build/` directory.

```json
{
  "entrypoint": "dist/assets/elements.html",
  "sources": [
    "dist/*.js",
    "dist/*.html",
    "dist/*.css"
  ],
  "extraDependencies": [
    "dist/assets/bower_components/webcomponentsjs/*.js"
  ],
  "builds": [
    {
      "name": "bundled",
      "bundle": true
    },
    {
      "name": "unbundled"
    },
    {
      "name": "es5",
      "bundle": true,
      "js": { "compile": true }
    }
  ]
}
```

This is the bare minimum configuration needed. Additional options, such as minifying HTML and CSS, can be included in each build.

Remember, only use `"js": { "compile": true }` for IE11 and Safari 9 (browsers that do not support ES6 classes). Custom Elements v1 requires that elements are ES6 classes that extend `HTMLElement`. An error will be thrown if a Custom Element v1-compliant browser attempts to load a JS compiled build.

### Cleanup

You may notice that the app's repository now has both a `dist/` and `build/` folder, and each build folder includes a `dist/` directory. With [`rimraf`](https://github.com/isaacs/rimraf) and [`cpr`](https://github.com/davglass/cpr), it is easy to include a post build script to clean up.

Look at the Origami's demo [`package.json`](../demo/package.json) `build` and `postbuild` run scripts for reference.
