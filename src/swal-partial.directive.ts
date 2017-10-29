import {
    ApplicationRef, ComponentFactoryResolver, ComponentRef, Directive, Host, Injector, Input, OnDestroy, OnInit,
    TemplateRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SwalPartialTargets } from './swal-partial-targets';
import { SwalPartialComponent } from './swal-partial.component';
import { SwalComponent } from './swal.component';

@Directive({
    selector: '[swalPartial]'
})
export class SwalPartialDirective implements OnInit, OnDestroy {
    @Input() public swalPartial: () => HTMLElement;

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

    public ngOnInit(): void {
        this.beforeOpenSubscription = this.swalComponent.onBeforeOpen.asObservable().subscribe(() => {
            const targetEl = this.swalPartial ? this.swalPartial() : this.swalTargets.content();
            const factory = this.resolver.resolveComponentFactory(SwalPartialComponent);

            this.partialRef = factory.create(this.injector, [], targetEl);

            this.partialRef.instance.template = this.templateRef;

            this.app.attachView(this.partialRef.hostView);
        });

        this.closeSubscription = this.swalComponent.onClose.asObservable().subscribe(() => {
            this.app.detachView(this.partialRef.hostView);
            this.partialRef.destroy();
        });
    }

    public ngOnDestroy(): void {
        this.beforeOpenSubscription.unsubscribe();
        this.closeSubscription.unsubscribe();
    }
}
