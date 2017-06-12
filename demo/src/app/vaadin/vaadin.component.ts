import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { PolymerChanges } from '@codebakery/origami';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-vaadin',
  templateUrl: 'vaadin.component.html',
  styleUrls: ['./vaadin.component.css']
})
export class VaadinComponent {
  items: Observable<any>;
  @PolymerChanges() date: string;
  @PolymerChanges() gridSelectAll: boolean = false;

  constructor(http: Http) {
    this.items = http.get('https://randomuser.me/api?results=100&inc=name,email,location')
      .map(response => {
        return response.json().results;
      });
  }

  contextMenuAlert(e: MouseEvent) {
    alert(`Selected element ${(<HTMLElement>e.target).dataset.id}`);
  }
}
