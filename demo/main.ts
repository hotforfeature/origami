import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

function bootstrap() {
  platformBrowserDynamic().bootstrapModule(AppModule);
}

if ((<any>window).webComponentsReady) {
  // Polyfills not needed
  bootstrap();
} else {
  // Wait for polyfills before bootstrapping
  window.addEventListener('WebComponentsReady', bootstrap);
}
