import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import swal, { SweetAlertOptions, SweetAlertType } from 'sweetalert2';
import { SWAL_DEFAULTS } from './di';

@Component({
    selector: 'swal',
    template: ''
})
export class SwalComponent {
    @Input() public type: SweetAlertType;
    @Input() public title: string;
    @Input() public text: string;
    @Input() public html: string;
    @Input() public options: SweetAlertOptions;

    @Output() public confirm: EventEmitter<any> = new EventEmitter();
    @Output() public cancel: EventEmitter<any> = new EventEmitter();

    public constructor(@Inject(SWAL_DEFAULTS) private defaultSwalOptions: SweetAlertOptions) {}

    public show(): Promise<any> {
        const options = Object.assign({
            type: this.type,
            title: this.title,
            text: this.text,
            html: this.html,
        }, this.defaultSwalOptions, this.options);

        const promise = swal(options);

        promise.then(
            (success) => this.confirm.emit(success),
            (dismiss) => this.cancel.emit(dismiss)
        );

        return promise;
    }
}
