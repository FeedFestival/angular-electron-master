import { Component, inject, Inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'see-image',
    imports: [
        ButtonModule
    ],
    templateUrl: 'see-image.component.html',
})
export class SeeImageComponent {
    url: string;
    
    private readonly ref = inject(DynamicDialogRef);
    private readonly config = inject<DynamicDialogConfig<any>>(DynamicDialogConfig);

    constructor() {
        this.url = this.config.data.file.picUrl;
    }

    close(): void {
        this.ref.close();
    }
}
