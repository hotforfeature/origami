Error.stackTraceLimit = Infinity;

require('core-js/client/shim');
require('reflect-metadata');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

require('rxjs/Rx');

// Prevent Karma from running until Polymer loaded
__karma__.loaded = function () {};
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

const testing = require('@angular/core/testing');
const browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(
  browser.BrowserDynamicTestingModule,
  browser.platformBrowserDynamicTesting()
);

const context = require.context('../origami', true, /\.spec\.ts$/);
context.keys().map(context);

const Promise = window.Promise;
window.addEventListener('WebComponentsReady', function() {
  window.Promise = Promise;
  __karma__.start();
});
