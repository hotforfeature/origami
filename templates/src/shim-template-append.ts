import { webcomponentsReadyPriority } from '@codebakery/origami/util';

let shimPromise: Promise<void>;
export function shimHTMLTemplateAppend(): Promise<void> {
  if (!shimPromise) {
    const shim = () => {
      // Angular's renderer will add children to a <template> instead of to its
      // content. This shim will force any children added to a <template> to be
      // added to its content instead.
      // https://github.com/angular/angular/issues/15557
      const nativeAppend = HTMLTemplateElement.prototype.appendChild;
      HTMLTemplateElement.prototype.appendChild = function<T extends Node>(
        childNode: T
      ) {
        if (this.content) {
          return this.content.appendChild(childNode);
        } else {
          return nativeAppend.apply(this, [childNode]);
        }
      };
    };

    if (typeof HTMLTemplateElement !== 'undefined') {
      shim();
      shimPromise = Promise.resolve();
    } else {
      shimPromise = new Promise(resolve => {
        webcomponentsReadyPriority(() => {
          shim();
          resolve();
        });
      });
    }
  }

  return shimPromise;
}
