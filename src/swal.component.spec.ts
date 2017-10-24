import { async, TestBed } from '@angular/core/testing';
import { SwalDefaults } from './di';
import { SwalComponent } from './swal.component';

describe('SwalComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SwalComponent],
            providers: [
                { provide: SwalDefaults, useValue: true }
            ]
        }).compileComponents();
    }));

    it('should create the component', async(() => {
        const fixture = TestBed.createComponent(SwalComponent);
        const component = fixture.debugElement.componentInstance;

        expect(component).toBeTruthy();
    }));
});
