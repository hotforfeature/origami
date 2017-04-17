# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
