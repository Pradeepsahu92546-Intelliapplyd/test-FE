// Hint: run `ng test --code-coverage` (not --coverage). Also ensure karma-coverage is installed (npm i -D karma-coverage)
// Hint: to generate coverage with Angular CLI use `ng test --code-coverage`.
// If your project uses Jest/Vitest or a non-Karma builder, use their coverage flags instead.
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
