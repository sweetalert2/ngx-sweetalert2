/**
 * Emitted when a SweetAlert modal gets created in memory, just before it's displayed.
 */
export interface WillOpenEvent {
    readonly modalElement: HTMLElement;
}

/**
 * Emitted when a SweetAlert modal gets displayed.
 */
export interface DidOpenEvent {
    readonly modalElement: HTMLElement;
}

/**
 * Emitted when a SweetAlert modal gets rendered.
 */
export interface DidRenderEvent {
    readonly modalElement: HTMLElement;
}

/**
 * Emitted when a SweetAlert modal gets closed (because it's been confirmed, cancelled, or for no reason at all).
 */
export interface WillCloseEvent {
    readonly modalElement: HTMLElement;
}
