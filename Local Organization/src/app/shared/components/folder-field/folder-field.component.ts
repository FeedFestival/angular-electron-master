import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { filter, Subject, takeUntil } from 'rxjs';
import { AppService } from '../../../app.service';

@Component({
    selector: 'app-folder-field',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        ReactiveFormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        MenuModule,
    ],
    templateUrl: './folder-field.component.html',
    styleUrl: './folder-field.component.scss',
})
export class FolderFieldComponent {
    @Input() control!: FormControl<string>;
    @Input() label = 'label';
    @Input() suggestion?: string;

    @Output() fieldChanged = new EventEmitter();

    items: MenuItem[];

    private readonly $destroyed = new Subject<void>();

    constructor(public readonly appService: AppService) {
        this.items = [
            {
                label: 'Create Folders',
                icon: 'pi pi-folder-plus',
                command: this.createFolderStructure,
            },
            {
                label: 'Generate Path',
                icon: 'pi pi-bolt',
                command: this.generatePath,
            },
        ];
    }

    ngOnDestroy(): void {
        this.$destroyed.next();
        this.$destroyed.complete();
    }

    openFileDialog(): void {
        const mainDir = this.appService.getMainDirectory();
        const options: Electron.OpenDialogOptions = {
            title: 'Select Folder or File',
            // properties: ['openDirectory', 'openFile', 'multiSelections'],
            properties: ['openDirectory'],
            defaultPath: mainDir,
        };

        console.log('options: ', options);

        this.appService
            .openDialog(options)
            .pipe(
                filter(filePaths => !!filePaths && filePaths?.length > 0),
                takeUntil(this.$destroyed),
            )
            .subscribe(filePaths => {
                console.log('filePaths: ', filePaths);
                const path = filePaths[0].replace(mainDir, '');
                console.log('path: ', path);
            });
    }

    private createFolderStructure = (): void => {
        const rawValue = this.control.getRawValue();
        if (!rawValue || rawValue?.length === 0) return;

        this.appService.writeDirsIfNotExists(rawValue);
    };

    private generatePath = (): void => {
        if (!this.suggestion) return;

        this.control.patchValue(this.suggestion, { emitEvent: true });
        this.fieldChanged.emit();
    };
}
