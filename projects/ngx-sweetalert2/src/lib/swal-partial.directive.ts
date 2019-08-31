import {
    ApplicationRef, ComponentFactoryResolver, ComponentRef, Directive, Host, Injector, Input, OnDestroy, OnInit,
    TemplateRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwalPartialTarget, SwalPartialTargets } from './swal-partial-targets';
import { SwalPartialComponent } from './swal-partial.component';
import { SwalComponent } from './swal.component';
import { SweetAlert2LoaderService } from './sweetalert2-loader.service';

/**
 * A structural directive that lets you use Angular templates inside of SweetAlerts.
 * There are different targetable zones provided by {@link SwalPartialTargets}: title, content, confirmButton, etc, but
 * you can also make your own target by implementing {@link SwalPartialTarget} and giving it to this directive.
 * The default target is the alert text content zone.
 *
 * Usage in your component's TypeScript (if you use another target than {@link SwalPartialTargets.content}):
 *
 *     @Component({ ... })
 *     export class MyComponent {
 *         public constructor(public readonly swalTargets: SwalPartialTargets) {
 *         }
 *     }
 *
 * Usage in the template:
 *
 *     <swal title="Fill the form" (confirm)="confirmHandler()">
 *         <!-- This form will be displayed as the alert main content
 *              Targets the alert's main content zone by default -->
 *         <form *swalPartial [formControl]="myForm">
 *             ...
 *         </form>
 *
 *         <!-- This targets the confirm button's inner content
 *              Notice the usage of ng-container to avoid creating an useless DOM element inside the button -->
 *         <ng-container *swalPartial="swalTargets.confirmButton">
 *              Send ({{ secondsLeft }} seconds left)
 *         </ng-container>
 *     <swal>
 */
@Directive({
    selector: '[swalPartial]'
})
export class SwalPartialDirective implements OnInit, OnDestroy {
    /**
     * Takes a "partial target" or nothing (will target main content zone by default).
     *
     * See the {@link SwalPartialTargets} service to see the available targets.
     * See the class doc block for more informations.
     */
    @Input('swalPartial') public target?: SwalPartialTarget;

    /**
     * Holds the component reference of the controlled SwalPartialComponent to destroy it when no longer needed.
     */
    private partialComponentRef?: ComponentRef<SwalPartialComponent>;

    private readonly destroyed = new Subject<void>();

    public constructor(
        private readonly resolver: ComponentFactoryResolver,
        private readonly injector: Injector,
        private readonly app: ApplicationRef,
        private readonly templateRef: TemplateRef<any>,
        private readonly sweetAlert2Loader: SweetAlert2LoaderService,
        private readonly swalTargets: SwalPartialTargets,
        @Host() private readonly swalComponent: SwalComponent) {
    }

    /**
     * Subscribes to the the SweetAlert appearance/disappearance events to create/destroy the SwalPartialComponent
     * that will receive the consumer's template.
     */
    public ngOnInit(): void {
        // Can't be set in a default property value, if the customer lets *swalPartial empty, the value we get is undef.
        this.target = this.target || this.swalTargets.content;

        //=> Apply the options provided by the target definition
        void this.swalComponent.update(this.target.options);

        //=> Subscribe to a few hooks frm the parent SwalComponent.
        this.swalComponent.render.pipe(takeUntil(this.destroyed)).subscribe(this.renderHook.bind(this));
        this.swalComponent.beforeOpen.pipe(takeUntil(this.destroyed)).subscribe(this.beforeOpenHook.bind(this));
        this.swalComponent.afterClose.pipe(takeUntil(this.destroyed)).subscribe(this.afterCloseHook.bind(this));
    }

    /**
     * Signal any {@link destroyed} consumer that this is over, so they can unsubscribe from the
     * parent SwalComponent events.
     */
    public ngOnDestroy(): void {
        this.destroyed.next();
    }

    /**
     * This render hook runs 1..n times (per modal instance), just before the modal is shown (and also before the
     * {@link beforeOpenHook}), or after Swal.update() is called.
     * This is a good place to render, or re-render, our partial content.
     */
    private async renderHook(): Promise<void> {
        //=> Ensure the partial component is created
        if (!this.partialComponentRef) {
            this.partialComponentRef = this.createPartialComponent();
        }

        //=> SweetAlert2 created the modal or just erased all of our content, so we need to install/reinstall it.
        // Swal.update() is synchronous, this observable too, and mountComponentOnTarget too (the promise inside
        // this function is already resolved at this point), so the whole process of re-rendering and re-mounting
        // the partial component is fully synchronous, causing no blinks in the modal contents.
        const swal = await this.sweetAlert2Loader.swal;

        //=> Find target element
        const targetEl = this.target!.element(swal);

        //=> Replace target's contents with our component
        // https://jsperf.com/innerhtml-vs-removechild/15
        while (targetEl.firstChild) {
            targetEl.removeChild(targetEl.firstChild);
        }

        targetEl.appendChild(this.partialComponentRef.location.nativeElement);
    }

    /**
     * This beforeOpen hook runs once (per modal instance), just before the modal is shown on the screen.
     * This is a good place to declare our detached view to the Angular app.
     */
    private beforeOpenHook(): void {
        if (!this.partialComponentRef) return;

        //=> Make the Angular app aware of that detached view so rendering and change detection can happen
        this.app.attachView(this.partialComponentRef.hostView);
    }

    /**
     * This afterClose hook runs once (per modal instance), just after the modal closing animation terminated.
     * This is a good place to detach and destroy our content, that is not visible anymore.
     */
    private afterCloseHook(): void {
        if (!this.partialComponentRef) return;

        //=> Detach the partial component from the app and destroy it
        this.app.detachView(this.partialComponentRef.hostView);
        this.partialComponentRef.destroy();
        this.partialComponentRef = void 0;
    }

    /**
     * Creates the {@link SwalPartialComponent} and gives it the customer's template ref.
     */
    private createPartialComponent(): ComponentRef<SwalPartialComponent> {
        //=> Create the SwalPartialComponent that will hold our content
        const factory = this.resolver.resolveComponentFactory(SwalPartialComponent);

        // Yes, we do not use the third argument that would directly use the target as the component's view
        // (unfortunately, because that would give a cleaner DOM and would avoid dirty and direct DOM manipulations)
        // That's because we want to keep our component safe from SweetAlert2's operations on the DOM, and to be
        // able to restore it at any moment, ie. after the modal has been re-rendered.
        const componentRef = factory.create(this.injector, []);

        //=> Apply the consumer's template on the component
        componentRef.instance.template = this.templateRef;

        return componentRef;
    }
}
