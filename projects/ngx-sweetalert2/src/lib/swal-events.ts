/**
 * Emitted when a SweetAlert modal gets created in memory, just before it's displayed.
 */
export interface BeforeOpenEvent {
    readonly modalElement: HTMLElement;
}

/**
 * Emitted when a SweetAlert modal gets displayed.
 */
export interface OpenEvent {
    readonly modalElement: HTMLElement;
}

/**
 * Emitted when a SweetAlert modal gets updated (re-rendered).
 */
export interface UpdatedEvent {
    readonly modalElement: HTMLElement;
}

/**
 * Emitted when a SweetAlert modal gets closed (because it's been confirmed, cancelled, or for no reason at all).
 */
export interface CloseEvent {
    readonly modalElement: HTMLElement;
}
