# Importing Elements

All elements should be imported in the component that uses them. This will allow Angular and Webpack to perform optimizations when generating module chunks.

app.component.ts
```ts
import { Component } from '@angular/core';

import 'paper-button/paper-button.html';

@Component({
  selector: 'app-root',
  template: `
    <paper-button>Click me!</paper-button>
  `
})
export class AppComponent { }
```

Origami's build process uses [polymer-webpack-loader](https://github.com/webpack-contrib/polymer-webpack-loader) to convert element HTML imports into plain ES modules that Webpack can load.
