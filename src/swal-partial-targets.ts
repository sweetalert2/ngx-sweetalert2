import Swal from 'sweetalert2';

/**
 * Represents an object of targets for <swal> partials (use with *swalPartial directive).
 * We must use thunks to access the Swal.* functions listed below, because they get created after the first modal is
 * shown, so this object lets us reference those functions safely and in a statically-typed manner.
 */
export class SwalPartialTargets {
    public readonly title = () => Swal.getTitle();

    public readonly content = () => Swal.getContent();

    public readonly actions = () => Swal.getActions();

    public readonly confirmButton = () => Swal.getConfirmButton();

    public readonly cancelButton = () => Swal.getCancelButton();

    public readonly footer = () => Swal.getFooter();
}
