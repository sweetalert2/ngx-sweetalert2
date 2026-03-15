import "zone.js";
import "zone.js/testing";

import { getTestBed } from "@angular/core/testing";
import { platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any -- Ambient declaration for require
declare const require: any;

//=> First, initialize the Angular testing environment
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false },
});
