import { ElementRef } from '@angular/core';

export function getTagName(elementRef: ElementRef): string {
  return `<${elementRef ? elementRef.nativeElement.tagName.toLowerCase() : 'unknown-element'}>`;
}
