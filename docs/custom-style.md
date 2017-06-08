# Custom Style

Many Polymer components use CSS variables and mixins to style themselves. Some browsers natively support CSS variables, but CSS mixins are not a standardized feature.

Polymer uses [ShadyCSS](https://github.com/webcomponents/shadycss) to polyfill both CSS variables and the proposed `@apply` mixin. To support the polyfill, Polymer provides the `<custom-style>` element. However, Angular consumes all `<style>` elements, making it impossible to write the following markup.

```html
<!-- THIS WILL NOT WORK -->
<custom-style>
  <style> <!-- Angular will strip this <style> and leave an empty <custom-style> -->
    paper-button {
      --paper-button-ink-color: var(--paper-red-500);
    }
  </style>
</custom-style>
```

## PolymerDomSharedStylesHost

To bypass this, Origami provides a custom `DomSharedStylesHost` that will automatically wrap styles in `<custom-style>` elements. To provide this class, make sure to import `PolymerModule.forRoot()` at your app's highest module.

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

Now, Origami will automatically wrap any `<style>`, including emulated and native encapsulation styles, with `<custom-style>`. Make sure that the `bower_components/polymer/polymer.html` element is imported. It will automatically import `bower_components/shadycss/apply-shim.html` to enable CSS mixins.

```ts
import { Component, OnInit } from '@angular/core';
import { CustomStyleService, PolymerChanges } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <!-- PolymerDomSharedStylesHost will wrap this in <custom-style> -->
    <style>
      paper-button {
        --paper-button-ink-color: var(--paper-red-500);
      }
    </style>

    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">

    <paper-button [(disabled)]="isDisabled"></paper-button>
  `
})
export class PolyComponent implements OnInit {
  @PolymerChanges() isDisabled: boolean;

  constructor(private customStyle: CustomStyleService) { }

  ngOnInit() {
    this.customStyle.updateCustomStyles();
  }
}
```

## Limitations

ShadyCSS does not support [stylesheet links](https://github.com/webcomponents/shadycss/issues/97). If you import an external stylesheet that contains CSS mixins, they will not work at all. If the stylesheet contains CSS custom properties, they will only work on browsers that support them.

Angular CLI projects generate one external stylesheet in `src/styles.css`, and additional stylesheets can be defined in `.angular-cli.json` under `apps.styles`. Avoid using these stylesheets for CSS custom properties and mixins.
