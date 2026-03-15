import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { dismissOnDestroyToken, fireOnInitToken, swalProviderToken } from "./di";
import { SwalPortalComponent } from "./swal-portal.component";
import { SwalPortalDirective } from "./swal-portal.directive";
import { SwalPortalTargets } from "./swal-portal-targets.service";
import { SwalComponent } from "./swal.component";
import { SwalDirective } from "./swal.directive";
import { SwalProvider, SweetAlert2LoaderService } from "./sweetalert2-loader.service";

export interface Sweetalert2ModuleConfig {
    provideSwal?: SwalProvider;
    fireOnInit?: boolean;
    dismissOnDestroy?: boolean;
}

export function provideDefaultSwal() {
    return import("sweetalert2");
}

/**
 * @deprecated Use provideSweetAlert2() instead for new applications with standalone components.
 * This module is kept for backward compatibility with existing applications using NgModules.
 */
@NgModule({
    imports: [CommonModule, SwalComponent, SwalDirective, SwalPortalDirective, SwalPortalComponent],
    exports: [SwalComponent, SwalPortalDirective, SwalDirective, SwalPortalComponent],
})
export class SweetAlert2Module {
    public static forRoot(options: Sweetalert2ModuleConfig = {}): ModuleWithProviders<SweetAlert2Module> {
        return {
            ngModule: SweetAlert2Module,
            providers: [
                SweetAlert2LoaderService,
                SwalPortalTargets,
                { provide: swalProviderToken, useValue: options.provideSwal || provideDefaultSwal },
                { provide: fireOnInitToken, useValue: options.fireOnInit || false },
                { provide: dismissOnDestroyToken, useValue: options.dismissOnDestroy || true },
            ],
        };
    }

    public static forChild(options: Sweetalert2ModuleConfig = {}): ModuleWithProviders<SweetAlert2Module> {
        return {
            ngModule: SweetAlert2Module,
            providers: [
                ...(options.provideSwal
                    ? [SweetAlert2LoaderService, { provide: swalProviderToken, useValue: options.provideSwal }]
                    : []),
                ...(options.fireOnInit !== undefined
                    ? [{ provide: fireOnInitToken, useValue: options.fireOnInit }]
                    : []),
                ...(options.dismissOnDestroy !== undefined
                    ? [{ provide: dismissOnDestroyToken, useValue: options.dismissOnDestroy }]
                    : []),
            ],
        };
    }
}
