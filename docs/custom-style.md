# Custom Style

Many Polymer components use CSS variables and mixins to style themselves. Some browsers natively support CSS variables, but CSS mixins are not a standardized feature.

Polymer uses [ShadyCSS](https://github.com/webcomponents/shadycss) to polyfill both CSS variables and the proposed `@apply` mixin.

Angular consumes all `<style>` elements, so it is impossible to create a component with the following HTML markup.

```ts
import { Component } from '@angular/core';
import { PolymerChanges } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <custom-style>
      <style>
        paper-button {
          --paper-button-ink-color: var(--paper-red-500);
        }
      </style>
    </custom-style>

    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">

    <paper-button [(disabled)]="isDisabled"></paper-button>
  `
})
export class PolyComponent {
  @PolymerChanges() isDisabled: boolean;
}
```

The Angular compiler will remove the `<style>` tag and place it in the `<head>` of the document.

## CustomStyleService

Luckily there's an easy fix for this! All we need to do is wrap any `<style>` elements with `<custom-style>`.

Any Angular component that uses custom CSS variables and mixins should import `CustomStyleService` and update the `<head>` (or its own shadow root if using `ViewEncapsulation.Native`) and wrap all `<style>` elements.

```ts
import { Component, OnInit } from '@angular/core';
import { CustomStyleService, PolymerChanges } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <!-- Since CustomStyleService will wrap this for us, we do not need to include <custom-style> -->
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

`updateCustomStyles()` only needs to be called once when the component is initialized.

`CustomStyleService` will additionally work with any CSS variables and mixins used in external stylesheets, imported via `styleUrls` or declared in `styles` of the `@Component()` metadata.

## ViewEncapsulation.Native

By default, Angular will add attributes to styles to achieve an emulated view encapsulation. If using native view encapsulation (Shadow DOM), then `CustomStyleService` should be provided with a reference to the host element.

```ts
import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { CustomStyleService, PolymerChanges } from '@codebakery/origami';

@Component({
  selector: 'app-poly',
  template: `
    <style>
      paper-button {
        --paper-button-ink-color: var(--paper-red-500);
      }
    </style>

    <label>Disabled</label>
    <input type="checkbox" [(ngModel)]="isDisabled">

    <paper-button [(disabled)]="isDisabled"></paper-button>
  `,
  encapsulation: ViewEncapsulation.Native
})
export class PolyComponent implements OnInit {
  @PolymerChanges() isDisabled: boolean;

  constructor(private customStyle: CustomStyleService, private elementRef: ElementRef) { }

  ngOnInit() {
    this.customStyle.updateCustomStyles(this.elementRef);
  }
}
```
