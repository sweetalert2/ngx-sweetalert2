import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { routes } from "./app.routes";
import { provideRouter, withComponentInputBinding, withRouterConfig } from "@angular/router";
import { provideSweetAlert2 } from "../../../../projects/ngx-sweetalert2/src/public-api";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withComponentInputBinding(), withRouterConfig({ paramsInheritanceStrategy: "always" })),
        provideSweetAlert2(),
    ],
};
