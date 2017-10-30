/**
 * Emitted when a SweetAlert modal gets created in memory, just before it's displayed.
 */
export interface OnBeforeOpenEvent {
    modalElement: HTMLElement;
}

/**
 * Emitted when a SweetAlert modal gets displayed.
 */
export interface OnOpenEvent {
    modalElement: HTMLElement;
}

/**
 * Emitted when a SweetAlert modal gets closed (because it's been confirmed, cancelled, or for no reason at all).
 */
export interface OnCloseEvent {
    modalElement: HTMLElement;
}
