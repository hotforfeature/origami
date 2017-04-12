import { Feature } from './Feature';

export function getFeatures(): Feature[] {
  return [
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
  ];
}
