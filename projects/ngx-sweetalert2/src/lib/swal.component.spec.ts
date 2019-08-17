import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwalComponent } from './swal.component';

describe('NgxSweetalert2Component', () => {
    let component: SwalComponent;
    let fixture: ComponentFixture<SwalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SwalComponent]
        })
            .compileComponents();
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
