import {
    ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output,
    ViewContainerRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal, { SweetAlertArrayOptions, SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from './swal.component';

/**
 * [swal] directive. It takes a value that defines the SweetAlert and can be of three types:
 *
 * 1) A simple array of two or three strings defining [title, text, icon] - the icon being optional, ex:
 *
 *    <button [swal]="['Title', 'Text']">Click me</button>
 *
 * 2) A native SweetAlert2 options object, ex:
 *
 *    <button [swal]="{ title: 'Title', text: 'Text' }">Click me</button>
 *
 * 3) A reference to an existing SwalComponent instance for more advanced uses, ex:
 *
 *    <button [swal]="mySwal">Click me</button>
 *    <swal #mySwal title="Title" text="Text"></swal>
 */
@Directive({
    selector: '[swal]'
})
export class SwalDirective implements OnInit, OnDestroy {
    /**
     * SweetAlert2 options or a SwalComponent instance.
     * See the class doc block for more informations.
     */
    @Input() public set swal(options: SwalComponent | SweetAlertOptions | SweetAlertArrayOptions) {
        if (options instanceof SwalComponent) {
            this.swalInstance = options;
        } else if (Array.isArray(options)) {
            this.swalOptions = {};
            [this.swalOptions.title, this.swalOptions.text, this.swalOptions.icon] = options;
        } else {
            this.swalOptions = options;
        }
    }

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
     * When the user does not provides a SwalComponent instance, we create it on-the-fly and assign the plain-object
     * options to it.
     * This fields keeps a reference to the dynamically-created <swal>, to destroy it along this directive instance.
     */
    private swalRef?: ComponentRef<SwalComponent>;

    /**
     * An instance of the <swal> component that this directive controls.
     * Could be an instance passed by the user, otherwise it's the instance we've dynamically created.
     */
    private swalInstance?: SwalComponent;

    /**
     * Holds the native SweetAlert2 options.
     * Empty when the user passed an existing SwalComponent instance.
     */
    private swalOptions?: SweetAlertOptions;

    public constructor(
        private readonly viewContainerRef: ViewContainerRef,
        private readonly resolver: ComponentFactoryResolver) {
    }

    /**
     * OnInit lifecycle handler.
     * Creates a SwalComponent instance if the user didn't provided one and binds on that component (confirm) and
     * (cancel) outputs to reemit on the directive.
     */
    public ngOnInit(): void {
        if (!this.swalInstance) {
            const factory = this.resolver.resolveComponentFactory(SwalComponent);

            this.swalRef = this.viewContainerRef.createComponent(factory);
            this.swalInstance = this.swalRef.instance;
        }
    }

    /**
     * OnDestroy lifecycle handler.
     * Destroys the dynamically-created SwalComponent.
     */
    public ngOnDestroy(): void {
        if (this.swalRef) {
            this.swalRef.destroy();
        }
    }

    /**
     * Click handler.
     * The directive listens for onclick events on its host element.
     * When this happens, it shows the <swal> attached to this directive.
     */
    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();

        if (!this.swalInstance) return;

        if (this.swalOptions) {
            this.swalInstance.swalOptions = this.swalOptions;
        }

        const swalClosed = new Subject();

        this.swalInstance.confirm.asObservable().pipe(takeUntil(swalClosed)).subscribe(v => this.confirm.emit(v));
        this.swalInstance.cancel.asObservable().pipe(takeUntil(swalClosed)).subscribe(v => this.cancel.emit(v));

        this.swalInstance.fire().then(() => swalClosed.next());
    }
}
