import {
    AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit,
    Output, SimpleChanges
} from '@angular/core';
import Swal, { SweetAlertOptions, SweetAlertResult, SweetAlertUpdatableParameters } from 'sweetalert2';
import { dismissOnDestroyToken, fireOnInitToken } from './di';
import * as events from './swal-events';
import { SweetAlert2LoaderService } from './sweetalert2-loader.service';

/**
 * <swal> component. See the README.md for usage.
 *
 * It contains a bunch of @Inputs that have a perfect 1:1 mapping with SweetAlert2 options.
 * Their types are directly coming from SweetAlert2 types defintitions, meaning that ngx-sweetalert2 is tightly coupled
 * to SweetAlert2, but also is type-safe even if both libraries do not evolve in sync.
 *
 * (?) If you want to use an object that declares the SweetAlert2 options all at once rather than many @Inputs,
 *     take a look at [swalOptions], that lets you pass a full {@link SweetAlertOptions} object.
 *
 * (?) If you are reading the TypeScript source of this component, you may think that it's a lot of code.
 *     Be sure that a lot of this code is types and Angular boilerplate. Compiled and minified code is much smaller.
 *     If you are really concerned about performance and/or don't care about the API and its convenient integration
 *     with Angular (notably change detection and transclusion), you may totally use SweetAlert2 natively as well ;)
 *
 * /!\ Some SweetAlert options aren't @Inputs but @Outputs: `willOpen`, `didOpen`, `didRender`, `willClose`, `didClose`
 *     and `didDestroy`.
 *     However, `preConfirm`, `preDeny` and `inputValidator` are still @Inputs because they are not event handlers,
 *     there can't be multiple listeners on them, and we need the values they can/must return.
 */
@Component({
    selector: 'swal',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwalComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() public title: SweetAlertOptions['title'];
    @Input() public titleText: SweetAlertOptions['titleText'];
    @Input() public text: SweetAlertOptions['text'];
    @Input() public html: SweetAlertOptions['html'];
    @Input() public footer: SweetAlertOptions['footer'];
    @Input() public icon: SweetAlertOptions['icon'];
    @Input() public iconColor: SweetAlertOptions['iconColor'];
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
    @Input() public timerProgressBar: SweetAlertOptions['timerProgressBar'];
    @Input() public heightAuto: SweetAlertOptions['heightAuto'];
    @Input() public allowOutsideClick: SweetAlertOptions['allowOutsideClick'];
    @Input() public allowEscapeKey: SweetAlertOptions['allowEscapeKey'];
    @Input() public allowEnterKey: SweetAlertOptions['allowEnterKey'];
    @Input() public stopKeydownPropagation: SweetAlertOptions['stopKeydownPropagation'];
    @Input() public keydownListenerCapture: SweetAlertOptions['keydownListenerCapture'];
    @Input() public showConfirmButton: SweetAlertOptions['showConfirmButton'];
    @Input() public showDenyButton: SweetAlertOptions['showDenyButton'];
    @Input() public showCancelButton: SweetAlertOptions['showCancelButton'];
    @Input() public confirmButtonText: SweetAlertOptions['confirmButtonText'];
    @Input() public denyButtonText: SweetAlertOptions['denyButtonText'];
    @Input() public cancelButtonText: SweetAlertOptions['cancelButtonText'];
    @Input() public confirmButtonColor: SweetAlertOptions['confirmButtonColor'];
    @Input() public denyButtonColor: SweetAlertOptions['denyButtonColor'];
    @Input() public cancelButtonColor: SweetAlertOptions['cancelButtonColor'];
    @Input() public confirmButtonAriaLabel: SweetAlertOptions['confirmButtonAriaLabel'];
    @Input() public denyButtonAriaLabel: SweetAlertOptions['denyButtonAriaLabel'];
    @Input() public cancelButtonAriaLabel: SweetAlertOptions['cancelButtonAriaLabel'];
    @Input() public buttonsStyling: SweetAlertOptions['buttonsStyling'];
    @Input() public reverseButtons: SweetAlertOptions['reverseButtons'];
    @Input() public focusConfirm: SweetAlertOptions['focusConfirm'];
    @Input() public focusDeny: SweetAlertOptions['focusDeny'];
    @Input() public focusCancel: SweetAlertOptions['focusCancel'];
    @Input() public showCloseButton: SweetAlertOptions['showCloseButton'];
    @Input() public closeButtonHtml: SweetAlertOptions['closeButtonHtml'];
    @Input() public closeButtonAriaLabel: SweetAlertOptions['closeButtonAriaLabel'];
    @Input() public loaderHtml: SweetAlertOptions['loaderHtml'];
    @Input() public showLoaderOnConfirm: SweetAlertOptions['showLoaderOnConfirm'];
    @Input() public preConfirm: SweetAlertOptions['preConfirm'];
    @Input() public preDeny: SweetAlertOptions['preDeny'];
    @Input() public imageUrl: SweetAlertOptions['imageUrl'];
    @Input() public imageWidth: SweetAlertOptions['imageWidth'];
    @Input() public imageHeight: SweetAlertOptions['imageHeight'];
    @Input() public imageAlt: SweetAlertOptions['imageAlt'];
    @Input() public inputLabel: SweetAlertOptions['inputLabel'];
    @Input() public inputPlaceholder: SweetAlertOptions['inputPlaceholder'];
    @Input() public inputValue: SweetAlertOptions['inputValue'];
    @Input() public inputOptions: SweetAlertOptions['inputOptions'];
    @Input() public inputAutoTrim: SweetAlertOptions['inputAutoTrim'];
    @Input() public inputAttributes: SweetAlertOptions['inputAttributes'];
    @Input() public inputValidator: SweetAlertOptions['inputValidator'];
    @Input() public returnInputValueOnDeny: SweetAlertOptions['returnInputValueOnDeny'];
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
        //=> We will compute the options object based on the option keys that are known to have changed.
        //   That avoids passing a gigantic object to SweetAlert2, making debugging easier and potentially
        //   avoiding side effects.
        return [...this.touchedProps].reduce<SweetAlertOptions>(
            (obj, key) => ({ ...obj, [key]: this[key as keyof this] }),
            {});
    }

    /**
     * Whether to fire the modal as soon as the <swal> component is created and initialized in the view.
     * When left undefined (default), the value will be inherited from the module configuration, which is `false`.
     *
     * Example:
     *     <swal *ngIf="error" [title]="error.title" [text]="error.text" icon="error" [swalFireOnInit]="true"></swal>
     */
    @Input()
    public swalFireOnInit?: boolean;

    /**
     * Whether to dismiss the modal when the <swal> component is destroyed by Angular (for any reason) or not.
     * When left undefined (default), the value will be inherited from the module configuration, which is `true`.
     */
    @Input()
    public swalDismissOnDestroy?: boolean;

    @Input()
    public set swalVisible(visible: boolean) {
        visible ? this.fire() : this.close();
    }

    public get swalVisible(): boolean {
        return this.isCurrentlyShown;
    }

    /**
     * Modal lifecycle hook. Synchronously runs before the modal is shown on screen.
     */
    @Output()
    public readonly willOpen = new EventEmitter<events.WillOpenEvent>();

    /**
     * Modal lifecycle hook. Synchronously runs before the modal is shown on screen.
     */
    @Output()
    public readonly didOpen = new EventEmitter<events.DidOpenEvent>();

    /**
     * Modal lifecycle hook. Synchronously runs after the popup DOM has been updated (ie. just before the modal is
     * repainted on the screen).
     * Typically, this will happen after `Swal.fire()` or `Swal.update()`.
     * If you want to perform changes in the popup's DOM, that survive `Swal.update()`, prefer {@link didRender} over
     * {@link willOpen}.
     */
    @Output()
    public readonly didRender = new EventEmitter<events.DidRenderEvent>();

    /**
     * Modal lifecycle hook. Synchronously runs when the popup closes by user interaction (and not due to another popup
     * being fired).
     */
    @Output()
    public readonly willClose = new EventEmitter<events.WillCloseEvent>();

    /**
     * Modal lifecycle hook. Asynchronously runs after the popup has been disposed by user interaction (and not due to
     * another popup being fired).
     */
    @Output()
    public readonly didClose = new EventEmitter<void>();

    /**
     * Modal lifecycle hook. Synchronously runs after popup has been destroyed either by user interaction or by another
     * popup.
     * If you have cleanup operations that you need to reliably execute each time a modal is closed, prefer
     * {@link didDestroy} over {@link didClose}.
     */
    @Output()
    public readonly didDestroy = new EventEmitter<void>();

    /**
     * Emits when the user clicks "Confirm".
     * The event value ($event) can be either:
     *  - by default, just `true`,
     *  - when using {@link input}, the input value,
     *  - when using {@link preConfirm}, the return value of this function.
     *
     * Example:
     *     <swal (confirm)="handleConfirm($event)"></swal>
     *
     *     public handleConfirm(email: string): void {
     *         // ... save user email
     *     }
     */
    @Output()
    public readonly confirm = new EventEmitter<any>();

    /**
     * Emits when the user clicks "Deny".
     * This event bears no value.
     * Use `(deny)` (along with {@link showDenyButton}) when you want a modal with three buttons (confirm, deny and
     * cancel), and/or when you want to handle clear refusal in a separate way than simple dismissal.
     *
     * Example:
     *     <swal (deny)="handleDeny()"></swal>
     *
     *     public handleDeny(): void {
     *     }
     */
    @Output()
    public readonly deny = new EventEmitter<void>();

    /**
     * Emits when the user clicks "Cancel", or dismisses the modal by any other allowed way.
     * The event value ($event) is a string that explains how the modal was dismissed. It is `undefined` when
     * the modal was programmatically closed (through {@link close} for example).
     *
     * Example:
     *     <swal (dismiss)="handleDismiss($event)"></swal>
     *
     *     public handleDismiss(reason: DismissReason | undefined): void {
     *         // reason can be 'cancel', 'overlay', 'close', 'timer' or undefined.
     *         // ... do something
     *     }
     */
    @Output()
    public readonly dismiss = new EventEmitter<Swal.DismissReason | undefined>();

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
        @Inject(fireOnInitToken) private readonly moduleLevelFireOnInit: boolean,
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
     * Fires the modal, if the component or module is configured to do so.
     */
    public ngAfterViewInit(): void {
        const fireOnInit = this.swalFireOnInit === undefined
            ? this.moduleLevelFireOnInit
            : this.swalFireOnInit;

        fireOnInit && this.fire();
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
            .filter((key): key is keyof SweetAlertOptions => !key.startsWith('swal'))
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

        dismissOnDestroy && this.close();
    }

    /**
     * Shows the SweetAlert.
     *
     * Returns the SweetAlert2 promise for convenience and use in code behind templates.
     * Otherwise, (confirm)="myHandler($event)" and (dismiss)="myHandler($event)" can be used in templates.
     */
    public async fire(): Promise<SweetAlertResult> {
        const swal = await this.sweetAlert2Loader.swal;

        const userOptions = this.swalOptions;

        //=> Build the SweetAlert2 options
        const options: SweetAlertOptions = {
            //=> Merge with calculated options set for that specific swal
            ...userOptions,

            //=> Handle modal lifecycle events
            willOpen: composeHook(userOptions.willOpen, (modalElement) => {
                this.willOpen.emit({ modalElement });
            }),
            didOpen: composeHook(userOptions.didOpen, (modalElement) => {
                this.isCurrentlyShown = true;
                this.didOpen.emit({ modalElement });
            }),
            didRender: composeHook(userOptions.didRender, (modalElement) => {
                this.didRender.emit({ modalElement });
            }),
            willClose: composeHook(userOptions.willClose, (modalElement) => {
                this.isCurrentlyShown = false;
                this.willClose.emit({ modalElement });
            }),
            didClose: composeHook(userOptions.didClose, () => {
                this.didClose.emit();
            }),
            didDestroy: composeHook(userOptions.didDestroy, () => {
                this.didDestroy.emit();
            })
        };

        //=> Show the Swal! And wait for confirmation or dimissal.
        const result = await swal.fire(options);

        //=> Emit on (confirm), (deny) or (dismiss)
        switch (true) {
            case result.isConfirmed: this.confirm.emit(result.value); break;
            case result.isDenied: this.deny.emit(); break;
            case result.isDismissed: this.dismiss.emit(result.dismiss); break;
        }

        return result;

        function composeHook<T extends (...args: any[]) => void>(
            userHook: T | undefined,
            libHook: T): (...args: Parameters<T>) => void {

            return (...args) => (libHook(...args), userHook?.(...args));
        }
    }

    /**
     * Closes the modal, if opened.
     *
     * @param result The value that the modal will resolve with, triggering either (confirm), (deny) or (dismiss).
     *               If the argument is not passed, it is (dismiss) that will emit an `undefined` reason.
     *               {@see Swal.close}.
     */
    public async close(result?: SweetAlertResult): Promise<void> {
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
    public async update(options?: Pick<SweetAlertOptions, SweetAlertUpdatableParameters>): Promise<void> {
        if (options) {
            this.swalOptions = options;
        }

        if (!this.isCurrentlyShown) return;

        const swal = await this.sweetAlert2Loader.swal;

        const allOptions = this.swalOptions;

        const updatableOptions = Object.keys(allOptions)
            .filter(swal.isUpdatableParameter)
            .reduce<Pick<SweetAlertOptions, SweetAlertUpdatableParameters>>(
                (obj, key) => ({ ...obj, [key]: allOptions[key] }),
                {});

        swal.update(updatableOptions);
    }
}
