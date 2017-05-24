import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CustomStyleService, PolymerChanges } from '@codebakery/origami';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  @PolymerChanges() selectedTab: number = 1;
  @PolymerChanges() model: string;

  constructor(private customStyle: CustomStyleService) { }

  ngOnInit() {
    this.customStyle.updateCustomStyles();
  }
}
