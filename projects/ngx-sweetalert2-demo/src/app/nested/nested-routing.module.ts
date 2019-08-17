import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NestedComponent } from './nested.component';

const routes: Routes = [
    {
        path: '',
        component: NestedComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NestedRoutingModule {
}
