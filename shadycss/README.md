# ShadyCSS

Adds [ShadyCSS](https://github.com/webcomponents/shadycss) support to Angular styles. This allows the usage of CSS custom properties in browsers that do not support them.

## Usage

Import the `ShadyCSSModule` in any `@NgModule` you wish to use ShadyCSS with. For the best performance it is recommended to import it once at the root module.

```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ShadyCSSModule } from '@codebakery/origami/shadycss';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, ShadyCSSModule],
  declarations: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Ensure that either the CustomStyleInterface polyfill is imported, or that an element that depends on it is imported.

```ts
import '@webcomponents/shadycss/entrypoints/custom-style-interface';
// or
import '@polymer/polymer/lib/elements/custom-style';
```

You may then use CSS custom properties in Angular `styles` and `styleUrls`.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-component',
  styles: [
    `
      :host {
        --my-color: blue;
      }

      h1 {
        color: var(--my-color);
      }
    `
  ],
  template: `
    <h1>I'm blue!</h1>
  `
})
export class AppComponent {}
```

## Limitations

This module cannot provide polyfill support for external stylesheets or any styles defined in the `angular.json` or `.angular-cli.json` `"styles"` array. A recommended workaround is to use `ViewEncapsulation.None` on the app's root component and use its component styles as "global" styles.

```ts
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.component.html',
  // global.css may use CSS custom properties that will affect all children of
  // the root element.
  styleUrls: ['./global.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppRootComponent {}
```
