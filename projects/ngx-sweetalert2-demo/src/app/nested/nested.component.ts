import { Component } from "@angular/core";
import { SwalDirective } from "@sweetalert2/ngx-sweetalert2";

@Component({
    selector: "app-demo-nested",
    templateUrl: "./nested.component.html",
    imports: [SwalDirective],
})
export class NestedComponent {}
