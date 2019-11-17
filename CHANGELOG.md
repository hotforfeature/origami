# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.1.2"></a>
## [3.1.2](https://github.com/hotforfeature/origami/compare/v3.1.1...v3.1.2) (2019-11-17)


### Bug Fixes

* **bin:** always compile provided paths for ES5 ([7784caa](https://github.com/hotforfeature/origami/commit/7784caa))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/hotforfeature/origami/compare/v3.1.0...v3.1.1) (2019-06-19)


### Bug Fixes

* **styles:** emulated encapsulation not working for IncludeStyles ([50e5a3c](https://github.com/hotforfeature/origami/commit/50e5a3c))
* **styles:** remove unused id from styleToEmulatedEncapsulation ([3b278cd](https://github.com/hotforfeature/origami/commit/3b278cd))
* **styles:** use polymer *stylesFromModule* to retrieve styles from dom-modules [#90](https://github.com/hotforfeature/origami/issues/90) ([f585ccd](https://github.com/hotforfeature/origami/commit/f585ccd))
* add support for Angular 8 ([b72cae9](https://github.com/hotforfeature/origami/commit/b72cae9))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/hotforfeature/origami/compare/v3.0.2...v3.1.0) (2019-02-03)


### Bug Fixes

* **styles:** document [@angular](https://github.com/angular)/router requirement with alternative IncludeStylesNoRouterModule [#87](https://github.com/hotforfeature/origami/issues/87) ([7bb2886](https://github.com/hotforfeature/origami/commit/7bb2886))


### Features

* add Angular 7 support [#88](https://github.com/hotforfeature/origami/issues/88) ([7dccff2](https://github.com/hotforfeature/origami/commit/7dccff2))



<a name="3.0.2"></a>

## [3.0.2](https://github.com/hotforfeature/origami/compare/v3.0.1...v3.0.2) (2018-09-11)

### Bug Fixes

- **bin:** error thrown when tsconfig does not have a target [#85](https://github.com/hotforfeature/origami/issues/85) ([334089b](https://github.com/hotforfeature/origami/commit/334089b))
- **bin:** read compilerOptions target from extended tsconfig.json [#85](https://github.com/hotforfeature/origami/issues/85) ([489a3bd](https://github.com/hotforfeature/origami/commit/489a3bd))

<a name="3.0.1"></a>

## [3.0.1](https://github.com/hotforfeature/origami/compare/v3.0.0...v3.0.1) (2018-09-10)

### Bug Fixes

- **styles:** AoT issue with IncludeStyles decorator ([277de3e](https://github.com/hotforfeature/origami/commit/277de3e))

<a name="3.0.0"></a>

# [3.0.0](https://github.com/hotforfeature/origami/compare/v2.0.4...v3.0.0) (2018-09-05)

This release adds support for Polymer 3 and introduces several breaking changes. Use the [upgrade guide](UPGRADE.md) to migrate from v2 to v3.

### Bug Fixes

- **bin:** output CLI error stack traces ([d60d256](https://github.com/hotforfeature/origami/commit/d60d256))
- **bin:** shadowed error_1 variable ([4e892d0](https://github.com/hotforfeature/origami/commit/4e892d0))
- **bin:** use adapter script directly, div wrapper no longer needed ([cc6dadf](https://github.com/hotforfeature/origami/commit/cc6dadf))
- **forms:** do not use validate() when element does not mutate invalid ([eed58dc](https://github.com/hotforfeature/origami/commit/eed58dc))
- **forms:** incorrect value set with vaadin-combo-box when using itemValuePath ([4f738a7](https://github.com/hotforfeature/origami/commit/4f738a7))
- **forms:** re-calculate control validity when out of sync with element ([d09533a](https://github.com/hotforfeature/origami/commit/d09533a))
- **templates:** aot decorator issue with polymerHost ([788db98](https://github.com/hotforfeature/origami/commit/788db98))
- **templates:** property bindings fail when there is no hostProps (ex: vaadin-grid) ([f9f9250](https://github.com/hotforfeature/origami/commit/f9f9250))
- **templates:** wait for template shim before initializing app ([7822368](https://github.com/hotforfeature/origami/commit/7822368))
- **util:** allow multiple calls to whenSet on same target/property ([70ab9d0](https://github.com/hotforfeature/origami/commit/70ab9d0))
- **util:** search entire prototype chain for existing descriptors when wrapping ([7428650](https://github.com/hotforfeature/origami/commit/7428650))

### Features

- add Angular 5 support ([da18ef3](https://github.com/hotforfeature/origami/commit/da18ef3))
- add CLI to transpile dependencies to ES5 ([9b5d70b](https://github.com/hotforfeature/origami/commit/9b5d70b))
- added polyfill module and updated docs ([0548b26](https://github.com/hotforfeature/origami/commit/0548b26))
- v3 rewrite with Polymer 3 support ([a43bdb0](https://github.com/hotforfeature/origami/commit/a43bdb0))
- **styles:** rename shadycss path to styles, add Polymer style module support ([96f15a2](https://github.com/hotforfeature/origami/commit/96f15a2)), closes [#70](https://github.com/hotforfeature/origami/issues/70)
- **styles:** support external stylesheets [#32](https://github.com/hotforfeature/origami/issues/32) ([13b4cad](https://github.com/hotforfeature/origami/commit/13b4cad))
- **util:** add optional synchronous callback to whenSet ([85c99d4](https://github.com/hotforfeature/origami/commit/85c99d4))

### BREAKING CHANGES

- Dropped Angular 4 support
- Dropped Polymer 2 support
- `PolymerModule` has been renamed to `OrigamiModule` and no longer requires `.forRoot()`
- `[ironControl]` directive has been renamed to `[origami]`
- Control validation errors are reported as `{ "validate": true }` instead of `{ "polymer": true }`, and may be configured by setting `[validationErrorsKey]`
- `<template [polymer]="this">` is no longer supported, instead add `polymerHost(AppComponent)` to the component providers
- `webcomponentsReady()` has been moved to `@codebakery/origami/polyfills` and will no longer throw an error if the polyfill is not detected
- `getCustomElementClass()` has been removed
- `getTagName()` has been removed
- `unwrapPolymerEvent()` has been removed

<a name="2.0.4"></a>

## [2.0.4](https://github.com/hotforfeature/origami/compare/v2.0.3...v2.0.4) (2018-07-18)

### Bug Fixes

- **patch:** update patch-cli for Angular CLI 6.x ([42c13d6](https://github.com/hotforfeature/origami/commit/42c13d6))
- support Angular 6 cli ([649290c](https://github.com/hotforfeature/origami/commit/649290c))

<a name="2.0.3"></a>

## [2.0.3](https://github.com/hotforfeature/origami/compare/v2.0.2...v2.0.3) (2018-05-18)

### Bug Fixes

- **style:** ensure CSS mixins end with semicolon ([d5c488b](https://github.com/hotforfeature/origami/commit/d5c488b))

<a name="2.0.2"></a>

## [2.0.2](https://github.com/hotforfeature/origami/compare/v2.0.1...v2.0.2) (2018-03-12)

### Bug Fixes

- **patch:** include project root, app root, and .bowerrc directories for bower components [#75](https://github.com/hotforfeature/origami/issues/75) ([f59d62f](https://github.com/hotforfeature/origami/commit/f59d62f))

<a name="2.0.1"></a>

## [2.0.1](https://github.com/hotforfeature/origami/compare/v2.0.0...v2.0.1) (2018-03-12)

Re-publish package with updated readme, no code changes.

<a name="2.0.0"></a>

# [2.0.0](https://github.com/hotforfeature/origami/compare/v2.0.0-alpha.5...v2.0.0) (2018-03-09)

Origami v2 brings a lot of exciting changes! The library features a new build system architecture using [polymer-webpack-loader](https://github.com/webpack-contrib/polymer-webpack-loader). It patches the Angular CLI to inject this loader using the `patch-cli.js` script.

Check out the README.md for more details on the new and improved build process.

### Code Refactoring

- **util:** remove getter functions for Polymer/ShadyCSS/customElements ([c479759](https://github.com/hotforfeature/origami/commit/c479759))

### BREAKING CHANGES

- The `emitChanges` directive [has been removed](https://github.com/hotforfeature/origami/issues/60). It was slow and not all that useful for two-way binding. It's much better to either use `ironControl` and `[(ngModel)]` or manually hook into the `(property-changed)` event.

Before

```html
<paper-checkbox [(checked)]="isChecked" emitChanges></paper-checkbox>
```

After

```html
<paper-checkbox
  [checked]="isChecked"
  (checked-changed)="isChecked = $event.detail.value"
></paper-checkbox>
<!-- or -->
<paper-checkbox [(ngModel)]="isChecked" ironControl></paper-checkbox>
```

- [Collections have been removed](https://github.com/hotforfeature/origami/issues/59). The `ironControl` directive will no longer be automatically applied to elements. If you want to use Angular forms (`[(ngModel)]` or `formControlName`), you will need to add the `ironControl` directive manually.

Before

```html
<paper-input [(ngModel)]="value"></paper-input>
```

After

```html
<paper-input [(ngModel)]="value" ironConrol></paper-input>
```

- **util:** The utility functions to get the Polymer/ShadyCSS/customElements properties have been removed. Instead typings are provided in the repo to access window.Polymer and window.ShadyCSS

<a name="1.3.4"></a>

## [1.3.4](https://github.com/hotforfeature/origami/compare/v2.0.0-alpha.4...v1.3.4) (2017-11-20)

<a name="1.3.3"></a>

## [1.3.3](https://github.com/hotforfeature/origami/compare/v2.0.0-alpha.3...v1.3.3) (2017-11-15)

<a name="2.0.0-alpha.5"></a>

# [2.0.0-alpha.5](https://github.com/hotforfeature/origami/compare/v2.0.0-alpha.4...v2.0.0-alpha.5) (2018-01-08)

### Bug Fixes

- **patch:** support Angular CLI 1.6 ([ec0e26d](https://github.com/hotforfeature/origami/commit/ec0e26d))

<a name="2.0.0-alpha.4"></a>

# [2.0.0-alpha.4](https://github.com/hotforfeature/origami/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2017-11-15)

This release fixes an NPM tag error.

<a name="2.0.0-alpha.3"></a>

# [2.0.0-alpha.3](https://github.com/hotforfeature/origami/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2017-11-15)

### Bug Fixes

- **forms:** guard against ngOnDestroy called before ngOnInit ([46e53f0](https://github.com/hotforfeature/origami/commit/46e53f0))
- **style:** stop adding ShadyCSS scoped styles as document-level styles (":not(.style-scope)" fix) ([d742059](https://github.com/hotforfeature/origami/commit/d742059))

<a name="2.0.0-alpha.2"></a>

# [2.0.0-alpha.2](https://github.com/hotforfeature/origami/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2017-11-03)

### Bug Fixes

- compile with Angular 5 ([2634091](https://github.com/hotforfeature/origami/commit/2634091))

<a name="2.0.0-alpha.1"></a>

# [2.0.0-alpha.1](https://github.com/hotforfeature/origami/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2017-11-03)

### Bug Fixes

- **patch:** update patch-cli for Angular CLI 1.5.0 ([34d370b](https://github.com/hotforfeature/origami/commit/34d370b))

<a name="1.3.4"></a>

## [1.3.4](https://github.com/hotforfeature/origami/compare/v1.3.3...v1.3.4) (2017-11-20)

Fix metadata version mismatch.

<a name="1.3.3"></a>

## [1.3.3](https://github.com/hotforfeature/origami/compare/v1.3.2...v1.3.3) (2017-11-15)

This release is to correct an NPM tag error.

<a name="1.3.2"></a>

## [1.3.2](https://github.com/hotforfeature/origami/compare/v1.3.1...v1.3.2) (2017-08-17)

### Bug Fixes

- **templates:** uncaught Promise error when shimming HTMLTemplateElement ([b7a6851](https://github.com/hotforfeature/origami/commit/b7a6851))

<a name="1.3.1"></a>

## [1.3.1](https://github.com/hotforfeature/origami/compare/v1.3.0...v1.3.1) (2017-08-09)

### Bug Fixes

- **collections:** add paper-toast to PaperElementsModule ([e04d8ef](https://github.com/hotforfeature/origami/commit/e04d8ef))

<a name="1.3.0"></a>

# [1.3.0](https://github.com/hotforfeature/origami/compare/v1.3.0-beta.1...v1.3.0) (2017-08-09)

### Bug Fixes

- **events:** fix emitChanges not listening to non-hybrid mixin properties ([30d300d](https://github.com/hotforfeature/origami/commit/30d300d)), closes [#50](https://github.com/hotforfeature/origami/issues/50)

### Features

- **util:** export internal utility functions for developers to use ([64e6923](https://github.com/hotforfeature/origami/commit/64e6923))

<a name="1.3.0-beta.1"></a>

# [1.3.0-beta.1](https://github.com/hotforfeature/origami/compare/v1.3.0-beta.0...v1.3.0-beta.1) (2017-07-25)

Re-release incorrect build.

<a name="1.3.0-beta.0"></a>

# [1.3.0-beta.0](https://github.com/hotforfeature/origami/compare/v1.2.3...v1.3.0-beta.0) (2017-07-24)

With this release, the SystemJS loader is now supported by Origami!

### Bug Fixes

- **templates:** check for templateInfo before listening for templateInfo changes ([46a2973](https://github.com/hotforfeature/origami/commit/46a2973))

### Features

- follow Angular package format v4.0 ([f69956d](https://github.com/hotforfeature/origami/commit/f69956d)), closes [#30](https://github.com/hotforfeature/origami/issues/30)
- **templates:** add host property binding ([71fcf4c](https://github.com/hotforfeature/origami/commit/71fcf4c))

Polymer templates now support both event and data binding.

```ts
@Component({
  selector: 'paper-grid',
  template: `
    <vaadin-grid [items]="items">
      <vaadin-grid-selection-column [(selectAll)]="selectAll">
        <template class="header" ngNonBindable [polymer]="this">
          <!-- Polymer will bind "selectAll" to the host, which is set to "this" -->
          <paper-checkbox checked="{{selectAll}}"></paper-checkbox>
        </template>
        <template ngNonBindable>
          <paper-checkbox checked="{{selected}}></paper-checkbox>
        </template>
      </vaadin-grid-selection-column>

      <vaadin-grid-column>
        <template class="header" ngNonBindable>
          <div>Number</div>
        </template>
        <template ngNonBindable>
          <!-- Normal event bindings will continue to call the Angular host method -->
          <div class="cell" on-click="onClick">[[item]]</div>
        </template>
      </vaadin-grid-column>
    </vaadin-grid>
  `
})
export class PaperGridComponent {
  @PolymerChanges()
  selectAll: boolean;
  items = [1, 2, 3];

  onClick(e) {
    alert('Clicked Number ' + e.model.item);
  }
}
```

### DEPRECATION WARNING

Origami's collection libraries should be imported from `@codebakery/origami/collections`. The old `@codebakery/origami/lib/collections` import path will continue to work but will be removed in the next major revision.

<a name="1.2.3"></a>

## [1.2.3](https://github.com/hotforfeature/origami/compare/v1.2.2...v1.2.3) (2017-06-21)

### Bug Fixes

- **collections:** add iron control to paper-textarea ([66a75da](https://github.com/hotforfeature/origami/commit/66a75da)), closes [#35](https://github.com/hotforfeature/origami/issues/35)

<a name="1.2.2"></a>

## [1.2.2](https://github.com/hotforfeature/origami/compare/v1.2.1...v1.2.2) (2017-06-13)

### Bug Fixes

- **styles:** prevent wrapping Polymer scoped styles in &lt;custom-style&gt; ([80775a6](https://github.com/hotforfeature/origami/commit/80775a6)), closes [#33](https://github.com/hotforfeature/origami/issues/33)

<a name="1.2.1"></a>

## [1.2.1](https://github.com/hotforfeature/origami/compare/v1.2.0...v1.2.1) (2017-06-09)

### Bug Fixes

- **templates:** add warning to use enableLegacyTemplate and shim to fix [angular/angular#15557](https://github.com/angular/angular/issues/15557) ([137807f](https://github.com/hotforfeature/origami/commit/137807f)), closes [#27](https://github.com/hotforfeature/origami/issues/27)

<a name="1.2.0"></a>

# [1.2.0](https://github.com/hotforfeature/origami/compare/v1.1.2...v1.2.0) (2017-06-08)

### Features

- **styles:** automatically handle custom-styles and fix CSS mixin support ([#31](https://github.com/hotforfeature/origami/issues/31)) ([138da23](https://github.com/hotforfeature/origami/commit/138da23)), closes [#29](https://github.com/hotforfeature/origami/issues/29)

`CustomStyleService` has been deprecated in favor of `PolymerDomSharedStyles` and will be removed in 2.0.0.

A warning will be given when using `CustomStyleService.updateCustomStyles()`. Remove it and import `PolymerModule.forRoot()` in your application's root module to enable the new automatic custom style handling.

<a name="1.1.2"></a>

## [1.1.2](https://github.com/hotforfeature/origami/compare/v1.1.1...v1.1.2) (2017-05-26)

### Bug Fixes

- **templates:** shim Polymer.TemplateStamp on method host to allow Polymer event bindings ([48319bd](https://github.com/hotforfeature/origami/commit/48319bd))

<a name="1.1.1"></a>

## [1.1.1](https://github.com/hotforfeature/origami/compare/v1.1.0...v1.1.1) (2017-05-24)

### Bug Fixes

- **events:** fix [emitChanges] not working with ES6-style Polymer elements ([009fdbd](https://github.com/hotforfeature/origami/commit/009fdbd))

<a name="1.1.0"></a>

# [1.1.0](https://github.com/hotforfeature/origami/compare/v1.0.1...v1.1.0) (2017-05-04)

### Features

- **util:** add webcomponentsReady function to help bootstrap apps ([aa093a1](https://github.com/hotforfeature/origami/commit/aa093a1))

webcomponentsjs 1.0.0-rc.11 added `window.WebComponents` to indicate whether or not polyfills are being loaded. To take advantage of this and reduce complexity, Origami provides `webcomponentsReady()`. Instead of adding listeners for WebComponentsReady, just bootstrap the app when the function resolves.

Before:

```ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

function bootstrap() {
  platformBrowserDynamic().bootstrapModule(AppModule);
}

if (window.webcomponentsReady) {
  bootstrap();
} else {
  window.addEventListener('WebComponentsReady', bootstrap);
}
```

After:

```ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { webcomponentsReady } from '@codebakery/origami';

webcomponentsReady().then(() => {
  platformBrowserDynamic().bootstrapModule(AppModule);
});
```

Make sure you update webcomponentsjs! Either explicitly install it, or remove `bower_components` and reinstall to get the latest version.

<a name="1.0.1"></a>

## [1.0.1](https://github.com/hotforfeature/origami/compare/v1.0.0...v1.0.1) (2017-04-28)

### Bug Fixes

- remove bower install as postinstall action ([81a8804](https://github.com/hotforfeature/origami/commit/81a8804))

<a name="1.0.0"></a>

# [1.0.0](https://github.com/hotforfeature/origami/compare/v0.6.0...v1.0.0) (2017-04-27)

### Bug Fixes

- **events:** fix bug where value for decorator was cached across all components ([507ac23](https://github.com/hotforfeature/origami/commit/507ac23))
- **forms:** fix ironControl not updating from selector and incorrectly marking control as dirty ([6012359](https://github.com/hotforfeature/origami/commit/6012359))

<a name="0.6.0"></a>

# [0.6.0](https://github.com/hotforfeature/origami/compare/v0.5.0...v0.6.0) (2017-04-17)

### Code Refactoring

- **events:** rename [polymer], @PolymerProperty, and polymer-template ([7d91f89](https://github.com/hotforfeature/origami/commit/7d91f89)), closes [#7](https://github.com/hotforfeature/origami/issues/7)

### BREAKING CHANGES

- **events:** the [polymer] selector has changed to [emitChanges], and [polymer-template] selector has changed to [polymer] to better reflect their purposes. The @PolymerProperty decorator has also changed to @PolymerChanges

<a name="0.5.0"></a>

# [0.5.0](https://github.com/hotforfeature/origami/compare/v0.4.0...v0.5.0) (2017-04-13)

### Bug Fixes

- **aot:** AoT compile issue ([a5328e3](https://github.com/hotforfeature/origami/commit/a5328e3))

### Features

- **docs:** add documentation and demo for production builds ([e904a4e](https://github.com/hotforfeature/origami/commit/e904a4e)), closes [#8](https://github.com/hotforfeature/origami/issues/8)

<a name="0.4.0"></a>

# [0.4.0](https://github.com/hotforfeature/origami/compare/v0.3.0...v0.4.0) (2017-04-12)

### Features

- **events:** listen and notify Angular of object and array mutations ([95dedf3](https://github.com/hotforfeature/origami/commit/95dedf3)), closes [#9](https://github.com/hotforfeature/origami/issues/9)

<a name="0.3.0"></a>

# [0.3.0](https://github.com/hotforfeature/origami/compare/v0.2.0...v0.3.0) (2017-04-11)

### Bug Fixes

- **collections:** missing paper-icon selectors ([05949c9](https://github.com/hotforfeature/origami/commit/05949c9))
- **collections:** missing paper-tab selector ([2f3f6a0](https://github.com/hotforfeature/origami/commit/2f3f6a0))
- **events:** remove initial polymer property event ([fa69915](https://github.com/hotforfeature/origami/commit/fa69915))

### Features

- **events:** PolymerProperty now works automatically with getters and setters ([6081552](https://github.com/hotforfeature/origami/commit/6081552)), closes [#6](https://github.com/hotforfeature/origami/issues/6)
- **templates:** add input to polymer templates to call Angular methods ([79004ec](https://github.com/hotforfeature/origami/commit/79004ec))

### BREAKING CHANGES

- **events:** This allows Angular to set intial property values, which is more natural for when the decorator is used. It does mean that undefined decorated properties may remain undefined even if their Polymer counterpart has a value. The solution is to always set an initial value in Angular for @PolymerProperty properties.
- **events:** PolymerProperty.unwrap() has been removed. Decorate setters with @PolymerProperty() instead of unwrapping the value.

<a name="0.2.0"></a>

# [0.2.0](https://github.com/hotforfeature/origami/compare/v0.1.0...v0.2.0) (2017-04-10)

### Bug Fixes

- **collections:** incorrect app-layout selectors ([525884b](https://github.com/hotforfeature/origami/commit/525884b))
- **templates:** Safari polyfilled templates not recognizing parent as element ([7c857c0](https://github.com/hotforfeature/origami/commit/7c857c0)), closes [#5](https://github.com/hotforfeature/origami/issues/5)

### Features

- **style:** add CustomStyleService to wrap Angular styles with custom-style ([b2b2bc5](https://github.com/hotforfeature/origami/commit/b2b2bc5)), closes [#2](https://github.com/hotforfeature/origami/issues/2)

<a name="0.1.0"></a>

# 0.1.0 (2017-03-31)

Initial release 🎉
