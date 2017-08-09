# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.3.0"></a>
# [1.3.0](https://github.com/hotforfeature/origami/compare/v1.3.0-beta.1...v1.3.0) (2017-08-09)


### Bug Fixes

* **events:** fix emitChanges not listening to non-hybrid mixin properties ([30d300d](https://github.com/hotforfeature/origami/commit/30d300d)), closes [#50](https://github.com/hotforfeature/origami/issues/50)


### Features

* **util:** export internal utility functions for developers to use ([64e6923](https://github.com/hotforfeature/origami/commit/64e6923))



<a name="1.3.0-beta.1"></a>
# [1.3.0-beta.1](https://github.com/hotforfeature/origami/compare/v1.3.0-beta.0...v1.3.0-beta.1) (2017-07-25)

Re-release incorrect build.



<a name="1.3.0-beta.0"></a>
# [1.3.0-beta.0](https://github.com/hotforfeature/origami/compare/v1.2.3...v1.3.0-beta.0) (2017-07-24)

With this release, the SystemJS loader is now supported by Origami!

### Bug Fixes

* **templates:** check for templateInfo before listening for templateInfo changes ([46a2973](https://github.com/hotforfeature/origami/commit/46a2973))


### Features

* follow Angular package format v4.0 ([f69956d](https://github.com/hotforfeature/origami/commit/f69956d)), closes [#30](https://github.com/hotforfeature/origami/issues/30)
* **templates:** add host property binding ([71fcf4c](https://github.com/hotforfeature/origami/commit/71fcf4c))

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
  @PolymerChanges() selectAll: boolean;
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

* **collections:** add iron control to paper-textarea ([66a75da](https://github.com/hotforfeature/origami/commit/66a75da)), closes [#35](https://github.com/hotforfeature/origami/issues/35)



<a name="1.2.2"></a>
## [1.2.2](https://github.com/hotforfeature/origami/compare/v1.2.1...v1.2.2) (2017-06-13)


### Bug Fixes

* **styles:** prevent wrapping Polymer scoped styles in &lt;custom-style&gt; ([80775a6](https://github.com/hotforfeature/origami/commit/80775a6)), closes [#33](https://github.com/hotforfeature/origami/issues/33)



<a name="1.2.1"></a>
## [1.2.1](https://github.com/hotforfeature/origami/compare/v1.2.0...v1.2.1) (2017-06-09)


### Bug Fixes

* **templates:** add warning to use enableLegacyTemplate and shim to fix [angular/angular#15557](https://github.com/angular/angular/issues/15557) ([137807f](https://github.com/hotforfeature/origami/commit/137807f)), closes [#27](https://github.com/hotforfeature/origami/issues/27)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/hotforfeature/origami/compare/v1.1.2...v1.2.0) (2017-06-08)


### Features

* **styles:** automatically handle custom-styles and fix CSS mixin support ([#31](https://github.com/hotforfeature/origami/issues/31)) ([138da23](https://github.com/hotforfeature/origami/commit/138da23)), closes [#29](https://github.com/hotforfeature/origami/issues/29)

`CustomStyleService` has been deprecated in favor of `PolymerDomSharedStyles` and will be removed in 2.0.0.

A warning will be given when using `CustomStyleService.updateCustomStyles()`. Remove it and import `PolymerModule.forRoot()` in your application's root module to enable the new automatic custom style handling.



<a name="1.1.2"></a>
## [1.1.2](https://github.com/hotforfeature/origami/compare/v1.1.1...v1.1.2) (2017-05-26)


### Bug Fixes

* **templates:** shim Polymer.TemplateStamp on method host to allow Polymer event bindings ([48319bd](https://github.com/hotforfeature/origami/commit/48319bd))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/hotforfeature/origami/compare/v1.1.0...v1.1.1) (2017-05-24)


### Bug Fixes

* **events:** fix [emitChanges] not working with ES6-style Polymer elements ([009fdbd](https://github.com/hotforfeature/origami/commit/009fdbd))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/hotforfeature/origami/compare/v1.0.1...v1.1.0) (2017-05-04)


### Features

* **util:** add webcomponentsReady function to help bootstrap apps ([aa093a1](https://github.com/hotforfeature/origami/commit/aa093a1))

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

* remove bower install as postinstall action ([81a8804](https://github.com/hotforfeature/origami/commit/81a8804))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/hotforfeature/origami/compare/v0.6.0...v1.0.0) (2017-04-27)


### Bug Fixes

* **events:** fix bug where value for decorator was cached across all components ([507ac23](https://github.com/hotforfeature/origami/commit/507ac23))
* **forms:** fix ironControl not updating from selector and incorrectly marking control as dirty ([6012359](https://github.com/hotforfeature/origami/commit/6012359))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/hotforfeature/origami/compare/v0.5.0...v0.6.0) (2017-04-17)


### Code Refactoring

* **events:** rename [polymer], @PolymerProperty, and polymer-template ([7d91f89](https://github.com/hotforfeature/origami/commit/7d91f89)), closes [#7](https://github.com/hotforfeature/origami/issues/7)


### BREAKING CHANGES

* **events:** the [polymer] selector has changed to [emitChanges], and [polymer-template] selector has changed to [polymer] to better reflect their purposes. The @PolymerProperty decorator has also changed to @PolymerChanges



<a name="0.5.0"></a>
# [0.5.0](https://github.com/hotforfeature/origami/compare/v0.4.0...v0.5.0) (2017-04-13)


### Bug Fixes

* **aot:** AoT compile issue ([a5328e3](https://github.com/hotforfeature/origami/commit/a5328e3))


### Features

* **docs:** add documentation and demo for production builds ([e904a4e](https://github.com/hotforfeature/origami/commit/e904a4e)), closes [#8](https://github.com/hotforfeature/origami/issues/8)



<a name="0.4.0"></a>
# [0.4.0](https://github.com/hotforfeature/origami/compare/v0.3.0...v0.4.0) (2017-04-12)


### Features

* **events:** listen and notify Angular of object and array mutations ([95dedf3](https://github.com/hotforfeature/origami/commit/95dedf3)), closes [#9](https://github.com/hotforfeature/origami/issues/9)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/hotforfeature/origami/compare/v0.2.0...v0.3.0) (2017-04-11)


### Bug Fixes

* **collections:** missing paper-icon selectors ([05949c9](https://github.com/hotforfeature/origami/commit/05949c9))
* **collections:** missing paper-tab selector ([2f3f6a0](https://github.com/hotforfeature/origami/commit/2f3f6a0))
* **events:** remove initial polymer property event ([fa69915](https://github.com/hotforfeature/origami/commit/fa69915))


### Features

* **events:** PolymerProperty now works automatically with getters and setters ([6081552](https://github.com/hotforfeature/origami/commit/6081552)), closes [#6](https://github.com/hotforfeature/origami/issues/6)
* **templates:** add input to polymer templates to call Angular methods ([79004ec](https://github.com/hotforfeature/origami/commit/79004ec))


### BREAKING CHANGES

* **events:** This allows Angular to set intial property values, which is more natural for when the decorator is used. It does mean that undefined decorated properties may remain undefined even if their Polymer counterpart has a value. The solution is to always set an initial value in Angular for @PolymerProperty properties.
* **events:** PolymerProperty.unwrap() has been removed. Decorate setters with @PolymerProperty() instead of unwrapping the value.



<a name="0.2.0"></a>
# [0.2.0](https://github.com/hotforfeature/origami/compare/v0.1.0...v0.2.0) (2017-04-10)


### Bug Fixes

* **collections:** incorrect app-layout selectors ([525884b](https://github.com/hotforfeature/origami/commit/525884b))
* **templates:** Safari polyfilled templates not recognizing parent as element ([7c857c0](https://github.com/hotforfeature/origami/commit/7c857c0)), closes [#5](https://github.com/hotforfeature/origami/issues/5)


### Features

* **style:** add CustomStyleService to wrap Angular styles with custom-style ([b2b2bc5](https://github.com/hotforfeature/origami/commit/b2b2bc5)), closes [#2](https://github.com/hotforfeature/origami/issues/2)



<a name="0.1.0"></a>
# 0.1.0 (2017-03-31)

Initial release 🎉
