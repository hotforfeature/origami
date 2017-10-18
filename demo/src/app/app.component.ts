import { Component, ViewEncapsulation } from '@angular/core';

import 'app-layout/app-header-layout/app-header-layout.html';
import 'app-layout/app-header/app-header.html';
import 'app-layout/app-toolbar/app-toolbar.html';
import 'iron-flex-layout/iron-flex-layout-classes.html';
import 'paper-styles/paper-styles.html';
import 'paper-tabs/paper-tabs.html';

import '../elements/angular-polymer.html';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None // Allows app.component.css to act as root stylesheet
})
export class AppComponent {
  selectedTab: number = 0;
  model: string;
}
