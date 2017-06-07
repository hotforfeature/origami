import { Component } from '@angular/core';
import { PolymerChanges } from '@codebakery/origami';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @PolymerChanges() selectedTab: number = 1;
  @PolymerChanges() model: string;
}
