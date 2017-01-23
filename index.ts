import { NgModule } from '@angular/core';
import { SwalComponent } from './src/swal.component';
import { SwalDirective } from './src/swal.directive';

export * from './src/swal.component';
export * from './src/swal.directive';

@NgModule({
    declarations: [SwalComponent, SwalDirective],
    exports: [SwalComponent, SwalDirective]
})
export class SweetAlert2Module {
}
