import { NgModule } from '@angular/core';
import { SwalDirective } from './src/swal.directive';

export * from './src/swal.directive';

@NgModule({
    declarations: [SwalDirective],
    exports: [SwalDirective]
})
export class SweetAlert2Module {
}
