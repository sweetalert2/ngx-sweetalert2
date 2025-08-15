import { Component } from "@angular/core";
import { SwalDirective } from "../../../../../projects/ngx-sweetalert2/src/public-api";

@Component({
    selector: "app-demo-nested",
    templateUrl: "./nested.component.html",
    imports: [SwalDirective],
})
export class NestedComponent {}
