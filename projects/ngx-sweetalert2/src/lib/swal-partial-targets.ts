import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

export interface SwalPartialTarget {
    options?: SweetAlertOptions;
    element(swal: typeof Swal): HTMLElement;
}

/**
 * Represents an object of targets for <swal> partials (use with *swalPartial directive).
 * We must use thunks to access the Swal.* functions listed below, because they get created after the first modal is
 * shown, so this object lets us reference those functions safely and in a statically-typed manner.
 */
@Injectable({ providedIn: 'root' })
export class SwalPartialTargets {
    public readonly title: SwalPartialTarget = {
        element: swal => swal.getTitle(),
        // Empty text that will never be shown but necessary so SweetAlert2 makes the div visible.
        options: { title: ' ' }
    };

    public readonly content: SwalPartialTarget = {
        element: swal => swal.getContent().querySelector('#swal2-content') as HTMLElement,
        // Empty text that will never be shown but necessary so SweetAlert2 makes the div visible.
        options: { text: ' ' }
    };

    public readonly closeButton: SwalPartialTarget = {
        element: swal => swal.getCloseButton(),
        options: { showCloseButton: true }
    };

    public readonly confirmButton: SwalPartialTarget = {
        element: swal => swal.getConfirmButton(),
        options: { showConfirmButton: true }
    };

    public readonly cancelButton: SwalPartialTarget = {
        element: swal => swal.getCancelButton(),
        options: { showCancelButton: true }
    };

    public readonly actions: SwalPartialTarget = {
        element: swal => swal.getActions(),
        // The button will never exist, but SweetAlert2 shows the actions block only if there is at least one button.
        options: { showConfirmButton: true }
    };

    public readonly footer: SwalPartialTarget = {
        element: swal => swal.getFooter(),
        // Empty text that will never be shown but necessary so SweetAlert2 makes the div visible.
        options: { footer: ' ' }
    };
}
