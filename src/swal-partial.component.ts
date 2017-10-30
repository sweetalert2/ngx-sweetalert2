import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';

/**
 * @internal
 * Holds a consumer's Angular template and displays it on a Sweet Alert.
 * See SwalPartialDirective for info about the covered feature.
 */
@Component({
    template: '<ng-container *ngTemplateOutlet="template"></ng-container>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwalPartialComponent {
    @Input() public template: TemplateRef<any>;
}
