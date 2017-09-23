import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { PolymerChanges } from '@codebakery/origami';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import 'bower_components/paper-checkbox/paper-checkbox.html';
import 'bower_components/paper-item/paper-icon-item.html';
import 'bower_components/paper-item/paper-item.html';
import 'bower_components/paper-listbox/paper-listbox.html';
import 'bower_components/vaadin-combo-box/vaadin-combo-box.html';
import 'bower_components/vaadin-context-menu/vaadin-context-menu.html';
import 'bower_components/vaadin-date-picker/vaadin-date-picker.html';
import 'bower_components/vaadin-grid/vaadin-grid-selection-column.html';
import 'bower_components/vaadin-grid/vaadin-grid-sorter.html';
import 'bower_components/vaadin-grid/vaadin-grid.html';
import 'bower_components/vaadin-split-layout/vaadin-split-layout.html';

@Component({
  selector: 'app-vaadin',
  templateUrl: 'vaadin.component.html',
  styleUrls: ['./vaadin.component.css']
})
export class VaadinComponent {
  items: Observable<any>;
  @PolymerChanges() comboSelected: string;
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
