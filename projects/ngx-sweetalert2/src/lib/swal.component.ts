import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SweetAlert2LoaderService } from './sweetalert2-loader.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'swal',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwalComponent implements OnInit {
    public constructor(private readonly sweetAlert2Loader: SweetAlert2LoaderService) {
    }

    public ngOnInit(): void {
        this.sweetAlert2Loader.preloadSweetAlertLibrary();
    }
}
