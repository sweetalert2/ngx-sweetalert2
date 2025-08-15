import { Component, Inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SwalComponent, SwalDirective, SwalPortalDirective, SwalPortalTargets } from "../../../../projects/ngx-sweetalert2/src/public-api";

@Component({
    selector: "app-demo-app",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    imports: [RouterModule, SwalComponent, SwalDirective, SwalPortalDirective],
})
export class AppComponent {
    public modalFireCondition = false;

    public isSwalVisible = false;

    private readonly dynamicTextChunks = "This dynamic content is controlled by Angular".split(" ");

    private dynamicTextChunksIntervalHandle?: any;

    private currentTextChunkOffset = 0;

    public constructor(@Inject(SwalPortalTargets) public readonly targets: SwalPortalTargets) {}

    public get currentTextChunk(): string {
        return this.dynamicTextChunks[this.currentTextChunkOffset % this.dynamicTextChunks.length];
    }

    public startDynamicTextRotation(): void {
        this.currentTextChunkOffset = 0;

        this.dynamicTextChunksIntervalHandle = setInterval(() => this.currentTextChunkOffset++, 1000);
    }

    public stopDynamicTextRotation(): void {
        clearInterval(this.dynamicTextChunksIntervalHandle);
    }
}
