/**
 * Emitted when a SweetAlert modal gets created in memory, just before it's displayed.
 */
export interface BeforeOpenEvent {
    modalElement: HTMLElement;
}

/**
 * Emitted when a SweetAlert modal gets displayed.
 */
export interface OpenEvent {
    modalElement: HTMLElement;
}

/**
 * Emitted when a SweetAlert modal gets closed (because it's been confirmed, cancelled, or for no reason at all).
 */
export interface CloseEvent {
    modalElement: HTMLElement;
}
