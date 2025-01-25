import { SwalProvider } from "./sweetalert2-loader.service";

export interface Sweetalert2ModuleConfig {
    provideSwal?: SwalProvider;
    fireOnInit?: boolean;
    dismissOnDestroy?: boolean;
}