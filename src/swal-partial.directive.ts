import {
    ApplicationRef, ComponentFactoryResolver, ComponentRef, Directive, Host, Injector, Input, OnDestroy, OnInit,
    TemplateRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SwalPartialTargets } from './swal-partial-targets';
import { SwalPartialComponent } from './swal-partial.component';
import { SwalComponent } from './swal.component';

/**
 * A structural directive that lets you use Angular templates inside of Sweet Alerts.
 * There are different targetable zones in a Sweet Alert: title, content, confirmButton, cancelButton, buttonsWrapper.
 * The default target is the content zone.
 *
 * Usage in your component's TypeScript code-behind (if you use another target than "content"):
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
    @Input() public swalPartial: () => HTMLElement;

    /**
     * Holds the component reference of the controlled SwalPartialComponent to destroy it when no longer needed.
     */
    private partialRef: ComponentRef<SwalPartialComponent>;

    private beforeOpenSubscription: Subscription;
    private closeSubscription: Subscription;

    constructor(
        private readonly resolver: ComponentFactoryResolver,
        private readonly injector: Injector,
        private readonly app: ApplicationRef,
        private readonly templateRef: TemplateRef<any>,
        private readonly swalTargets: SwalPartialTargets,
        @Host() private readonly swalComponent: SwalComponent) {
    }

    /**
     * Subscribes to the the Sweet Alert appearance/disappearance to create/destroy the SwalPartialComponent that will
     * receive the consumer's template.
     */
    public ngOnInit(): void {
        this.beforeOpenSubscription = this.swalComponent.beforeOpen.asObservable().subscribe(() => {
            //=> Create the SwalPartialComponent on the target DOM node in the Sweet Alert
            const targetEl = this.swalPartial ? this.swalPartial() : this.swalTargets.content();
            const factory = this.resolver.resolveComponentFactory(SwalPartialComponent);

            this.partialRef = factory.create(this.injector, [], targetEl);

            //=> Apply the consumer's template on the component
            this.partialRef.instance.template = this.templateRef;

            //=> Make the Angular app aware of that detached view so change detection works
            this.app.attachView(this.partialRef.hostView);
        });

        this.closeSubscription = this.swalComponent.close.asObservable().subscribe(() => {
            //=> Detach the partial component from the app and destroy it
            this.app.detachView(this.partialRef.hostView);
            this.partialRef.destroy();
        });
    }

    /**
     * Unsubscribes from the Sweet Alert appearance/disappearance.
     */
    public ngOnDestroy(): void {
        this.beforeOpenSubscription.unsubscribe();
        this.closeSubscription.unsubscribe();
    }
}
