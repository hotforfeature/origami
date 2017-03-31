import { Directive } from '@angular/core';

import { PolymerDirective } from '../../events/polymer.directive';

@Directive({
  selector: `app-layout, app-localize-behavior, app-pouchdb, app-route, app-storage`
})
export class AppElement extends PolymerDirective { }
