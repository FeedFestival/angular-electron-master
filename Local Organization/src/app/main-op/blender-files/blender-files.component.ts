import { NgClass, NgFor, NgForOf, NgIf, NgStyle } from '@angular/common';
import { Component, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElectronService as NgxElectronService } from 'ngx-electronyzer';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, Subject, forkJoin, from, merge, of } from 'rxjs';
import { distinct, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { AppService } from '../../app.service';
import { ElectronService } from '../../core/services';
import { SeeImageComponent } from '../../shared/components/see-image/see-image.component';
import { LabelValue } from '../../shared/model';
import { DriveFile, IFile, ImagePath, RawFile, defaultIFile } from '../../shared/model/DriveFile';
import { FILTER_TYPE, IMAGE_EXTS, blenderFilesCols } from './blender-files.constants';
import { BLENDER_FILES_DRIVE_FILE, BlenderFilesService } from './blender-files.service';
import { BlenderFinder } from './blender-finder';
import { BlenderFinderAsync } from './blender-finder-async';

const FORM_VALUE_KEY = 'blender-files-form-values';

@Component({
    selector: 'app-blender-files',
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        NgForOf,
        NgStyle,
        NgClass,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        TableModule,
        TooltipModule,
        IconFieldModule,
        InputIconModule,
    ],
    templateUrl: './blender-files.component.html',
    styleUrls: ['./blender-files.component.scss'],
})
export class BlenderFilesComponent implements OnDestroy {
    FILTER_TYPE = FILTER_TYPE;
    cols = blenderFilesCols;

    @ViewChild('dt') dt: any;

    fg: FormGroup;
    // blenderFinder = new BlenderFinderAsync('.blend');
    blenderFinder = new BlenderFinder('.blend');
    files: IFile[] = [];
    drives: LabelValue<string>[] = [];

    private destroyed$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        protected readonly zone: NgZone,
        private appService: AppService,
        private dialog: DialogService,
        private electron: ElectronService,
        private blenderFilesService: BlenderFilesService,
        private ngxElectron: NgxElectronService,
    ) {
        this.fg = this.fb.group(
            {
                drive: this.fb.control(null, Validators.required),
            },
            { updateOn: 'blur' },
        );

        this.electron
            .getDriveList()
            .subscribe(result => (this.drives = result.map(it => ({ label: it, value: it }))));

        this.fg.valueChanges
            .pipe(distinct())
            .subscribe(value => localStorage.setItem(FORM_VALUE_KEY, JSON.stringify(value, null, 2)));

        this.fg.controls.drive.valueChanges
            .pipe(
                switchMap(drive =>
                    this.appService.readFile(drive, BLENDER_FILES_DRIVE_FILE).pipe(
                        switchMap((driveFile: DriveFile) => {
                            if (!driveFile) return this.blenderFilesService.createDefaultDriveFile(drive);
                            return of(driveFile);
                        }),
                    ),
                ),
            )
            .subscribe(driveFile => {
                console.log('driveFile: ', driveFile);
                this.onTableDataLoaded(driveFile.files);
            });

        const blenderFilesFormValues = localStorage.getItem(FORM_VALUE_KEY);
        if (blenderFilesFormValues) {
            const formValues = JSON.parse(blenderFilesFormValues);
            this.fg.patchValue(formValues);
        }
    }

    selectDirectory(): void {
        const opts: Electron.OpenDialogOptions = {
            properties: ['openDirectory'],
        };
        from(this.electron.openFileOrFolderDialog(opts)).subscribe(
            (result: Electron.OpenDialogReturnValue) => {
                console.log('result: ', result);
            },
        );
    }

    saveDriveFile(driveFile: DriveFile) {
        const rawValue = this.fg.getRawValue();
        this.appService
            .saveFile(JSON.stringify(driveFile, null, 2), `${rawValue.drive}/`, BLENDER_FILES_DRIVE_FILE)
            .subscribe();
    }

    refresh() {
        this.dt?.reset();
    }

    onPage($event) {
        // console.log("$event: ", $event);
    }

    copyLocationToClipboard(file: IFile): void {
        navigator.clipboard.writeText(file.fileLocation);
    }

    openFileLocation(file: IFile) {
        this.highlightRecent(file);
        this.ngxElectron.shell.openPath(file.fileLocation);
    }

    openFile(file: IFile) {
        this.highlightRecent(file);
        this.ngxElectron.shell.openPath(file.filepath);
    }

    openPic(file: IFile, imageId: string) {
        const data: { images: ImagePath[]; id: string } = {
            images: file.images,
            id: imageId,
        };
        this.dialog.open(SeeImageComponent, {
            width: '100vw',
            height: '100vh',
            data,
        });
    }

    stop(): void {
        this.blenderFinder.isChecking = false;
    }

    findBlenderFiles(): void {
        this.files = [];
        const rawValue = this.fg.getRawValue();

        this.blenderFinder
            .findInDrive(`${rawValue.drive}/`)
            .pipe(finalize(() => this.onSearchFinished()))
            .subscribe(files => this.onTableDataLoaded(files));

        //     .pipe(
        //         filter(file => !!file),
        //         tap(file => {
        //             console.log('this.files[' + this.files.length + '] <- transformedFile: ', file);

        //             this.files.push(file);
        //         }),
        //         finalize(() => this.onSearchFinished()),
        //     )
        //     .subscribe();
    }

    findImages(): void {
        if (!this.files) return;

        const observables = this.files.map(file =>
            of(file).pipe(
                switchMap(file =>
                    from(BlenderFinderAsync.readDirectory(file.fileLocation)).pipe(
                        switchMap(filenamesInDir => {
                            const imagesPaths = filenamesInDir
                                .filter(filename =>
                                    IMAGE_EXTS.some(ext => filename.toLowerCase().endsWith(ext)),
                                )
                                .map(filename => `${(file.fileLocation + filename).replace(/\\/g, '/')}`);
                            return forkJoin(imagesPaths.map(imgp => this.resizeToThumbnail(imgp)));
                        }),
                        map(imagesInDir => {
                            const images = imagesInDir.map(img => {
                                return {
                                    id: crypto.randomUUID(),
                                    path: `safe-file://${img.filepath}`,
                                    thumbnail: img.data,
                                } as ImagePath;
                            });
                            return {
                                ...file,
                                hasPic: !!images && images.length > 0,
                                images,
                            };
                        }),
                    ),
                ),
                takeUntil(this.destroyed$),
            ),
        );

        merge(...observables)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(completeFile => {
                this.zone.run(() => {
                    const index = this.files.findIndex(f => f.id === completeFile.id);
                    this.files[index].images = completeFile.images;
                    this.files[index].hasPic = completeFile.hasPic;
                });
            });
    }

    private onSearchFinished(): void {
        this.blenderFinder.isChecking = false;

        const driveFile: DriveFile = {
            lastCheckupDate: new Date().toISOString(),
            files: this.blenderFinder.rawFiles,
        };
        this.saveDriveFile(driveFile);
    }

    private onTableDataLoaded(rawFiles: RawFile[]): void {
        this.files = rawFiles.map(rawFile => {
            const file = BlenderFinderAsync.toFile(rawFile);
            if (!file) return { ...rawFile, ...defaultIFile, name: `DELETED ? ${rawFile.name}` };
            return file;
        });
    }

    private highlightRecent(file: IFile) {
        this.files.forEach(f => (f.recentlyOpened = false));
        const index = this.files.findIndex(f => f.name === file.name);
        this.files[index].recentlyOpened = true;
    }

    private unsubscribe() {
        this.destroyed$.complete();
        this.destroyed$.unsubscribe();
    }

    private resizeToThumbnail(filepath: string): Observable<{ filepath: string; data: string }> {
        const loaded = this.electron.sharp(filepath);

        return from(loaded.resize(64, 64).toBuffer()).pipe(
            map(buffer => ({
                filepath,
                data: 'data:image/png;base64,' + buffer.toString('base64'),
            })),
        );
    }

    ngOnDestroy() {
        this.unsubscribe();
    }
}
