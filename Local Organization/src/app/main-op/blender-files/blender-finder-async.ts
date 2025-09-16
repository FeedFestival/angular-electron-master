import {
    concatAll,
    concatMap,
    distinct,
    EMPTY,
    from,
    map,
    Observable,
    of,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { ElectronService } from '../../core/services';
import { FilePathCheck, getNameFromFilepath, IFile, RawFile } from '../../shared/model/DriveFile';
import { EXCLUDE_LIST } from './blender-files.constants';
import { Stats } from 'fs';

export class BlenderFinderAsync {
    rawFiles: RawFile[] = [];
    isChecking = false;

    fileCount: number = 0;

    private fileFilter = '.blend';
    private destroyed$ = new Subject<void>();

    constructor(fileFilter: string) {
        this.fileFilter = fileFilter;
    }

    findInDrive(drive: string): Observable<any> {
        this.rawFiles = [];
        this.isChecking = true;

        return of(drive).pipe(
            switchMap(drive => this.readDirectory(drive)),
            concatAll(),
            concatMap(fullPath => this.handleFileOrFolder(`${drive}${fullPath}`)),
        );
    }

    private findAllDirectories(path: string): Observable<IFile> {
        const isExcludedFromSearch = EXCLUDE_LIST.some(excluded => path.indexOf(excluded) >= 0);

        if (isExcludedFromSearch) return of(undefined);

        return from(this.readDirectory(path)).pipe(
            takeUntil(this.destroyed$),
            concatMap(filePaths => {
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
            } else if (filepath.indexOf(this.fileFilter) >= 0) {
                const { exists, skip, rawFile } = this.getRawFile(filepath);

                if (exists || skip) return of(undefined);

                return of(BlenderFinderAsync.toFile(rawFile, this.fileCount));
            }
        } catch (e) {}
        return of(undefined);
    }

    private getRawFile(filepath: string): { exists?: boolean; skip?: boolean; rawFile?: RawFile } {
        const name = getNameFromFilepath(filepath);
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

    static toFile(rawFile: RawFile, index: number): IFile {
        const foldersTo = rawFile.filepath.split('\\');
        const name = foldersTo[foldersTo.length - 1];
        const fileLocation = rawFile.filepath.replace(name, '');
        let picUrl = fileLocation + 'SEEME.PNG';
        picUrl = picUrl.replace(/\\/g, '/');
        picUrl = 'file://' + picUrl;

        let stats: Stats;
        try {
            stats = ElectronService.FS.statSync(rawFile.filepath);
        } catch (e) {
            return undefined;
        }

        const file: IFile = {
            ...rawFile,
            date: BlenderFinderAsync.toDateString(stats.birthtime),
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

    static toDateString(date: Date) {
        let dateString = 'yyyy-mm-dd';

        dateString = dateString.replace('yyyy', this.pad(date.getFullYear(), 2).toString());
        dateString = dateString.replace('mm', this.pad(date.getMonth(), 2).toString());
        dateString = dateString.replace('dd', this.pad(date.getDate(), 2).toString());

        return dateString;
    }

    static pad(n, width, z?) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}
