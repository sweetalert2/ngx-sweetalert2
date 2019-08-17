import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSweetalert2Component } from './ngx-sweetalert2.component';

describe('NgxSweetalert2Component', () => {
    let component: NgxSweetalert2Component;
    let fixture: ComponentFixture<NgxSweetalert2Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NgxSweetalert2Component]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NgxSweetalert2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
