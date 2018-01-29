import swal from 'sweetalert2';

/**
 * Represents an object of targets for <swal> partials (use with *swalPartial directive).
 * We must use thunks to access the swal.* functions listed below, because they get created after the first modal is
 * shown, so this object lets us reference those functions safely and in a statically-typed manner.
 */
export class SwalPartialTargets {
    public readonly title = () => swal.getTitle();

    public readonly content = () => swal.getContent();

    /**
     * @deprecated Will be removed in the next major version, please use {@link SwalPartialTargets#actions} instead.
     */
    public readonly buttonsWrapper = () => swal.getButtonsWrapper();

    public readonly actions = () => swal.getActions();

    public readonly confirmButton = () => swal.getConfirmButton();

    public readonly cancelButton = () => swal.getCancelButton();

    public readonly footer = () => swal.getFooter();
}
