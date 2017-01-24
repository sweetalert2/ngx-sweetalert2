import { ModuleWithProviders, NgModule } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';
import { swalDefaultsProvider } from './src/di';
import { SwalComponent } from './src/swal.component';
import { SwalDirective } from './src/swal.directive';

export * from './src/swal.component';
export * from './src/swal.directive';

@NgModule({
    declarations: [SwalComponent, SwalDirective],
    exports: [SwalComponent, SwalDirective],
    providers: [swalDefaultsProvider()]
})
export class SweetAlert2Module {
    public static forRoot(defaultSwalOptions?: SweetAlertOptions): ModuleWithProviders {
        return {
            ngModule: SweetAlert2Module,
            providers: [swalDefaultsProvider(defaultSwalOptions)]
        };
    }
}
