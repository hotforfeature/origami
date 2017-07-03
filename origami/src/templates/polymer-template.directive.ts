// tslint:disable:no-string-literal
import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Optional,
  TemplateRef,
  VERSION,
  ViewContainerRef,
  isDevMode
} from '@angular/core';

/* istanbul ignore next */
if ('content' in document.createElement('template')) {
  // Even when this enableLegacyTemplate is false, the resulting <template> has childNodes
  // appended to it instead of its #document-fragment
  // https://github.com/angular/angular/issues/15557
  const nativeAppend = HTMLTemplateElement.prototype.appendChild;
  // tslint:disable-next-line:only-arrow-functions
  HTMLTemplateElement.prototype.appendChild = function<T extends Node>(childNode: T) {
    return this.content.appendChild(childNode);
  };
}

/* istanbul ignore next */
if (VERSION.major === '4' && VERSION.minor < '2' && isDevMode()) {
  // tslint:disable-next-line:no-console
  console.warn('Angular 4.2.0 has fixed enableLegacyTemplate. Origami strongly recommends to ' +
    'update to this version so that <template> elements work across all web components.');
}

@Directive({
  selector: 'ng-template[polymer], template[polymer]'
})
export class PolymerTemplateDirective implements OnInit {
  @Input('polymer') host: any; // tslint:disable-line:no-input-rename
  @Input() set methodHost(host: any) {
    // tslint:disable-next-line:no-console
    console.warn('<template polymer [methodHost]="host"> is deprecated. Use ' +
      '<template [polymer]="host"> instead.');
    this.host = host;
  }

  private template: HTMLTemplateElement;

  constructor(elementRef: ElementRef,
      @Optional() view: ViewContainerRef,
      @Optional() templateRef: TemplateRef<any>) {
    // enableLegacyTemplate is working since 4.2.0
    if (elementRef.nativeElement.nodeType === Node.COMMENT_NODE) {
      /* istanbul ignore next */
      if (VERSION.major >= '4' && VERSION.minor >= '2') {
        // tslint:disable-next-line:no-console
        console.warn('<ng-template polymer> is deprecated. Use <template> and ' +
          'enableLegacyTemplate: false');
      }

      const parentNode = (<HTMLElement>view.element.nativeElement).parentNode as Node;
      this.template = document.createElement('template');

      const viewRef = view.createEmbeddedView(templateRef);
      viewRef.rootNodes.forEach(rootNode => {
        parentNode.removeChild(rootNode);
        this.template.content.appendChild(rootNode);
      });

      parentNode.appendChild(this.template);

      // Detach and re-attach the parent element. This will trigger any template attaching logic
      // that a custom elements needs which Angular skipped when using <ng-template>
      const hostNode = parentNode.parentNode as Node;
      hostNode.removeChild(parentNode);
      hostNode.appendChild(parentNode);
    } else {
      // TODO: Test this with enableLegacyTemplate: false
      this.template = elementRef.nativeElement;
    }
  }

  ngOnInit() {
    if (this.host) {
      // Shim Polymer.TemplateStamp mixin. This allows event bindings in Polymer to be used, such
      // as on-click
      this.host['_addEventListenerToNode'] = (node: HTMLElement, eventName: string,
          handler: any) => {
        node.addEventListener(eventName, handler);
      };

      this.host['_removeEventListenerFromNode'] = (node: HTMLElement, eventName: string,
          handler: any) => {
        node.removeEventListener(eventName, handler);
      };

      (<any>this.template)['__dataHost'] = this.host;
    }
  }
}
