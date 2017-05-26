// tslint:disable:no-string-literal
import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: 'ng-template[polymer], template[polymer]'
})
export class PolymerTemplateDirective implements OnInit {
  @Input() methodHost: any;

  private template: HTMLTemplateElement;

  constructor(view: ViewContainerRef, templateRef: TemplateRef<any>) {
    // TODO: Deprecate detach/attach in favor of enableLegacyTemplate: false Angular compiler
    // option. At the moment, this option doesn't seem to be working correctly
    // https://github.com/angular/angular/issues/15555
    // Even when this option is set (hardcode to false in @angular/compiler source code), the
    // resulting <template> has children appended to it instead of its #document-fragment
    // https://github.com/angular/angular/issues/15557
    const parentNode = (<HTMLElement>view.element.nativeElement).parentNode;
    this.template = document.createElement('template');

    const viewRef = view.createEmbeddedView(templateRef);
    viewRef.rootNodes.forEach(rootNode => {
      parentNode.removeChild(rootNode);
      this.template.content.appendChild(rootNode);
    });

    parentNode.appendChild(this.template);

    // Detach and re-attach the parent element. This will trigger any template attaching logic
    // that a custom elements needs which Angular skipped when using <ng-template>
    const hostNode = parentNode.parentNode;
    hostNode.removeChild(parentNode);
    hostNode.appendChild(parentNode);
  }

  ngOnInit() {
    if (this.methodHost) {
      // Shim Polymer.TemplateStamp mixin. This allows event bindings in Polymer to be used, such
      // as on-click
      this.methodHost['_addEventListenerToNode'] = (node: HTMLElement, eventName: string,
          handler: any) => {
        node.addEventListener(eventName, handler);
      };

      this.methodHost['_removeEventListenerFromNode'] = (node: HTMLElement, eventName: string,
          handler: any) => {
        node.removeEventListener(eventName, handler);
      };

      this.template['__dataHost'] = this.methodHost;
    }
  }
}
