import { Inject, Injectable } from '@angular/core';
import SwalDefault, * as Swal from 'sweetalert2';
import { swalProviderToken } from './di';

export type SwalModule = typeof SwalDefault | typeof Swal;

export type SwalProvider = SwalModuleLoader | SwalModule;

export type SwalModuleLoader = () => Promise<SwalModule>;

@Injectable()
export class SweetAlert2LoaderService {
    private readonly swalProvider: SwalProvider;

    private swalPromiseCache?: Promise<typeof SwalDefault>;

    // Using any because Angular metadata generator does not understand a pure TS type here
    public constructor(@Inject(swalProviderToken) swalProvider: any) {
        this.swalProvider = swalProvider;
    }

    public get swal(): Promise<typeof SwalDefault> {
        if (!this.swalPromiseCache) {
            this.preloadSweetAlertLibrary();
        }

        return this.swalPromiseCache!;
    }

    public preloadSweetAlertLibrary(): void {
        if (this.swalPromiseCache) return;

        const libPromise = isLoader(this.swalProvider)
            ? this.swalProvider()
            : Promise.resolve(this.swalProvider);

        this.swalPromiseCache = libPromise.then(value => isDefaultExport(value) ? value : value.default);

        function isLoader(value: SwalProvider): value is SwalModuleLoader {
            return typeof value === 'function' && (value as any).version === undefined;
        }

        function isDefaultExport(value: SwalModule): value is typeof SwalDefault {
            return typeof value === 'function';
        }
    }
}
