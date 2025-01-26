import {
    ApplicationRef, ComponentFactoryResolver, ComponentRef, Directive, Host, Injector, Input, OnDestroy, OnInit,
    TemplateRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwalPortalTarget, SwalPortalTargets } from './swal-portal-targets.service';
import { SwalPortalComponent } from './swal-portal.component';
import { SwalComponent } from './swal.component';
import { SweetAlert2LoaderService } from './sweetalert2-loader.service';

/**
 * A structural directive that lets you use Angular templates inside of SweetAlerts.
 * There are different targetable zones provided by {@link SwalPortalTargets}: title, content, confirmButton, etc, but
 * you can also make your own target by implementing {@link SwalPortalTarget} and giving it to this directive.
 * The default target is the alert text content zone.
 *
 * Usage in your component's TypeScript (if you use another target than {@link SwalPortalTargets.content}):
 *
 *     @Component({ ... })
 *     export class MyComponent {
 *         public constructor(public readonly swalTargets: SwalPortalTargets) {
 *         }
 *     }
 *
 * Usage in the template:
 *
 *     <swal title="Fill the form" (confirm)="confirmHandler()">
 *         <!-- This form will be displayed as the alert main content
 *              Targets the alert's main content zone by default -->
 *         <form *swalPortal [formControl]="myForm">
 *             ...
 *         </form>
 *
 *         <!-- This targets the confirm button's inner content
 *              Notice the usage of ng-container to avoid creating an useless DOM element inside the button -->
 *         <ng-container *swalPortal="swalTargets.confirmButton">
 *              Send ({{ secondsLeft }} seconds left)
 *         </ng-container>
 *     <swal>
 */
@Directive({
    selector: '[swalPortal]'
})
export class SwalPortalDirective implements OnInit, OnDestroy {
    /**
     * Takes a portal target or nothing (then it will target the text content zone by default).
     *
     * See the {@link SwalPortalTargets} service to see the available targets.
     * See the class doc block for more informations.
     */
    @Input('swalPortal')
    public target?: SwalPortalTarget;

    /**
     * Holds the component reference of the controlled SwalPortalComponent to destroy it when no longer needed.
     */
    private portalComponentRef?: ComponentRef<SwalPortalComponent>;

    private readonly destroyed = new Subject<void>();

    public constructor(
        private readonly resolver: ComponentFactoryResolver,
        private readonly injector: Injector,
        private readonly app: ApplicationRef,
        private readonly templateRef: TemplateRef<any>,
        private readonly sweetAlert2Loader: SweetAlert2LoaderService,
        private readonly swalTargets: SwalPortalTargets,
        @Host() private readonly swalComponent: SwalComponent) {
    }

    /**
     * Subscribes to the the SweetAlert appearance/disappearance events to create/destroy the SwalPortalComponent
     * that will receive the consumer's template.
     */
    public ngOnInit(): void {
        // Can't be set in a default property value, if the customer lets *swalPortal empty, the value we get is undef.
        this.target = this.target || this.swalTargets.content;

        //=> Apply the options provided by the target definition
        void this.swalComponent.update(this.target.options);

        //=> Subscribe to a few hooks frm the parent SwalComponent.
        this.swalComponent.didRender.pipe(takeUntil(this.destroyed)).subscribe(this.didRenderHook.bind(this));
        this.swalComponent.willOpen.pipe(takeUntil(this.destroyed)).subscribe(this.willOpenHook.bind(this));
        this.swalComponent.didDestroy.pipe(takeUntil(this.destroyed)).subscribe(this.didDestroyHook.bind(this));
    }

    /**
     * Signal any {@link destroyed} consumer that this is over, so they can unsubscribe from the
     * parent SwalComponent events.
     */
    public ngOnDestroy(): void {
        this.destroyed.next();
    }

    /**
     * This didRender hook runs 1..n times (per modal instance), just before the modal is shown (and also before the
     * {@link willOpenHook}), or after Swal.update() is called.
     * This is a good place to render, or re-render, our portal contents.
     */
    private async didRenderHook(): Promise<void> {
        //=> Ensure the portal component is created
        if (!this.portalComponentRef) {
            this.portalComponentRef = this.createPortalComponent();
        }

        //=> SweetAlert2 created the modal or just erased all of our content, so we need to install/reinstall it.
        // Swal.update() is synchronous, this observable too, and mountComponentOnTarget too (the promise inside
        // this function is already resolved at this point), so the whole process of re-rendering and re-mounting
        // the portal component is fully synchronous, causing no blinks in the modal contents.
        const swal = await this.sweetAlert2Loader.swal;

        //=> Find target element
        const targetEl = this.target!.element(swal);
        if (!targetEl) return;

        //=> Replace target's contents with our component
        // https://jsperf.com/innerhtml-vs-removechild/15
        while (targetEl.firstChild) {
            targetEl.removeChild(targetEl.firstChild);
        }

        targetEl.appendChild(this.portalComponentRef.location.nativeElement);
    }

    /**
     * This willOpen hook runs once (per modal instance), just before the modal is shown on the screen.
     * This is a good place to declare our detached view to the Angular app.
     */
    private willOpenHook(): void {
        if (!this.portalComponentRef) return;

        //=> Make the Angular app aware of that detached view so rendering and change detection can happen
        this.app.attachView(this.portalComponentRef.hostView);
    }

    /**
     * This didDestroy hook runs once (per modal instance), just after the modal closing animation terminated.
     * This is a good place to detach and destroy our content, that is not visible anymore.
     */
    private didDestroyHook(): void {
        if (!this.portalComponentRef) return;

        //=> Detach the portal component from the app and destroy it
        this.app.detachView(this.portalComponentRef.hostView);
        this.portalComponentRef.destroy();
        this.portalComponentRef = void 0;
    }

    /**
     * Creates the {@link SwalPortalComponent} and gives it the customer's template ref.
     */
    private createPortalComponent(): ComponentRef<SwalPortalComponent> {
        //=> Create the SwalPortalComponent that will hold our content
        const factory = this.resolver.resolveComponentFactory(SwalPortalComponent);

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
