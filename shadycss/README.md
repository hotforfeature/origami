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

## `@apply` mixins

If using the deprecated `@apply` mixin proposal, import `ShadyCSSModule.usingApply()` instead.

```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ShadyCSSModule } from '@codebakery/origami/shadycss';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, ShadyCSSModule.usingApply()],
  declarations: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Limitations

### Defining CSS Custom Properties

_Newly_ defined CSS custom properties must be defined in a root `html` or `:root` selector. It is recommended to define new properties in global CSS instead of component styles.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-component',
  styles: [
    `
      /* This does not work */
      :host {
        --my-color: blue;
      }

      div {
        color: var(--my-color);
      }
    `
  ],
  template: `
    <div>I'm not blue :(</div>
  `
})
export class AppComponent {}
```

The example `--my-color` property should be defined in a global CSS stylesheet.

```css
html {
  /* AppComponent's <div> will now be blue */
  --my-color: blue;
}
```

See [this issue](https://github.com/webcomponents/shadycss/issues/75) for more information.
