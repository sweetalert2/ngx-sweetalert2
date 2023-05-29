import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { dismissOnDestroyToken, fireOnInitToken, swalProviderToken } from './di';
import { SweetAlert2LoaderService } from './sweetalert2-loader.service';
import { provideDefaultSwal, SweetAlert2Module, Sweetalert2ModuleConfig } from './sweetalert2.module';

export const provideSweetalert2 = (options: Sweetalert2ModuleConfig = {}): EnvironmentProviders => {
    return makeEnvironmentProviders([
        SweetAlert2Module,
        SweetAlert2LoaderService,
        { provide: swalProviderToken, useValue: options.provideSwal || provideDefaultSwal },
        { provide: fireOnInitToken, useValue: options.fireOnInit || false },
        { provide: dismissOnDestroyToken, useValue: options.dismissOnDestroy || true }
    ]);
};
