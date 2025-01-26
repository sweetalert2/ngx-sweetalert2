import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from "@angular/core";
import { routes } from "./app.routes";
import { provideRouter, withComponentInputBinding, withRouterConfig } from "@angular/router";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withComponentInputBinding(), withRouterConfig({ paramsInheritanceStrategy: "always" })),
        importProvidersFrom(SweetAlert2Module.forRoot()),
    ],
};
