import { InjectionToken } from '@angular/core';
import Swal from 'sweetalert2';

export const swalProviderToken = new InjectionToken<typeof Swal>('@sweetalert2/ngx-sweetalert2#swalProvider');

export const fireOnInitToken = new InjectionToken<boolean>('@sweetalert2/ngx-sweetalert2#fireOnInit');

export const dismissOnDestroyToken = new InjectionToken<boolean>('@sweetalert2/ngx-sweetalert2#dismissOnDestroy');
