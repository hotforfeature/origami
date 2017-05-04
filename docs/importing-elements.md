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
</body>
</html>
```

`<link>`s in Angular templates will not work since Angular pre-processes those templates.

## Element Bundles

The app's `index.html` will start to get pretty crowded importing all the needed elements. Origami suggests defining an `elements.html` file to organize imports.

You can then use this single `elements.html` to [create a bundled production-ready import](production-build.md).

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
</body>
</html>
```
