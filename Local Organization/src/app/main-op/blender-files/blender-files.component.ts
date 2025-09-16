import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElectronService as NgxElectronService } from 'ngx-electronyzer';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Observable, Subject, from, of } from 'rxjs';
import { filter, finalize, switchMap, tap } from 'rxjs/operators';
import { AppService } from '../../app.service';
import { ElectronService } from '../../core/services';
import { SeeImageComponent } from '../../shared/components/see-image/see-image.component';
import { LabelValue } from '../../shared/model';
import { defaultIFile, DriveFile, IFile } from '../../shared/model/DriveFile';
import { FILTER_TYPE, blenderFilesCols } from './blender-files.constants';
import { BLENDER_FILES_DRIVE_FILE, BlenderFilesService } from './blender-files.service';
import { BlenderFinderAsync } from './blender-finder-async';
import { BlenderFinder } from './blender-finder';

const FORM_VALUE_KEY = 'blender-files-form-values';

@Component({
    selector: 'app-blender-files',
    standalone: true,
    imports: [
        NgIf,
        NgForOf,
        NgStyle,
        NgClass,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        TableModule,
    ],
    templateUrl: './blender-files.component.html',
    styleUrls: ['./blender-files.component.scss'],
})
export class BlenderFilesComponent implements OnDestroy {
    FILTER_TYPE = FILTER_TYPE;
    cols = blenderFilesCols;

    @ViewChild('tableRef') tableRef: any;

    fg: FormGroup;
    // blenderFinder = new BlenderFinderAsync('.blend');
    blenderFinder = new BlenderFinder('.blend');
    files: IFile[] = [];
    drives: LabelValue<string>[] = [];

    private destroyed$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
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

        const blenderFilesFormValues = localStorage.getItem(FORM_VALUE_KEY);
        if (blenderFilesFormValues) {
            const formValues = JSON.parse(blenderFilesFormValues);
            this.fg.patchValue(formValues);
        }

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
                this.files = driveFile.files.map((f, i) => {
                    const file = BlenderFinderAsync.toFile(f, i);
                    if (!file) return { ...f, ...defaultIFile, name: `DELETED ? ${f.name}` };
                    return file;
                });
            });
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
        this.tableRef?.reset();
    }

    onPage($event) {
        // console.log("$event: ", $event);
    }

    openFileLocation(file) {
        this.highlightRecent(file);

        // this.openLib(file.fileLocation);

        // TODO: replace above with below

        // const mainPath = "D:\\Downloads\\";
        // const path =
        //     mainPath + "Pics 10_2_2016\\storm_chaser_by_kypcaht-d5flwfq.jpg";
        // this.ngxElectronService.shell.openItem(path);
    }

    openFile(file) {
        this.highlightRecent(file);

        // this.openLib(file.filename);

        // TODO: replace above with below

        // const mainPath = "D:\\Downloads\\";
        // const path =
        //     mainPath + "Pics 10_2_2016\\storm_chaser_by_kypcaht-d5flwfq.jpg";
        // this.ngxElectronService.shell.openItem(path);
    }

    openPic(file) {
        this.dialog.open(SeeImageComponent, {
            width: '100vw',
            // maxWidth: "100vw",
            height: '100vh',
            data: { file: file },
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
            .subscribe(
                files =>
                    (this.files = files.map((f, i) => {
                        return BlenderFinderAsync.toFile(f, i);
                    })),
            );

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

    private onSearchFinished(): void {
        this.blenderFinder.isChecking = false;

        const driveFile: DriveFile = {
            lastCheckupDate: new Date().toISOString(),
            files: this.blenderFinder.rawFiles,
        };
        this.saveDriveFile(driveFile);
    }

    readHasPic(picUrl, index: number): Observable<{ hasPic: boolean; index: number; err?: any }> {
        return from(
            new Promise<{ hasPic: boolean; index: number; err?: any }>((resolve, reject) => {
                const formatedPicUrl = picUrl.replace('file://', '');
                const f_ok = ElectronService.FS.constants.F_OK;
                return ElectronService.FS.access(formatedPicUrl, f_ok, err => {
                    const hasPic = err ? false : true;
                    // console.log("[" + formatedPicUrl + "] hasPic: ", false);
                    if (hasPic) {
                        resolve({ hasPic, index });
                        return of({ hasPic, index });
                    }
                    reject({ err, index });
                });
            }),
        );
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

    ngOnDestroy() {
        this.unsubscribe();
    }
}
