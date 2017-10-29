import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';

@Component({
    template: '<ng-container *ngTemplateOutlet="template"></ng-container>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwalPartialComponent {
    @Input() public template: TemplateRef<any>;
}
