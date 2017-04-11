import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';

import { CustomStyleService, PolymerProperty } from '../../src/origami';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styles and styleUrls both work
  styleUrls: ['./app.component.css'],
  /*styles: [
    `app-toolbar {
      @apply --shadow-elevation-4dp;

      background: var(--primary-color);
      color: var(--dark-theme-text-color);
    }`
  ],*/
  // encapsulation: ViewEncapsulation.Native
})
export class AppComponent implements OnInit {
  @PolymerProperty() selectedTab: number = 1;

  constructor(private elementRef: ElementRef, private customStyle: CustomStyleService) { }

  ngOnInit() {
    // this.elementRef is only required with ViewEncapsulation.Native
    this.customStyle.updateCustomStyles(this.elementRef);
  }
}
