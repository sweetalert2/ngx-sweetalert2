import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwalDirective, SwalPortalTargets, SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
    selector: 'demo-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [RouterModule, SwalComponent, SwalDirective],
    providers: [SwalPortalTargets]
})
export class AppComponent {
    public modalFireCondition = false;

    public isSwalVisible = false;

    private readonly dynamicTextChunks = 'This dynamic content is controlled by Angular'.split(' ');

    private dynamicTextChunksIntervalHandle?: any;

    private currentTextChunkOffset = 0;

    public constructor(@Inject(SwalPortalTargets) public readonly targets: SwalPortalTargets) {
    }

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
