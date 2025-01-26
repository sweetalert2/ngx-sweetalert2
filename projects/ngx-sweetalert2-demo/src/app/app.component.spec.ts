import { TestBed, waitForAsync } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), SweetAlert2Module.forRoot(), AppComponent],
        });

        TestBed.compileComponents();
    }));

    it("should create the app", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});
