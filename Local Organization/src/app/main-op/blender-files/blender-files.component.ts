import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElectronService as NgxElectronService } from 'ngx-electronyzer';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { EMPTY, Observable, Subject, from, of } from 'rxjs';
import {
    catchError,
    concatAll,
    concatMap,
    delay,
    distinct,
    map,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs/operators';
import { AppService } from '../../app.service';
import { ElectronService } from '../../core/services';
import { SeeImageComponent } from '../../shared/components/see-image/see-image.component';
import { LabelValue } from '../../shared/model';
import { DriveFile, FileCheck, FilePathCheck, IFile, RawFile } from '../../shared/model/DriveFile';
import { EXCLUDE_LIST, FILTER_TYPE, blenderFilesCols } from './blender-files.constants';
import { BLENDER_FILES_DRIVE_FILE, BlenderFilesService } from './blender-files.service';

const FORM_VALUE_KEY = 'blender-files-form-values';

const FILE_FILTER = '.blend';

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

    fileCount: number = 0;
    checkedFiles: number = 0;
    isChecking = false;
    directories: any[];

    drives: LabelValue<string>[] = [];
    rawFiles: RawFile[] = [];
    files: IFile[] = [];
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

        //
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
                    return this.toFile(f, i);
                });
                this.fileCount = this.files.length;
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
        this.isChecking = false;
    }

    findBlenderFiles(): void {
        this.rawFiles = [];
        this.files = [];

        const rawValue = this.fg.getRawValue();
        this.isChecking = true;
        of(rawValue.drive)
            .pipe(
                switchMap(drive => this.readDirectory(`${drive}/`)),
                concatAll(),
                concatMap(fullPath => this.handleFileOrFolder(`${rawValue.drive}/${fullPath}`)),
                tap(file => {
                    if (!file) return;

                    console.log('this.files[' + this.files.length + '] <- transformedFile: ', file);

                    this.files.push(file);
                    this.fileCount = this.files.length;
                }),
            )
            .subscribe(() => {
                const driveFile: DriveFile = {
                    lastCheckupDate: new Date().toISOString(),
                    files: this.rawFiles,
                };
                this.saveDriveFile(driveFile);
            });
    }

    private findAllDirectories(path: string): Observable<IFile> {
        const isExcludedFromSearch = EXCLUDE_LIST.some(excluded => path.indexOf(excluded) >= 0);

        if (isExcludedFromSearch) return of(undefined);

        return from(this.readDirectory(path)).pipe(
            takeUntil(this.destroyed$),
            concatMap(filePaths => {
                this.checkedFiles++;

                if (!this.isChecking) return EMPTY;

                return this.checkAndAddDirectory({ filePaths, startPath: path });
            }),
        );
    }

    private checkAndAddDirectory(filePathCheck: FilePathCheck): Observable<IFile> {
        if (!filePathCheck?.filePaths) {
            return of(undefined);
        }

        return from(filePathCheck.filePaths).pipe(
            map(f => ElectronService.PATH.join(filePathCheck.startPath, f)),
            distinct(),
            concatMap(filepath => this.handleFileOrFolder(filepath)),
        );
    }

    private handleFileOrFolder(filepath: string): Observable<IFile> {
        console.log('filepath: ', filepath);
        try {
            var stat = ElectronService.FS.lstatSync(filepath);
            if (stat.isDirectory()) {
                return this.findAllDirectories(filepath);
            } else if (filepath.indexOf(FILE_FILTER) >= 0) {
                const { exists, skip, rawFile } = this.getRawFile(filepath);

                if (exists || skip) return of(undefined);

                return of(this.toFile(rawFile, this.fileCount));
            }
        } catch (e) {}
        return of(undefined);
    }

    private getRawFile(filepath: string): { exists?: boolean; skip?: boolean; rawFile?: RawFile } {
        const foldersTo = filepath.split('\\');
        const name = foldersTo[foldersTo.length - 1];
        const nameSplit = name.split('.');
        const ext = nameSplit[nameSplit.length - 1];

        const skip = ext !== 'blend';
        if (skip) return { skip };

        const exists = this.rawFiles.findIndex(f => f.name === name) >= 0;
        if (exists) return { exists };

        const rawFile: RawFile = {
            name,
            filepath,
        };
        this.rawFiles.push(rawFile);

        return { rawFile };
    }

    private toFile(rawFile: RawFile, index: number): IFile {
        const foldersTo = rawFile.filepath.split('\\');
        const name = foldersTo[foldersTo.length - 1];
        const fileLocation = rawFile.filepath.replace(name, '');
        let picUrl = fileLocation + 'SEEME.PNG';
        picUrl = picUrl.replace(/\\/g, '/');
        picUrl = 'file://' + picUrl;

        const stats = ElectronService.FS.statSync(rawFile.filepath);

        const file: IFile = {
            ...rawFile,
            date: this.toDateString(stats.birthtime),
            picUrl,
            hasPic: false,
            fileLocation,
        };

        // this.readHasPic(picUrl, index)
        //     .pipe(
        //         tap(res => {
        //             // console.log("hasPic$ . map -> res: ", res);
        //             this.files[res.index].hasPic = res.hasPic;
        //         }),
        //         map(res => res.hasPic),
        //         catchError(res => {
        //             console.warn('err: ', res.err);
        //             this.files[res.index].hasPic = res.hasPic;
        //             return of(false);
        //         }),
        //     )
        //     .subscribe();

        return file;
    }

    private readDirectory(path): Promise<string[]> {
        return new Promise((resolve, reject) => {
            try {
                return ElectronService.FS.readdir(path, (err, filenames) => {
                    if (err != null) {
                        // reject(err);
                        resolve([]);
                    } else {
                        resolve(filenames);
                    }
                });
            } catch (e) {
                resolve([]);
            }
        });
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

    private toDateString(date: Date) {
        let dateString = 'yyyy-mm-dd';

        dateString = dateString.replace('yyyy', this.pad(date.getFullYear(), 2).toString());
        dateString = dateString.replace('mm', this.pad(date.getMonth(), 2).toString());
        dateString = dateString.replace('dd', this.pad(date.getDate(), 2).toString());

        return dateString;
    }

    private pad(n, width, z?) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    private unsubscribe() {
        this.destroyed$.complete();
        this.destroyed$.unsubscribe();
    }

    ngOnDestroy() {
        this.unsubscribe();
    }
}
