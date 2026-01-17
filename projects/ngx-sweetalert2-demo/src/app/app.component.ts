import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SwalComponent, SwalDirective, SwalPortalDirective, SwalPortalTargets } from "@sweetalert2/ngx-sweetalert2";

@Component({
    selector: "demo-app",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    imports: [RouterModule, SwalComponent, SwalDirective, SwalPortalDirective],
})
export class AppComponent {
    readonly targets = inject<SwalPortalTargets>(SwalPortalTargets);

    public modalFireCondition = false;

    public isSwalVisible = false;

    private readonly dynamicTextChunks = "This dynamic content is controlled by Angular".split(" ");

    private dynamicTextChunksIntervalHandle?: number;

    private currentTextChunkOffset = 0;

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
