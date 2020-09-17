import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

export interface SwalPortalTarget {
    options?: SweetAlertOptions;
    element(swal: typeof Swal): HTMLElement | null;
}

/**
 * Represents an object of targets for <swal> portals (use with *swalPortal directive).
 * We must use thunks to access the Swal.* functions listed below, because they get created after the first modal is
 * shown, so this object lets us reference those functions safely and in a statically-typed manner.
 */
@Injectable({ providedIn: 'root' })
export class SwalPortalTargets {
    /**
     * Targets the modal close button block contents.
     */
    public readonly closeButton: SwalPortalTarget = {
        element: swal => swal.getCloseButton(),
        options: { showCloseButton: true }
    };

    /**
     * Targets the modal title block contents.
     */
    public readonly title: SwalPortalTarget = {
        element: swal => swal.getTitle(),
        // Empty text that will never be shown but necessary so SweetAlert2 makes the div visible.
        options: { title: ' ' }
    };

    /**
     * Targets the modal text block contents (that is another block inside the first content block, so you can still
     * use other modal features like Swal inputs, that are situated inside that parent content block).
     */
    public readonly content: SwalPortalTarget = {
        element: swal => swal.getHtmlContainer(),
        // Empty text that will never be shown but necessary so SweetAlert2 makes the div visible.
        options: { text: ' ' }
    };

    /**
     * Targets the actions block contents, where are the confirm and cancel buttons in a normal time.
     * /!\ WARNING: using this target destroys some of the native SweetAlert2 modal's DOM, therefore, if you use this
     *     target, do not update the modal via <swal> @Inputs while the modal is open, or you'll get an error.
     *     We could workaround that inconvenient inside this integration, but that'd be detrimental to memory and
     *     performance of everyone, for a relatively rare use case.
     */
    public readonly actions: SwalPortalTarget = {
        element: swal => swal.getActions(),
        // The button will never exist, but SweetAlert2 shows the actions block only if there is at least one button.
        options: { showConfirmButton: true }
    };

    /**
     * Targets the confirm button contents, replacing the text inside it (not the button itself)
     */
    public readonly confirmButton: SwalPortalTarget = {
        element: swal => swal.getConfirmButton(),
        options: { showConfirmButton: true }
    };

    /**
     * Targets the deny button contents, replacing the text inside it (not the button itself)
     */
    public readonly denyButton: SwalPortalTarget = {
        element: swal => swal.getDenyButton(),
        options: { showDenyButton: true }
    };

    /**
     * Targets the cancel button contents, replacing the text inside it (not the button itself)
     */
    public readonly cancelButton: SwalPortalTarget = {
        element: swal => swal.getCancelButton(),
        options: { showCancelButton: true }
    };

    /**
     * Targets the modal footer contents.
     */
    public readonly footer: SwalPortalTarget = {
        element: swal => swal.getFooter(),
        // Empty text that will never be shown but necessary so SweetAlert2 makes the div visible.
        options: { footer: ' ' }
    };
}
