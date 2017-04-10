import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

// TODO: Deprecate this in favor of enableLegacyTemplate: false Angular compiler option.
// At the moment, this option doesn't seem to be working correctly
// https://github.com/angular/angular/issues/15555
// Even when this option is set (hardcode to false in @angular/compiler source code), the
// resulting <template> has children appended to it instead of its #document-fragment
// https://github.com/angular/angular/issues/15557

@Directive({
  selector: '[polymer-template]'
})
export class PolymerTemplateDirective {
  constructor(public view: ViewContainerRef, public templateRef: TemplateRef<any>) {
    const parentNode = (<HTMLElement>view.element.nativeElement).parentNode;
    const template = document.createElement('template');
    const viewRef = view.createEmbeddedView(templateRef);
    viewRef.rootNodes.forEach(rootNode => {
      parentNode.removeChild(rootNode);
      template.content.appendChild(rootNode);
    });

    parentNode.appendChild(template);

    // Detach and re-attach the parent element. This will trigger any template attaching logic
    // that a custom elements needs which Angular skipped when using <ng-template>
    const hostNode = parentNode.parentNode;
    const parentSibling = parentNode.nextSibling;
    hostNode.removeChild(parentNode);
    if (parentSibling) {
      hostNode.insertBefore(parentSibling, parentNode);
    } else {
      hostNode.appendChild(parentNode);
    }
  }
}
