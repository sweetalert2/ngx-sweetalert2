import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import swal, { SweetAlertOptions, SweetAlertType } from 'sweetalert2';

export type SimpleSweetAlertOptions = Array<string|SweetAlertType>;

@Directive({ selector: '[swal]' })
export class SwalDirective {
    @Input() public set swal(options: SweetAlertOptions|SimpleSweetAlertOptions) {
        if (Array.isArray(options)) {
            [this.modalOptions.title, this.modalOptions.text] = options;

            if (options.length >= 3) {
                this.modalOptions.type = options[2] as SweetAlertType;
            }
        } else {
            this.modalOptions = options;
        }
    }

    @Output() public confirm: EventEmitter<any> = new EventEmitter();

    @Output() public cancel: EventEmitter<any> = new EventEmitter();

    private modalOptions: SweetAlertOptions = {};

    @HostListener('click', ['$event']) public onHostClicked(event: MouseEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();

        swal(this.modalOptions).then(
            (success) => this.confirm.emit(success),
            (dismiss) => this.cancel.emit(dismiss)
        );
    }
}
