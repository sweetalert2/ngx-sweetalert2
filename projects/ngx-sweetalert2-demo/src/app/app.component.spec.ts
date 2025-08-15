import { TestBed, waitForAsync } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { provideSweetAlert2 } from "../../../../projects/ngx-sweetalert2/src/public-api";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), AppComponent],
            providers: [provideSweetAlert2()],
        });

        TestBed.compileComponents();
    }));

    it("should create the app", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});
