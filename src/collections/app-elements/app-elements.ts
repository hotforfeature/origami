import { Directive } from '@angular/core';

import { EmitChangesDirective } from '../../events/emit-changes.directive';

@Directive({
  selector: `app-box, app-drawer, app-drawer-layout, app-header, app-header-layout,
    app-scrollpos-control, app-toolbar, app-localize-behavior, app-pouchdb, app-route, app-storage`
})
export class AppElement extends EmitChangesDirective { }
