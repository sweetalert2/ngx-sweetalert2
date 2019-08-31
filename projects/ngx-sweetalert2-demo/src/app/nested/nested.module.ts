import { NgModule } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NestedRoutingModule } from './nested-routing.module';
import { NestedComponent } from './nested.component';

export function provideSwal() {
    return import('sweetalert2').then(({ default: swal }) => swal.mixin({
        backdrop: false
    }));
}

@NgModule({
    imports: [
        SweetAlert2Module.forChild({ provideSwal }),
        NestedRoutingModule
    ],
    declarations: [
        NestedComponent
    ]
})
export class NestedModule {
}
