import { Component, ViewEncapsulation } from '@angular/core';
import { PolymerChanges } from '@codebakery/origami';

import 'bower_components/app-layout/app-header-layout/app-header-layout.html';
import 'bower_components/app-layout/app-header/app-header.html';
import 'bower_components/app-layout/app-toolbar/app-toolbar.html';
import 'bower_components/iron-flex-layout/iron-flex-layout-classes.html';
import 'bower_components/paper-styles/paper-styles.html';
import 'bower_components/paper-tabs/paper-tabs.html';
import 'elements/angular-polymer.html';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None // Allows app.component.css to act as root stylesheet
})
export class AppComponent {
  @PolymerChanges() selectedTab: number = 0;
  @PolymerChanges() model: string;
}
