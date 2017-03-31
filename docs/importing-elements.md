# Importing Elements

All elements should be imported in the `index.html` file.

index.html
```html
<html>
<head>
  <meta charset="utf-8">
  <title>Paper Crane</title>
  <base href="/">

  <script src="assets/bower_components/webcomponentsjs/webcomponents-loader.js"></script>
  <!-- Import elements here -->
  <link href="assets/bower_components/paper-button/paper-button.html" rel="import">
  <link href="assets/bower_components/paper-input/paper-input.html" rel="import">
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
```

`<link>`s in Angular templates will not work since Angular pre-processes those templates.

## Vulcanize?

At the moment there is no build tool like vulcanize to concatenate all imports into a single HTML file. The app must include the `bower_components/` directory in its build.

## Element Bundles

The app's `index.html` will start to get pretty crowded importing all the needed elements. Origami suggests defining an `elements.html` file to organize imports.

src/assets/elements.html
```html
<link href="assets/bower_components/paper-button/paper-button.html" rel="import">
<link href="assets/bower_components/paper-input/paper-input.html" rel="import">
<!-- plus a million more! -->
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
```

While there is no vulcanize-like tool that works with Angular (yet!), this is likely where such a build task would start. From here, it would be easy to concatenate all imports into a single `elements-vulcanized.html` file for `index.html` to import.
