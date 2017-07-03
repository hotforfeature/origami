import { Directive } from '@angular/core';
import { EmitChangesDirective } from '@codebakery/origami';

@Directive({
  selector: `iron-a11y-announcer, iron-a11y-keys, iron-ajax, iron-autogrow-textarea, iron-collapse,
    iron-component-page, iron-demo-helpers, iron-doc-viewer, iron-dropdown, iron-flex-layout,
    iron-icon, iron-icons, iron-iconset, iron-iconset-svg, iron-image, iron-jsonp-library,
    iron-list, iron-location, iron-media-query, iron-pages, iron-swipeable-container,
    iron-text-helpers`
})
export class IronElement extends EmitChangesDirective { }
