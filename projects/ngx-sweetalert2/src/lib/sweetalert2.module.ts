import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { dismissOnDestroyToken, swalProviderToken } from './di';
import { SwalPortalComponent } from './swal-portal.component';
import { SwalPortalDirective } from './swal-portal.directive';
import { SwalComponent } from './swal.component';
import { SwalDirective } from './swal.directive';
import { SwalProvider, SweetAlert2LoaderService } from './sweetalert2-loader.service';

export interface Sweetalert2ModuleConfig {
    provideSwal?: SwalProvider;
    dismissOnDestroy?: boolean;
}

export function provideDefaultSwal() {
    return import('sweetalert2');
}

@NgModule({
    declarations: [
        SwalDirective, SwalComponent, SwalPortalDirective, SwalPortalComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        SwalComponent, SwalPortalDirective, SwalDirective
    ],
    entryComponents: [
        SwalComponent, SwalPortalComponent
    ]
})
export class SweetAlert2Module {
    public static forRoot(options: Sweetalert2ModuleConfig = {}): ModuleWithProviders {
        const { provideSwal = provideDefaultSwal, dismissOnDestroy = true } = options;

        return {
            ngModule: SweetAlert2Module,
            providers: [
                SweetAlert2LoaderService,
                { provide: swalProviderToken, useValue: provideSwal },
                { provide: dismissOnDestroyToken, useValue: dismissOnDestroy }
            ]
        };
    }

    public static forChild(options: Sweetalert2ModuleConfig = {}): ModuleWithProviders {
        const { provideSwal, dismissOnDestroy } = options;

        return {
            ngModule: SweetAlert2Module,
            providers: [
                ...options.provideSwal ? [
                    SweetAlert2LoaderService,
                    { provide: swalProviderToken, useValue: provideSwal }
                ] : [],
                ...options.dismissOnDestroy !== undefined ? [
                    { provide: dismissOnDestroyToken, useValue: dismissOnDestroy }
                ] : []
            ]
        };
    }
}
