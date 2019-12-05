import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { dismissOnDestroyToken, fireOnInitToken, swalProviderToken } from './di';

import { SwalComponent } from './swal.component';
import { SweetAlert2LoaderService } from './sweetalert2-loader.service';

describe('NgxSweetalert2Component', () => {
    let component: SwalComponent;
    let fixture: ComponentFixture<SwalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                SweetAlert2LoaderService,
                { provide: swalProviderToken, useValue: () => import('sweetalert2') },
                { provide: fireOnInitToken, useValue: false },
                { provide: dismissOnDestroyToken, useValue: true }
            ],
            declarations: [SwalComponent]
        });

        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SwalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
