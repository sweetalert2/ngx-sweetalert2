import { InjectionToken, Provider } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';

export const SwalDefaults = new InjectionToken<SweetAlertOptions>('SwalDefaults');

export function swalDefaultsProvider(options: SweetAlertOptions = {}): Provider {
    return {
        provide: SwalDefaults,
        useValue: options
    };
}
