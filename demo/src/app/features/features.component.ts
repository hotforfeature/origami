import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomStyleService, Polymer, PolymerChanges } from '@codebakery/origami';

import { Feature } from './Feature';
import { getFeatures } from './features';

@Component({
  selector: 'app-features',
  templateUrl: 'features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {
  @PolymerChanges() features;
  @ViewChild('ironList') ironListRef: ElementRef;

  private ironList: Polymer.PropertyEffects;
  private modifyAngular;
  private modifyPolymer;

  constructor(private customStyle: CustomStyleService) { }

  ngOnInit() {
    this.customStyle.updateCustomStyles();
    this.ironList = this.ironListRef.nativeElement;
    this.reset();
  }

  getIcon(feature: Feature): string {
    return feature.supported ? 'check-circle' : 'cancel';
  }

  getIconClass(feature: Feature): string {
    return feature.supported ? 'green' : 'red';
  }

  reset() {
    this.features = getFeatures();
    this.modifyAngular = 0;
    this.modifyPolymer = 0;
  }

  modifyFromAngular() {
    // If an object mutation occurs, use notifyPath() on the element to update Polymer
    this.features[0].description = `Modified from Angular ${++this.modifyAngular}`;
    this.ironList.notifyPath('items.0.description');
  }

  modifyFromPolymer() {
    // Polymer will update Angular automatically via @PolymerProperty()
    // This is the preferred way to mutate objects from Angular
    this.ironList.set('items.0.description',
      `Modified from Polymer ${++this.modifyPolymer}`);
  }

  spliceFromAngular() {
    // If an array mutation occurs, use notifySplices() on the element to update Polymer
    this.features.splice(0, 1);
    this.ironList.notifySplices('items', [
      { index: 0, removed: [], addedCount: 0, object: this.features, type: 'splice' }
    ]);
  }

  spliceFromPolymer() {
    // Polymer will update Angular automatically via @PolymerProperty()
    // This is the preferred way to mutate arrays from Angular
    this.ironList.splice('items', 0, 1);
  }
}
