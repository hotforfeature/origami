# Templates

Adds support for Polymer's [data binding syntax](https://www.polymer-project.org/3.0/docs/devguide/data-binding) within `<template>` elements.

Some custom elements such as [`<iron-list>`](https://github.com/PolymerElements/iron-list) or [`<vaadin-grid>`](https://github.com/vaadin/vaadin-grid) consume `<template>` elements to define dynamic content. If the templates are based on Polymer's data binding system, a patch is required to translate the bindings to the Angular component.

## Usage

Import the `TemplateModule` in any `@NgModule` that declares components that use Polymer's data binding syntax in `<template>` elements. You can also import it once at the root module.

```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TemplateModule } from '@codebakery/origami/templates';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, TemplateModule],
  declarations: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Call `polymerHost()` and add it to the providers for a component that uses Polymer's data binding syntax in `<template>` elements.

```ts
import { Component } from '@angular/core';
import { polymerHost } from '@codebakery/origami/templates';
import '@polymer/iron-list/iron-list';

@Component({
  selector: 'app-component',
  providers: [
    // This informs Polymer `<template>` elements that AppComponent is the host
    polymerHost(AppComponent)
  ],
  template: `
    <iron-list [items]="items">
      <template ngNonBindable>
        <div>
          <!-- Instance data binding -->
          <div>[[item]]</div>
          <!-- Host one-way data binding -->
          <div>[[label]]</div>
          <!-- Host two-way data binding -->
          <paper-checkbox checked="{{isChecked}}"></paper-checkbox>
          <!-- Host computed data binding -->
          <div>[[getLabel(item)]]</div>
          <!-- Host event binding -->
          <button on-click="itemClicked">Alert</button>
        </div>
      </template>
    </iron-list>
  `
})
export class AppComponent {
  label = 'Item';
  isChecked = true;
  items = [1, 2, 3];

  getLabel(item: number) {
    return `# ${item}`;
  }

  itemClicked(event: Event) {
    console.log(event);
  }
}
```

## `ngNonBindable` Warning

Angular will interpolate `{{ }}` bindings, which are also used by Polymer for two-way data bindings. If these are used, `ngNonBindable` must be added as an attribute to the `<template>` element to prevent Angular from consuming the binding and allow it to be interpolated by Polymer.

For the best performance and safety, it is recommended to add `ngNonBindable` to _all_ Polymer `<template>` elements.
