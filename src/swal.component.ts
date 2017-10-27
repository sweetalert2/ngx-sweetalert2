import {
    ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges
} from '@angular/core';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { SwalDefaults } from './di';
import * as events from './modal_events';

/**
 * <swal> component. See the README.md for usage.
 *
 * It contains a bunch of @Inputs that have a 1:1 mapping with SweetAlert2 options.
 * Their types are directly coming from SweetAlert2 types defintitions, meaning that NgSweetAlert2 is tightly coupled
 * to SweetAlert2, but also is type-safe.
 *
 * /!\ Some SweetAlert options aren't @Inputs but @Outputs: onBeforeOpen, onOpen, and onClose.
 *     However, preConfirm and inputValidtor are still @Inputs because there are not event handlers, there can't be
 *     multiple listeners and we need the Promise they must return.
 *
 * /!\ You can notice that the SweetAlert2 `useRejections` option is the only one that does not have an @Input().
 *     It's forced by NgSweetAlert2, by design, to allow consistent handling of `confirm` and `cancel` @Outputs, and
 *     allow cleaner code for the API consumer.
 */
@Component({
    selector: 'swal',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwalComponent implements OnChanges {
    // If Swal gets more than a hundred props, I'll write a code generator, I promise.
    // And I always resolve() my promises.
    @Input() public title: SweetAlertOptions['title'];
    @Input() public titleText: SweetAlertOptions['titleText'];
    @Input() public text: SweetAlertOptions['text'];
    @Input() public html: SweetAlertOptions['html'];
    @Input() public type: SweetAlertOptions['type'];
    @Input() public target: SweetAlertOptions['target'];
    @Input() public input: SweetAlertOptions['input'];
    @Input() public width: SweetAlertOptions['width'];
    @Input() public padding: SweetAlertOptions['padding'];
    @Input() public background: SweetAlertOptions['background'];
    @Input() public position: SweetAlertOptions['position'];
    @Input() public grow: SweetAlertOptions['grow'];
    @Input() public customClass: SweetAlertOptions['customClass'];
    @Input() public timer: SweetAlertOptions['timer'];
    @Input() public animation: SweetAlertOptions['animation'];
    @Input() public allowOutsideClick: SweetAlertOptions['allowOutsideClick'];
    @Input() public allowEscapeKey: SweetAlertOptions['allowEscapeKey'];
    @Input() public allowEnterKey: SweetAlertOptions['allowEnterKey'];
    @Input() public showConfirmButton: SweetAlertOptions['showConfirmButton'];
    @Input() public showCancelButton: SweetAlertOptions['showCancelButton'];
    @Input() public confirmButtonText: SweetAlertOptions['confirmButtonText'];
    @Input() public cancelButtonText: SweetAlertOptions['cancelButtonText'];
    @Input() public confirmButtonColor: SweetAlertOptions['confirmButtonColor'];
    @Input() public cancelButtonColor: SweetAlertOptions['cancelButtonColor'];
    @Input() public confirmButtonClass: SweetAlertOptions['confirmButtonClass'];
    @Input() public cancelButtonClass: SweetAlertOptions['cancelButtonClass'];
    @Input() public confirmButtonAriaLabel: SweetAlertOptions['confirmButtonAriaLabel'];
    @Input() public cancelButtonAriaLabel: SweetAlertOptions['cancelButtonAriaLabel'];
    @Input() public buttonsStyling: SweetAlertOptions['buttonsStyling'];
    @Input() public reverseButtons: SweetAlertOptions['reverseButtons'];
    @Input() public focusConfirm: SweetAlertOptions['focusConfirm'];
    @Input() public focusCancel: SweetAlertOptions['focusCancel'];
    @Input() public showCloseButton: SweetAlertOptions['showCloseButton'];
    @Input() public closeButtonAriaLabel: SweetAlertOptions['closeButtonAriaLabel'];
    @Input() public showLoaderOnConfirm: SweetAlertOptions['showLoaderOnConfirm'];
    @Input() public preConfirm: SweetAlertOptions['preConfirm'];
    @Input() public imageUrl: SweetAlertOptions['imageUrl'];
    @Input() public imageWidth: SweetAlertOptions['imageWidth'];
    @Input() public imageHeight: SweetAlertOptions['imageHeight'];
    @Input() public imageAlt: SweetAlertOptions['imageAlt'];
    @Input() public imageClass: SweetAlertOptions['imageClass'];
    @Input() public inputPlaceholder: SweetAlertOptions['inputPlaceholder'];
    @Input() public inputValue: SweetAlertOptions['inputValue'];
    @Input() public inputOptions: SweetAlertOptions['inputOptions'];
    @Input() public inputAutoTrim: SweetAlertOptions['inputAutoTrim'];
    @Input() public inputAttributes: SweetAlertOptions['inputAttributes'];
    @Input() public inputValidator: SweetAlertOptions['inputValidator'];
    @Input() public inputClass: SweetAlertOptions['inputClass'];
    @Input() public progressSteps: SweetAlertOptions['progressSteps'];
    @Input() public currentProgressStep: SweetAlertOptions['currentProgressStep'];
    @Input() public progressStepsDistance: SweetAlertOptions['progressStepsDistance'];

    /**
     * Emits an OnBeforeOpenEvent when the modal DOM element has been created.
     * Useful to perform DOM mutations before the modal is shown.
     */
    @Output() public readonly onBeforeOpen = new EventEmitter<events.OnBeforeOpenEvent>();

    /**
     * Emits an OnOpenEvent when the modal is shown.
     */
    @Output() public readonly onOpen = new EventEmitter<events.OnOpenEvent>();

    /**
     * Emits an OnCloseEvent when modal get closed.
     */
    @Output() public readonly onClose = new EventEmitter<events.OnCloseEvent>();

    /**
     * Emits when the user clicks "Confirm".
     * Bears a value when using "input", resolved "preConfirm", etc.
     *
     * Example:
     *     public handleConfirm(email: string): void {
     *         // ... save user email
     *     }
     */
    @Output() public readonly confirm = new EventEmitter<any>();

    /**
     * Emits when the user clicks "Cancel" (or dismisses the modal by any other way).
     * By default, it will emit a string representing the reason for which the SweetAlert has been closed, or the
     * value of a rejected "preConfirm".
     *
     * Example:
     *     public handleCancel(reason: string): void {
     *         // reason can be 'cancel', 'overlay', 'close', and 'timer'
     *         // ... do something
     *     }
     */
    @Output() public readonly cancel = new EventEmitter<any>();

    /**
     * An object of SweetAlert2 native options, useful if:
     *  - you don't want to use the @Inputs for practical/philosophical reasons ;
     *  - there are missing @Inputs because NgSweetAlert2 isn't up-to-date with SweetAlert2's latest changes.
     *
     * /!\ Be aware that the options defined in this object will override the @Inputs of the same name.
     */
    @Input() public set options(options: SweetAlertOptions) {
        Object.assign(this, options);
        Object.keys(options).forEach(this.markTouched);
    }

    public get options(): SweetAlertOptions {
        const options: SweetAlertOptions = {};

        //=> We will compute the options object based on the option keys that are known to have changed.
        // That avoids passing a gigantic object to SweetAlert2, making debugging easier and potentially avoiding
        // side effects.
        this.touchedProps.forEach(prop => {
            options[prop] = (this as { [prop: string]: any })[prop];
        });

        return options;
    }

    private readonly touchedProps = new Set<keyof SweetAlertOptions>();

    private readonly markTouched = this.touchedProps.add.bind(this.touchedProps);

    public constructor(@Inject(SwalDefaults) private readonly defaultSwalOptions: SweetAlertOptions) {
        //=> Force `this` scope of show() on this component
        //   Useful for doing things like (click)="mySwal.show()".
        this.show = this.show.bind(this);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        Object.keys(changes)
            .filter(prop => prop !== 'options')
            .forEach(this.markTouched);
    }

    /**
     * Shows the SweetAlert.
     *
     * Returns the SweetAlert2 promise for convenience and use in code behind templates.
     * Otherwise, (confirm)="myHandler($event)" and (cancel)="myHandler($event)" can be used in templates.
     */
    public async show(): Promise<any> {
        //=> Build the SweetAlert2 options
        const options: SweetAlertOptions = {
            //=> Merge with the default module-level options
            ...this.defaultSwalOptions,

            //=> Merge with calculated options set for that specific swal
            ...this.options,

            //=> Handle modal lifecycle events
            onBeforeOpen: (modalElement) => this.onBeforeOpen.emit({ modalElement }),
            onOpen: (modalElement) => this.onOpen.emit({ modalElement }),
            onClose: (modalElement) => this.onClose.emit({ modalElement }),

            //=> Force useRejections to false - see the component's doc block for the reason.
            useRejections: false
        };

        //=> Show the Swal!
        const promise = swal(options);

        //=> Handle (confirm) and (cancel) @Outputs
        // @todo: Implement this.

        //=> Return the unaltered promise
        return promise;
    }
}
