import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import OriginalSwal from 'sweetalert2';
import { dismissOnDestroyToken, fireOnInitToken, swalProviderToken } from './di';
import { SwalComponent } from './swal.component';
import { SweetAlert2LoaderService } from './sweetalert2-loader.service';

describe('SwalComponent', () => {
    let swal: typeof OriginalSwal;
    let component: SwalComponent;
    let fixture: ComponentFixture<SwalComponent>;
    const testTitle = 'Test title';
    const testText = 'Test text';

    beforeEach(waitForAsync(() => {
        swal = jasmine.createSpyObj<typeof OriginalSwal>(['fire']);

        TestBed.configureTestingModule({
            providers: [
                SweetAlert2LoaderService,
                { provide: swalProviderToken, useValue: swal },
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

    it('should not print anything into the DOM', () => {
        expect(fixture.nativeElement.innerHTML).toBe('');
    });

    it('should not have default options', () => {
        const optionsKeys = Object.keys(component.swalOptions);

        expect(optionsKeys.length).toBe(0);
    });

    it('should convert @Inputs to swal options', () => {
        component.title = testTitle;
        component.ngOnChanges({ title: new SimpleChange(null, testTitle, true) });

        component.text = testText;
        component.ngOnChanges({ text: new SimpleChange(null, testText, true) });

        const { title, text, ...rest } = component.swalOptions;

        expect(title).toBe(testTitle);
        expect(text).toBe(testText);

        expect(Object.keys(rest).length).toBe(0);
    });

    it('should merge options set via swalOptions with the current ones', () => {
        component.title = testTitle;
        component.text = testText;
        component.ngOnChanges({
            title: new SimpleChange(null, testTitle, true),
            text: new SimpleChange(null, testText, true)
        });

        component.swalOptions = { title: `# ${testTitle}`, icon: 'question' };

        const { title, text, icon } = component.swalOptions;

        expect(title).toBe(`# ${testTitle}`);
        expect(text).toBe(testText);
        expect(icon).toBe('question');
    });

    it('should not copy special properties to the swal options object', () => {
        component.swalFireOnInit = false;
        component.swalDismissOnDestroy = false;
        component.swalVisible = false;

        component.ngOnChanges({
            swalFireOnInit: new SimpleChange(null, false, true),
            swalDismissOnDestroy: new SimpleChange(null, false, true),
            swalVisible: new SimpleChange(null, false, true)
        });

        const optionsKeys = Object.keys(component.swalOptions);

        expect(optionsKeys.filter(key => key.startsWith('swal')).length).toBe(0);
    });
});

