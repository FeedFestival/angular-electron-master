import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription, from, of } from 'rxjs';
import { catchError, concatAll, debounceTime, delay, map, takeUntil, tap } from 'rxjs/operators';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { ElectronService as NgxElectronService } from 'ngx-electronyzer';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ElectronService } from '../../core/services';
import { SeeImageComponent } from '../../shared/components/see-image/see-image.component';
import { BLENDER_DIRS, DELAY_IN_SEARCHING, FILTER_TYPE, blenderFilesCols } from './blender-files.constants';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-blender-files',
    standalone: true,
    imports: [NgIf, NgForOf, NgStyle, ButtonModule, InputTextModule, TableModule],
    templateUrl: './blender-files.component.html',
    styleUrls: ['./blender-files.component.scss'],
})
export class BlenderFilesComponent implements OnInit, OnDestroy {
    FILTER_TYPE = FILTER_TYPE;
    cols = blenderFilesCols;

    @ViewChild('tableRef') tableRef: any;
    // filteredFiles = [];
    fileCount: number = 0;
    checkedFiles: number = 0;
    lastFilesChecked = [];
    directories: any[];

    stopAfterCount = 999;
    stop = false;

    files: any[] = [];
    private ngDestroyed$ = new Subject<void>();
    private recheckDirs$: Subscription;
    private readDirectory$: Subscription;
    private checkAndAddDirectory$: Subscription;

    constructor(
        private dialog: DialogService,
        private electron: ElectronService,
        private ngxElectron: NgxElectronService,
    ) {}

    ngOnInit() {
        if (!this.electron.fs.existsSync(BLENDER_DIRS.SAVE)) {
            return;
        }
    }

    loadFromJson() {
        ElectronService.FS.readFile(BLENDER_DIRS.SAVE + '/' + BLENDER_DIRS.SAVE_FILE, (err, data) => {
            if (err) return console.log(err);
            const jsonData = JSON.parse(data as any);
            this.files = [];
            jsonData.files.forEach(loadedFile => {
                loadedFile.isLoadedFile = true;
                this.files.push(loadedFile);
            });
            this.fileCount = this.files.length;
        });
    }

    saveToJson() {
        if (!ElectronService.FS.existsSync(BLENDER_DIRS.SAVE)) {
            ElectronService.FS.mkdirSync(BLENDER_DIRS.SAVE);
        }

        const filesJson = {
            lastCheck: new Date().getMilliseconds(),
            files: this.files,
            // .map(f => ({ ...f, hasPic$: null })),
        };

        const path = BLENDER_DIRS.SAVE + '/' + BLENDER_DIRS.SAVE_FILE;
        const content = JSON.stringify(filesJson);
        ElectronService.FS.writeFileSync(path, content);
    }

    cancel() {
        this.stop = true;
        this.unsubscribe();
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

    recheck() {
        this.files = [];

        const dirs = BLENDER_DIRS.CHECK.map(checkFolder => of(checkFolder)) as any[];
        this.recheckDirs$ = from(dirs)
            .pipe(
                takeUntil(this.ngDestroyed$),
                concatAll(),
                tap(checkFolder => {
                    if (this.stop) {
                        this.recheckDirs$.unsubscribe();
                        return;
                    }

                    console.log('0. checkFolder: ', checkFolder);
                    this.findAllDirectories(checkFolder);
                }),
            )
            .subscribe();
    }

    private findAllDirectories(path) {
        // console.log("1. findAllDirectories -> ");
        this.readDirectory$ = from(this.readDirectory(path))
            .pipe(
                takeUntil(this.ngDestroyed$),
                debounceTime(DELAY_IN_SEARCHING),
                tap(files => {
                    if (this.stop) {
                        this.readDirectory$.unsubscribe();
                        return;
                    }

                    // console.log("2. readDirectory -> ", files);
                    this.checkedFiles++;
                    if (this.lastFilesChecked.length > 4) {
                        this.lastFilesChecked.splice(this.lastFilesChecked.length - 1, 1);
                    }
                    this.lastFilesChecked.unshift(path);
                    this.checkAndAddDirectory({ files, options: { startPath: path, filter: '.blend' } });
                }),
            )
            .subscribe();
    }

    private checkAndAddDirectory(filesOps: any) {
        if (!filesOps?.files) {
            return;
        }

        const filesObs = filesOps.files.map(f =>
            of({
                filename: ElectronService.PATH.join(filesOps.options.startPath, f),
                options: filesOps.options,
            }).pipe(takeUntil(this.ngDestroyed$), delay(DELAY_IN_SEARCHING / 2)),
        ) as any[];

        // console.log("filesObs => " + filesObs.length);

        this.checkAndAddDirectory$ = from(filesObs)
            .pipe(
                takeUntil(this.ngDestroyed$),
                concatAll(),
                tap(file => {
                    if (this.stop) {
                        this.checkAndAddDirectory$.unsubscribe();
                        return;
                    }
                    // console.log("---- 3. handleFoundFile -> ", file);
                    this.handleFoundFile(file);
                }),
            )
            .subscribe();
    }

    private handleFoundFile(file: any) {
        var stat = ElectronService.FS.lstatSync(file.filename);
        if (stat.isDirectory()) {
            this.findAllDirectories(file.filename);
        } else if (file.filename.indexOf(file.options.filter) >= 0) {
            const stats = ElectronService.FS.statSync(file.filename);
            const birth = this.toDateString(stats.birthtime);
            const foldersTo = file.filename.split('\\');
            const name = foldersTo[foldersTo.length - 1];
            const nameSplit = name.split('.');
            const ext = nameSplit[nameSplit.length - 1];
            if (ext !== 'blend') {
                const existsAllready = this.files.some(
                    f => f.filename === file.filename.substring(0, file.filename.length - 1),
                );
                if (existsAllready) {
                    return;
                }
            }
            const foundFile = {
                name: name,
                filename: file.filename,
                birth: birth,
            };

            this.fileCount = this.files.length;
            const transformedFile = this.transformFile(foundFile, this.fileCount);
            // console.log("this.files[" + this.files.length + "] <- transformedFile: ", transformedFile);

            this.files.push(transformedFile);

            if (this.fileCount > this.stopAfterCount) {
                this.stop = true;
            }

            this.refresh();
        }
    }

    private transformFile(f, index) {
        const foldersTo = f.filename.split('\\');
        const name = foldersTo[foldersTo.length - 1];
        const fileLocation = f.filename.replace(name, '');
        let picUrl = fileLocation + 'SEEME.PNG';
        picUrl = picUrl.replace(/\\/g, '/');
        picUrl = 'file://' + picUrl;
        const file = {
            ...f,
            picUrl,
            hasPic: false,
            fileLocation,
        };
        this.readHasPic(picUrl, index)
            .pipe(
                tap(res => {
                    // console.log("hasPic$ . map -> res: ", res);
                    this.files[res.index].hasPic = res.hasPic;
                }),
                map(res => res.hasPic),
                catchError(res => {
                    console.warn('err: ', res.err);
                    this.files[res.index].hasPic = res.hasPic;
                    return of(false);
                }),
            )
            .subscribe();
        return file;
    }

    private readDirectory(path): Promise<any[]> {
        return new Promise((resolve, reject) => {
            return ElectronService.FS.readdir(path, (err, filenames) => {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(filenames);
                }
            });
        });
    }

    readHasPic(picUrl, index: number): Observable<{ hasPic: boolean; index: number; err?: any }> {
        return from(
            new Promise<{ hasPic: boolean; index: number; err?: any }>((resolve, reject) => {
                const formatedPicUrl = picUrl.replace('file://', '');
                // const f_ok = ElectronService.FS.F_OK;
                const f_ok = 0;
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

    private highlightRecent(file) {
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
        this.ngDestroyed$.complete();
        this.ngDestroyed$.unsubscribe();
    }

    ngOnDestroy() {
        this.unsubscribe();
    }
}
