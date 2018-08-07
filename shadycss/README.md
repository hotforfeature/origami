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
// or any element that imports
import '@polymer/polymer/lib/elements/custom-style';
```

You may then use CSS custom properties in Angular `styles` and `styleUrls`.

```ts
import { Component } from '@angular/core';
// paper-button imports custom-style, so we do not need to manually import
// the ShadyCSS polyfill
import '@polymer/paper-button/paper-button';

@Component({
  selector: 'app-component',
  styles: [
    `
      paper-button {
        --paper-button-ink-color: blue;
      }
    `
  ],
  template: `
    <paper-button>Blue Ink!</paper-button>
  `
})
export class AppComponent {}
```

## IE11 Issue

Initial CSS custom properties must be defined on an `html` selector in a `ViewEncapsulation.None` component.

## Limitations

### External Stylesheets

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

### IE11 New Properties

Properties that are defined in a Shadow DOM template (such as those provided by custom elements) will work with ShadyCSS in IE11. However, _newly_ defined properties in an Angular template must be defined with an `html` selector in a `ViewEncapsulation.None` component.

```ts
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-component',
  styles: [
    `
      html {
        /* 
        --my-color is not defined by an external element, it is our own
        CSS property. To work with ShadyCSS, it must be defined on an html 
        root selector.
      */
        --my-color: blue;
      }

      div {
        color: var(--my-color);
      }
    `
  ],
  template: `
    <div>I'm blue!</div>
  `,
  /*
    In order for the above html selector to work, the component must have 
    ViewEncapsulation.None, since Angular cannot encapsulate the root html 
    element.
  */
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {}
```

See [this issue](https://github.com/webcomponents/shadycss/issues/75) for more information.

Like the above limitation, it is recommended that all custom CSS properties an app defines should be declared in a root component that does not have view encapsulation.
