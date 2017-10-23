import { ModuleWithProviders, NgModule } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';
import { swalDefaultsProvider } from './di';
import { SwalComponent } from './swal.component';
import { SwalDirective } from './swal.directive';

@NgModule({
    declarations: [SwalComponent, SwalDirective],
    exports: [SwalComponent, SwalDirective]
})
export class SweetAlert2Module {
    public static forRoot(defaultSwalOptions?: SweetAlertOptions): ModuleWithProviders {
        return {
            ngModule: SweetAlert2Module,
            providers: [swalDefaultsProvider(defaultSwalOptions)]
        };
    }
}
