import { Component } from "@angular/core";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";

@Component({
    selector: "app-demo-nested",
    templateUrl: "./nested.component.html",
    imports: [SweetAlert2Module],
})
export class NestedComponent {}
