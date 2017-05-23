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

We will accomplish these goals using the Polymer CLI. Configuration options can be specified in [`polymer.json`](https://www.polymer-project.org/2.0/docs/tools/polymer-json).

### polymer.json

#### `"entrypoint": "dist/index.html"`

`polymer` takes an entrypoint HTML file. This entrypoint is a small file that imports the application shell. `index.html` is the typical entrypoint for most Angular applications,.

#### `"shell": "dist/assets/elements.html"`

Unlike Polymer, Angular applications do not have a separate shell HTML file. The application shell is bootstrapped from the included JavaScript.

However, in an Angular CLI project if we just include `index.html` as our entrypoint with no shell, Polymer build struggles with finding the right directory. It is not expecting our `dist/` folder.

Luckily, there's an easy workaround that fits nicely into our structure. As mentioned in [importing elements](importing-elements.md), a good strategy is to create a single separate `elements.html` file where we include our imports.

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
</body>
</html>
```

We can use `elements.html` as our shell, and Polymer build is happy with that!

#### `"sources": ["dist/**/*", "!dist/assets/bower_components"]`

The default sources for `polymer build` is `src/**/*`. This is not the desired behavior, since our `src/` directory contains Angular's TypeScript files, not the compiled app.

We need to instruct the CLI to include all files in the ng-built `dist/` folder, except for the `bower_components/` that Angular copied.

#### `"extraDependencies": ["dist/assets/bower_components/webcomponentsjs/*.js"]`

The `sources` will include all files except for loose files in `bower_components/`. Therefore, any dynamic links to files in `bower_components/` should be added as dependencies.

`webcomponents-loader.js` will dynamically add scripts from its folder at runtime, so we need to include all the `.js` files in our build.

#### builds

The last step to configuring `polymer` is specifying what build types to generate. Only one build is needed, though it's recommended to create multiple builds and have a smart server serve a different built based on browser capabilities.

Polymer build [includes a few presets](https://www.polymer-project.org/2.0/docs/tools/polymer-cli#build).

- **es5-bundled** to support browsers without ES6 classes
- **es6-bundled** for ES6-capable browsers
- **es6-unbundled** for ES6-capable browsers and servers with HTTP2

Some build options (such as `--js-minify`) will apply to all JS files, including those already processed and built by Angular. Angular will minify JS by default, so you may want to turn that option off to speed up build times.

#### Sample polymer.json

This JSON file assumes the Angular app was built to the `dist/` directory. It will generate three builds in the `build/` directory.

```json
{
  "entrypoint": "dist/index.html",
  "shell": "dist/assets/elements.html",
  "sources": [
    "dist/**/*",
    "!dist/assets/bower_components/**/*"
  ],
  "extraDependencies": [
    "dist/assets/bower_components/webcomponentsjs/*.js"
  ],
  "builds": [
    {
      "preset": "es6-bundled",
      "js": { "minify": false }
    },
    {
      "preset": "es6-unbundled",
      "js": { "minify": false }
    },
    {
      "preset": "es5-bundled"
    }
  ]
}
```

### Cleanup

You may notice that the app's repository now has both a `dist/` and `build/` folder, and each build folder includes a `dist/` directory. With [`rimraf`](https://github.com/isaacs/rimraf) and [`cpr`](https://github.com/davglass/cpr), it is easy to include a post build script to clean up.

Look at the Origami demo [`package.json`](../demo/package.json) `build` and `postbuild` run scripts for reference.
