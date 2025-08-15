import { EnvironmentProviders, makeEnvironmentProviders, Provider } from "@angular/core";
import { dismissOnDestroyToken, fireOnInitToken, swalProviderToken } from "./di";
import { SwalPortalTargets } from "./swal-portal-targets.service";
import { SwalProvider, SweetAlert2LoaderService } from "./sweetalert2-loader.service";

export interface SweetAlert2Config {
    provideSwal?: SwalProvider;
    fireOnInit?: boolean;
    dismissOnDestroy?: boolean;
}

export function provideDefaultSwal() {
    return import("sweetalert2");
}

/**
 * Provides SweetAlert2 services for Angular applications using the modern provider pattern.
 * Use this instead of SweetAlert2Module.forRoot() for standalone applications.
 *
 * @param config Configuration options for SweetAlert2
 * @returns EnvironmentProviders that can be used in ApplicationConfig or bootstrapApplication
 *
 * @example
 * ```typescript
 * // In your main.ts or app.config.ts
 * import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     // other providers
 *     provideSweetAlert2(),
 *     // or with configuration
 *     provideSweetAlert2({
 *       fireOnInit: false,
 *       dismissOnDestroy: true
 *     })
 *   ]
 * };
 * ```
 */
export function provideSweetAlert2(config: SweetAlert2Config = {}): EnvironmentProviders {
    return makeEnvironmentProviders([
        SweetAlert2LoaderService,
        SwalPortalTargets,
        { provide: swalProviderToken, useValue: config.provideSwal || provideDefaultSwal },
        { provide: fireOnInitToken, useValue: config.fireOnInit || false },
        { provide: dismissOnDestroyToken, useValue: config.dismissOnDestroy || true },
    ]);
}

/**
 * Provides SweetAlert2 services for feature modules.
 * Use this in lazy-loaded modules that need different SweetAlert2 configuration.
 *
 * @param config Configuration options for SweetAlert2
 * @returns Array of providers that can be used in a feature module
 *
 * @example
 * ```typescript
 * // In a feature module or component providers
 * import { provideSweetAlert2ForFeature } from '@sweetalert2/ngx-sweetalert2';
 *
 * @Component({
 *   providers: [
 *     ...provideSweetAlert2ForFeature({
 *       dismissOnDestroy: false
 *     })
 *   ]
 * })
 * export class MyFeatureComponent {}
 * ```
 */
export function provideSweetAlert2ForFeature(config: SweetAlert2Config = {}): Provider[] {
    const providers: Provider[] = [];

    if (config.provideSwal) {
        providers.push(
            SweetAlert2LoaderService,
            { provide: swalProviderToken, useValue: config.provideSwal }
        );
    }

    if (config.fireOnInit !== undefined) {
        providers.push({ provide: fireOnInitToken, useValue: config.fireOnInit });
    }

    if (config.dismissOnDestroy !== undefined) {
        providers.push({ provide: dismissOnDestroyToken, useValue: config.dismissOnDestroy });
    }

    return providers;
}
