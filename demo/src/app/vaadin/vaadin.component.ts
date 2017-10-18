import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import 'paper-checkbox/paper-checkbox.html';
import 'paper-item/paper-icon-item.html';
import 'paper-item/paper-item.html';
import 'paper-listbox/paper-listbox.html';
import 'vaadin-combo-box/vaadin-combo-box.html';
import 'vaadin-context-menu/vaadin-context-menu.html';
import 'vaadin-date-picker/vaadin-date-picker.html';
import 'vaadin-grid/vaadin-grid-selection-column.html';
import 'vaadin-grid/vaadin-grid-sorter.html';
import 'vaadin-grid/vaadin-grid.html';
import 'vaadin-split-layout/vaadin-split-layout.html';

@Component({
  selector: 'app-vaadin',
  templateUrl: 'vaadin.component.html',
  styleUrls: ['./vaadin.component.css']
})
export class VaadinComponent {
  items: Observable<any>;
  comboSelected: string;
  date: string;
  gridSelectAll: boolean = false;

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
