import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';
import { swalDefaultsProvider } from './di';
import { SwalPartialTargets } from './swal-partial-targets';
import { SwalPartialComponent } from './swal-partial.component';
import { SwalPartialDirective } from './swal-partial.directive';
import { SwalComponent } from './swal.component';
import { SwalDirective } from './swal.directive';

@NgModule({
    declarations: [
        SwalComponent, SwalPartialDirective, SwalPartialComponent,
        SwalDirective
    ],
    providers: [
        SwalPartialTargets
    ],
    imports: [
        CommonModule
    ],
    exports: [
        SwalComponent, SwalPartialDirective,
        SwalDirective
    ],
    entryComponents: [
        SwalComponent, SwalPartialComponent
    ]
})
export class SweetAlert2Module {
    public static forRoot(defaultSwalOptions?: SweetAlertOptions): ModuleWithProviders {
        return {
            ngModule: SweetAlert2Module,
            providers: [swalDefaultsProvider(defaultSwalOptions)]
        };
    }
}
