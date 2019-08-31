import { InjectionToken } from '@angular/core';
import Swal from 'sweetalert2';

export const swalProviderToken = new InjectionToken<typeof Swal>('@sweetalert2/ngx-sweetalert2#swalLibraryToken');
