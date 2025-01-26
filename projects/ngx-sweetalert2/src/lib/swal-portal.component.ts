import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';

/**
 * @internal
 * Holds a consumer's Angular template and displays it on a Sweet Alert.
 * See SwalPortalDirective for info about the covered feature.
 */
@Component({
    selector: 'swal-portal',
    template: '<ng-container *ngTemplateOutlet="template"></ng-container>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwalPortalComponent {
    @Input()
    public template: TemplateRef<any> | null = null;
}
