import { ModuleWithProviders, NgModule } from '@angular/core';
import { swalProviderToken } from './config';
import { SwalComponent } from './swal.component';
import { SwalProvider, SweetAlert2LoaderService } from './sweetalert2-loader.service';

export interface Sweetalert2ModuleConfig {
    provideSwal?: SwalProvider;
}

export function provideSwal() {
    return import('sweetalert2');
}

@NgModule({
    declarations: [SwalComponent],
    imports: [],
    exports: [SwalComponent]
})
export class SweetAlert2Module {
    public static forRoot(options: Sweetalert2ModuleConfig = {}): ModuleWithProviders {
        return {
            ngModule: SweetAlert2Module,
            providers: [
                SweetAlert2LoaderService,
                {
                    provide: swalProviderToken,
                    useValue: options.provideSwal || provideSwal
                }
            ]
        };
    }

    public static forChild(options: Sweetalert2ModuleConfig = {}): ModuleWithProviders {
        return {
            ngModule: SweetAlert2Module,
            providers: [
                ...options.provideSwal ? [
                    SweetAlert2LoaderService,
                    {
                        provide: swalProviderToken,
                        useValue: options.provideSwal
                    }
                ] : []
            ]
        };
    }
}
