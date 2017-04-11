import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CustomStyleService } from '../../../src/origami';

import { Feature } from './Feature';

@Component({
  selector: 'app-features',
  templateUrl: 'features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {
  features: Observable<Feature[]>;

  constructor(private customStyle: CustomStyleService) { }

  ngOnInit() {
    this.customStyle.updateCustomStyles();

    // Simulate async data retrieval
    this.features = Observable.from(<Feature[][]>[
      [
        {
          name: 'Two-Way Databinding',
          description: 'Support Angular-Polymer databinding via [( )] syntax',
          supported: true
        },
        {
          name: 'Template/Reactive Form Support',
          description: 'Polymer form elements work with ngModel and formControl directives',
          supported: true
        },
        {
          name: 'Polymer Templates',
          description: '<template> elements can be used by Polymer elements',
          supported: true
        },
        {
          name: 'Angular Components in Polymer Templates',
          description: 'Support Angular components within a Polymer <template>',
          supported: false
        },
        {
          name: 'OnPush Change Detection',
          description: 'Notify Angular of changes from Polymer when using ChangeDetection.OnPush',
          supported: true
        },
        {
          name: 'Object/Array mutation detection',
          description: 'Notify Polymer of deep changes to object and array properties from Angular',
          supported: false
        },
        {
          name: 'CSS custom property/mixin support',
          description: 'Allow custom properties and @apply mixins in CSS, SASS, and HTML',
          supported: true
        },
        {
          name: 'Ahead-of-Time Compilation',
          description: 'Fully support AoT compilation',
          supported: true
        },
        {
          name: 'Bundled Builds',
          description: 'Generate bundled and unbundled builds for HTTP1/HTTP2 support',
          supported: false
        },
        {
          name: 'ES5 Compilation',
          description: 'Compile Polymer components to ES5 to support IE11 and Safari 9',
          supported: false
        }
      ]
    ]);
  }

  getIcon(feature: Feature): string {
    return feature.supported ? 'check-circle' : 'cancel';
  }

  getIconClass(feature: Feature): string {
    return feature.supported ? 'green' : 'red';
  }
}
