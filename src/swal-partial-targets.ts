import swal from 'sweetalert2';

/**
 * Represents an object of targets for <swal> partials (use with *swalPartial directive).
 * We must use thunks to access the swal.* functions listed below, because they get created after the first modal is
 * shown, so this object lets us reference those functions in a statically-typed manner.
 */
export class SwalPartialTargets {
    public readonly title = () => swal.getTitle();
    public readonly content = () => swal.getContent();
    public readonly confirmButton = () => swal.getConfirmButton();
    public readonly cancelButton = () => swal.getCancelButton();
    public readonly buttonsWrapper = () => swal.getButtonsWrapper();
}
