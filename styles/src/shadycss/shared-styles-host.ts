import { Inject, Optional, Provider } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ɵDomSharedStylesHost as DomSharedStylesHost } from '@angular/platform-browser';
import { USING_APPLY, processStylesheets } from './process-stylesheets';

// First group is incorrect escape backslash, second group is rest of mixin detection
const MIXIN_REGEX = /(?:\\)(--\w[\w-_]*:\s*{[^}]*})(;)?/g;

/**
 * A `SharedStylesHost` that extends the default `DomSharedStylesHost` and will
 * pass styles to ShadyCSS for processing. This will allow the use of custom CSS
 * properties in Angular styles on browsers that do not support them.
 */
export class ShadyCSSSharedStylesHost extends DomSharedStylesHost {
  constructor(
    @Inject(DOCUMENT) document: Document,
    @Optional()
    @Inject(USING_APPLY)
    private usingApply?: boolean
  ) {
    /* istanbul ignore next */
    super(document);
  }

  addStyles(styles: string[]) {
    /**
     * Mixins are declared as
     *
     * html {
     *   --my-mixin: {
     *     color: blue;
     *   }
     * }
     *
     * But are incorrectly interpolated by the webpack CSS loader as
     *
     * html {
     *   \--my-mixin: {
     *     color: blue;
     *   }
     * }
     *
     * This regex will fix the added backslash.
     */
    super.addStyles(styles.map(style => style.replace(MIXIN_REGEX, '$1')));
  }

  onStylesAdded(additions: Set<string>) {
    super.onStylesAdded(additions);
    processStylesheets(this.usingApply);
  }
}

/**
 * Provider that replaces the DomSharedStylesHost with ShadyCSSSharedStylesHost.
 */
export const SHADYCSS_SHARED_STYLES_HOST_PROVIDER: Provider = {
  provide: DomSharedStylesHost,
  useClass: ShadyCSSSharedStylesHost
};
