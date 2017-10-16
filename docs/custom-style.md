# CSS custom properties and @apply

Many Polymer components use CSS custom properties and mixins to style themselves. Some browsers natively support CSS custom properties, but CSS mixins are not a standardized feature.

Polymer uses [ShadyCSS](https://github.com/webcomponents/shadycss) to polyfill both CSS custom properties and the proposed `@apply` mixin. Origami will automatically register component styles with ShadyCSS. Make sure to import `PolymerModule.forRoot()` in your app's main module to enable this feature.

app.module.ts
```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PolymerModule } from '@codebakery/origami';

@NgModule({
  declarations: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FormsModule,
    PolymerModule.forRoot() // Only import .forRoot() once and at the highest level
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

app.component.ts
```ts
import { Component } from '@angular/core';

import 'iron-flex-layout/iron-flex-layout.html';
import 'paper-button/paper-button.html';
import 'paper-styles/paper-styles.html';

@Component({
  selector: 'app-component',
  template: `
    <paper-button>Big Red Button</paper-button>
    <div class="row">
      <div>Rows</div>
      <div>using</div>
      <div>flexbox!</div>
    </div>
  `,
  styles: [`
    paper-button {
      --paper-button-ink-color: var(--paper-red-500);
    }

    .row {
      @apply --layout-horizontal;
    }
  `]
})
export class AppComponent { }
```

## Limitations

ShadyCSS does not support [stylesheet links](https://github.com/webcomponents/shadycss/issues/97). If you import an external stylesheet that contains CSS mixins, they will not work at all. If the stylesheet contains CSS custom properties, they will only work on browsers that support them.

Angular CLI projects generate one external stylesheet in `src/styles.css`, and additional stylesheets can be defined in `.angular-cli.json` under `apps.styles`. Avoid using these stylesheets for CSS custom properties and mixins.
