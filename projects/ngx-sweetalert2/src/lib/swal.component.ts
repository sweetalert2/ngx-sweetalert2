import {
    ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges
} from '@angular/core';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { dismissOnDestroyToken } from './di';
import * as events from './swal-events';
import { SweetAlert2LoaderService } from './sweetalert2-loader.service';

/**
 * <swal> component. See the README.md for usage.
 *
 * It contains a bunch of @Inputs that have a perfect 1:1 mapping with SweetAlert2 options.
 * Their types are directly coming from SweetAlert2 types defintitions, meaning that ngx-sweetalert2 is tightly coupled
 * to SweetAlert2, but also is type-safe.
 *
 * (?) If you want to use an object that declares the SweetAlert2 options all at once rather than many @Inputs,
 *     take a look at [swalOptions], that lets you pass a full {@link SweetAlertOptions} object.
 *
 * (?) If you are reading the TypeScript source of this component, you may think that it's a lot of code.
 *     Be sure that a lot of this code is types and Angular boilerplate. Compiled and minified code is much smaller.
 *     If you are really concerned about performance and/or don't care about the API and its convenient integration
 *     with Angular (notably change detection and transclusion), you may totally use SweetAlert2 natively as well ;)
 *
 * /!\ Some SweetAlert options aren't @Inputs but @Outputs: onBeforeOpen, onOpen, onClose and onAfterClose
 *     (but without "on*" prefix to respect community standards).
 *     However, preConfirm and inputValidator are still @Inputs because there are not event handlers, there can't be
 *     multiple listeners and we need the values they can/must return.
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'swal',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwalComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public title: SweetAlertOptions['title'];
    @Input() public titleText: SweetAlertOptions['titleText'];
    @Input() public text: SweetAlertOptions['text'];
    @Input() public html: SweetAlertOptions['html'];
    @Input() public footer: SweetAlertOptions['footer'];
    @Input() public icon: SweetAlertOptions['icon'];
    @Input() public iconHtml: SweetAlertOptions['iconHtml'];
    @Input() public backdrop: SweetAlertOptions['backdrop'];
    @Input() public toast: SweetAlertOptions['toast'];
    @Input() public target: SweetAlertOptions['target'];
    @Input() public input: SweetAlertOptions['input'];
    @Input() public width: SweetAlertOptions['width'];
    @Input() public padding: SweetAlertOptions['padding'];
    @Input() public background: SweetAlertOptions['background'];
    @Input() public position: SweetAlertOptions['position'];
    @Input() public grow: SweetAlertOptions['grow'];
    @Input() public showClass: SweetAlertOptions['showClass'];
    @Input() public hideClass: SweetAlertOptions['hideClass'];
    @Input() public customClass: SweetAlertOptions['customClass'];
    @Input() public timer: SweetAlertOptions['timer'];
    /** @deprecated Use showClass and hideClass instead */
    @Input() public animation: SweetAlertOptions['animation'];
    @Input() public heightAuto: SweetAlertOptions['heightAuto'];
    @Input() public allowOutsideClick: SweetAlertOptions['allowOutsideClick'];
    @Input() public allowEscapeKey: SweetAlertOptions['allowEscapeKey'];
    @Input() public allowEnterKey: SweetAlertOptions['allowEnterKey'];
    @Input() public stopKeydownPropagation: SweetAlertOptions['stopKeydownPropagation'];
    @Input() public keydownListenerCapture: SweetAlertOptions['keydownListenerCapture'];
    @Input() public showConfirmButton: SweetAlertOptions['showConfirmButton'];
    @Input() public showCancelButton: SweetAlertOptions['showCancelButton'];
    @Input() public confirmButtonText: SweetAlertOptions['confirmButtonText'];
    @Input() public cancelButtonText: SweetAlertOptions['cancelButtonText'];
    @Input() public confirmButtonColor: SweetAlertOptions['confirmButtonColor'];
    @Input() public cancelButtonColor: SweetAlertOptions['cancelButtonColor'];
    @Input() public confirmButtonAriaLabel: SweetAlertOptions['confirmButtonAriaLabel'];
    @Input() public cancelButtonAriaLabel: SweetAlertOptions['cancelButtonAriaLabel'];
    @Input() public buttonsStyling: SweetAlertOptions['buttonsStyling'];
    @Input() public reverseButtons: SweetAlertOptions['reverseButtons'];
    @Input() public focusConfirm: SweetAlertOptions['focusConfirm'];
    @Input() public focusCancel: SweetAlertOptions['focusCancel'];
    @Input() public showCloseButton: SweetAlertOptions['showCloseButton'];
    @Input() public closeButtonHtml: SweetAlertOptions['closeButtonHtml'];
    @Input() public closeButtonAriaLabel: SweetAlertOptions['closeButtonAriaLabel'];
    @Input() public showLoaderOnConfirm: SweetAlertOptions['showLoaderOnConfirm'];
    @Input() public preConfirm: SweetAlertOptions['preConfirm'];
    @Input() public imageUrl: SweetAlertOptions['imageUrl'];
    @Input() public imageWidth: SweetAlertOptions['imageWidth'];
    @Input() public imageHeight: SweetAlertOptions['imageHeight'];
    @Input() public imageAlt: SweetAlertOptions['imageAlt'];
    @Input() public inputPlaceholder: SweetAlertOptions['inputPlaceholder'];
    @Input() public inputValue: SweetAlertOptions['inputValue'];
    @Input() public inputOptions: SweetAlertOptions['inputOptions'];
    @Input() public inputAutoTrim: SweetAlertOptions['inputAutoTrim'];
    @Input() public inputAttributes: SweetAlertOptions['inputAttributes'];
    @Input() public inputValidator: SweetAlertOptions['inputValidator'];
    @Input() public validationMessage: SweetAlertOptions['validationMessage'];
    @Input() public progressSteps: SweetAlertOptions['progressSteps'];
    @Input() public currentProgressStep: SweetAlertOptions['currentProgressStep'];
    @Input() public progressStepsDistance: SweetAlertOptions['progressStepsDistance'];
    @Input() public scrollbarPadding: SweetAlertOptions['scrollbarPadding'];

    /**
     * An object of SweetAlert2 native options, useful if:
     *  - you don't want to use the @Inputs for practical/philosophical reasons ;
     *  - there are missing @Inputs because ngx-sweetalert2 isn't up-to-date with SweetAlert2's latest changes.
     *
     * /!\ Please note that setting this property does NOT erase what has been set before unless you specify the
     *     previous properties you want to erase again.
     *     Ie. setting { title: 'Title' } and then { text: 'Text' } will give { title: 'Title', text: 'Text' }.
     *
     * /!\ Be aware that the options defined in this object will override the @Inputs of the same name.
     */
    @Input()
    public set swalOptions(options: SweetAlertOptions) {
        //=> Update properties
        Object.assign(this, options);

        //=> Mark changed properties as touched
        const touchedKeys = Object.keys(options) as Array<keyof SweetAlertOptions>;
        touchedKeys.forEach(this.markTouched);
    }

    /**
     * Computes the options object that will get passed to SweetAlert2.
     * Only the properties that have been set at least once on this component will be returned.
     * Mostly for internal usage.
     */
    public get swalOptions(): SweetAlertOptions {
        const options: { [P in keyof SweetAlertOptions]: any } = {};

        //=> We will compute the options object based on the option keys that are known to have changed.
        //   That avoids passing a gigantic object to SweetAlert2, making debugging easier and potentially
        //   avoiding side effects.
        this.touchedProps.forEach(prop => {
            options[prop] = this[prop as keyof this];
        });

        return options;
    }

    /**
     * Whether to dismiss the modal when the <swal> component is destroyed by Angular (for any reason) or not.
     * When left undefined (default), the value will be inherited from the module configuration.
     */
    @Input()
    public swalDismissOnDestroy?: boolean;

    /**
     * Emits an event when the modal DOM element has been created.
     * Useful to perform DOM mutations before the modal is shown.
     */
    @Output() public readonly beforeOpen = new EventEmitter<events.BeforeOpenEvent>();

    /**
     * Emits an event when the modal is shown.
     */
    @Output() public readonly open = new EventEmitter<events.OpenEvent>();

    /**
     * Emits an event when the modal DOM is rendered.
     */
    @Output() public readonly render = new EventEmitter<events.RenderEvent>();

    /**
     * Emits an event when the modal will be closed.
     * If you just want to know when the user dismissed the modal, prefer the higher-level (cancel) output.
     */
    @Output() public readonly close = new EventEmitter<events.CloseEvent>();

    /**
     * Emits an event after the modal had been closed.
     * If you just want to know when the user dismissed the modal, prefer the higher-level (cancel) output.
     */
    @Output() public readonly afterClose = new EventEmitter<void>();

    /**
     * Emits when the user clicks "Confirm".
     * Bears a value when using "input", resolved "preConfirm", etc.
     *
     * Example:
     *     <swal (confirm)="handleConfirm($event)"></swal>
     *
     *     public handleConfirm(email: string): void {
     *         // ... save user email
     *     }
     */
    @Output() public readonly confirm = new EventEmitter<any>();

    /**
     * Emits when the user clicks "Cancel", or dismisses the modal by any other allowed way.
     * By default, it will emit a string representing the reason for which the SweetAlert has been closed.
     * The reason is `undefined` when {@link dismiss} is called.
     *
     * Example:
     *     <swal (cancel)="handleCancel($event)"></swal>
     *
     *     public handleCancel(reason: DismissReason | undefined): void {
     *         // reason can be 'cancel', 'overlay', 'close', 'timer' or undefined.
     *         // ... do something
     *     }
     */
    @Output() public readonly cancel = new EventEmitter<Swal.DismissReason | undefined>();

    /**
     * This Set retains the properties that have been changed from @Inputs, so we can know precisely
     * what options we have to send to {@link Swal.fire}.
     */
    private readonly touchedProps = new Set<keyof SweetAlertOptions>();

    /**
     * A function of signature `(propName: string): void` that adds a given property name to the list of
     * touched properties, ie. {@link touchedProps}.
     */
    private readonly markTouched = this.touchedProps.add.bind(this.touchedProps);

    /**
     * Is the SweetAlert2 modal represented by this component currently opened?
     */
    private isCurrentlyShown = false;

    public constructor(
        private readonly sweetAlert2Loader: SweetAlert2LoaderService,
        @Inject(dismissOnDestroyToken) private readonly moduleLevelDismissOnDestroy: boolean) {
    }

    /**
     * Angular lifecycle hook.
     * Asks the SweetAlert2 loader service to preload the SweetAlert2 library, so it begins to be loaded only if there
     * is a <swal> component somewhere, and is probably fully loaded when the modal has to be displayed,
     * causing no delay.
     */
    public ngOnInit(): void {
        //=> Preload SweetAlert2 library in case this component is activated.
        this.sweetAlert2Loader.preloadSweetAlertLibrary();
    }

    /**
     * Angular lifecycle hook.
     * Updates the SweetAlert options, and if the modal is opened, asks SweetAlert to render it again.
     */
    public ngOnChanges(changes: SimpleChanges): void {
        //=> For each changed @Input that matches a SweetAlert2 option, mark as touched so we can
        //   send it with the next fire() or update() calls.
        Object.keys(changes)
            //=> If the filtering logic becomes more complex here, we can use Swal.isValidParameter
            .filter((prop): prop is keyof SweetAlertOptions => !prop.startsWith('swal'))
            .forEach(this.markTouched);

        //=> Eventually trigger re-render if the modal is open.
        void this.update();
    }

    /**
     * Angular lifecycle hook.
     * Closes the SweetAlert when the component is destroyed.
     */
    public ngOnDestroy(): void {
        //=> Release the modal if the component is destroyed and if that behaviour is not disabled.
        const dismissOnDestroy = this.swalDismissOnDestroy === undefined
            ? this.moduleLevelDismissOnDestroy
            : this.swalDismissOnDestroy;

        dismissOnDestroy && this.dismiss();
    }

    /**
     * Shows the SweetAlert.
     *
     * Returns the SweetAlert2 promise for convenience and use in code behind templates.
     * Otherwise, (confirm)="myHandler($event)" and (cancel)="myHandler($event)" can be used in templates.
     */
    public async fire(): Promise<any> {
        const swal = await this.sweetAlert2Loader.swal;

        //=> Build the SweetAlert2 options
        const options: SweetAlertOptions = {
            //=> Merge with calculated options set for that specific swal
            ...this.swalOptions,

            //=> Handle modal lifecycle events
            onBeforeOpen: (modalElement) => {
                this.beforeOpen.emit({ modalElement });
            },
            onOpen: (modalElement) => {
                this.isCurrentlyShown = true;
                this.open.emit({ modalElement });
            },
            onRender: (modalElement) => {
                this.render.emit({ modalElement });
            },
            onClose: (modalElement) => {
                this.isCurrentlyShown = false;
                this.close.emit({ modalElement });
            },
            onAfterClose: () => {
                this.afterClose.emit();
            }
        };

        //=> Show the Swal! And wait for confirmation or dimissal.
        const result = await swal.fire(options);

        //=> Emit on (confirm) or (cancel)
        if ('value' in result) {
            this.confirm.emit(result.value);
        } else {
            this.cancel.emit(result.dismiss);
        }

        return result;
    }

    /**
     * Closes the modal, if opened.
     *
     * @param result The value that the modal will resolve with, triggering either (confirm) or (cancel).
     *               If the argument is not passed, (dimiss) will emit `undefined`.
     *               See {@link Swal.close}
     */
    public async dismiss(result?: SweetAlertResult): Promise<void> {
        if (!this.isCurrentlyShown) return;

        const swal = await this.sweetAlert2Loader.swal;
        swal.close(result);
    }

    /**
     * Updates SweetAlert2 options while the modal is opened, causing the modal to re-render.
     * If the modal is not opened, the component options will simply be updated and that's it.
     *
     * /!\ Please note that not all SweetAlert2 options are updatable while the modal is opened.
     *
     * @param options
     */
    public async update(options?: SweetAlertOptions): Promise<void> {
        if (options) {
            this.swalOptions = options;
        }

        if (!this.isCurrentlyShown) return;

        const swal = await this.sweetAlert2Loader.swal;
        const allOptions = this.swalOptions;

        const updatableOptions = Object.keys(allOptions)
            .filter((key): key is keyof SweetAlertOptions => swal.isUpdatableParameter(key))
            .reduce((obj, key) => {
                obj[key] = allOptions[key];
                return obj;
            }, {} as { [P in keyof SweetAlertOptions]: any });

        swal.update(updatableOptions);
    }
}
