import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GalleriaModule } from 'primeng/galleria';
import { ImagePath } from '../../model/DriveFile';

@Component({
    selector: 'see-image',
    standalone: true,
    imports: [ButtonModule, GalleriaModule],
    templateUrl: 'see-image.component.html',
})
export class SeeImageComponent {
    images = [];
    activeIndex: number = 0;
    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ];

    private readonly ref = inject(DynamicDialogRef);
    private readonly config =
        inject<DynamicDialogConfig<{ images: ImagePath[]; id: string }>>(DynamicDialogConfig);

    constructor() {
        this.activeIndex = this.config.data.images.findIndex(img => img.id === this.config.data.id);
        this.images = this.config.data.images.map(img => ({
            itemImageSrc: img.path,
            thumbnailImageSrc: img.path,
            alt: img.id,
            title: img.id,
        }));
    }

    close(): void {
        this.ref.close();
    }
}
