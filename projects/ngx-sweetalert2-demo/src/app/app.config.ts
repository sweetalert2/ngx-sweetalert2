import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { routes } from './app.routes';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
  ],
};
