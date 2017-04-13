import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CustomStyleService, PolymerProperty } from '../origami/origami';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  @PolymerProperty() selectedTab: number = 1;

  constructor(private customStyle: CustomStyleService) { }

  ngOnInit() {
    this.customStyle.updateCustomStyles();
  }
}
