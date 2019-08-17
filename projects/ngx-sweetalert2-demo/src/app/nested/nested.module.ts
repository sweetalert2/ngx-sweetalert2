import { NgModule } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NestedRoutingModule } from './nested-routing.module';
import { NestedComponent } from './nested.component';

@NgModule({
    imports: [
        SweetAlert2Module.forChild(),
        NestedRoutingModule
    ],
    declarations: [
        NestedComponent
    ]
})
export class NestedModule {
}
