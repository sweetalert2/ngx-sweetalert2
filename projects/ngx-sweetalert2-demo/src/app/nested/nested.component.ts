import { Component } from '@angular/core';
import { SwalDirective } from '@sweetalert2/ngx-sweetalert2';

@Component({
    selector: 'demo-nested',
    templateUrl: './nested.component.html',
    standalone: true,
    imports: [SwalDirective]
})
export class NestedComponent {
}
