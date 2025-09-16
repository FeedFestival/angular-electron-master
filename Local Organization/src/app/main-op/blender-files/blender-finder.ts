import { Stats } from 'fs';
import { Observable, of, tap } from 'rxjs';
import { ElectronService } from '../../core/services';
import { getNameFromFilepath, RawFile } from '../../shared/model/DriveFile';
import { EXCLUDE_LIST } from './blender-files.constants';

export class BlenderFinder {
    rawFiles: RawFile[] = [];
    isChecking = false;

    fileCount: number = 0;

    private fileFilter = '.blend';

    constructor(fileFilter: string) {
        this.fileFilter = fileFilter;
    }

    findInDrive(drive: string): Observable<RawFile[]> {
        this.isChecking = true;
        return of(this.findBlendFiles(drive)).pipe(
            tap(files => {
                this.rawFiles = files;
                this.fileCount = this.rawFiles.length;
            }),
        );
    }

    findBlendFiles(dir: string, results: RawFile[] = []): RawFile[] {
        let entries: string[];

        try {
            entries = ElectronService.FS.readdirSync(dir);
        } catch (err) {
            // Skip folders we can't read (permissions, symlinks, etc.)
            return results;
        }

        for (const entry of entries) {
            const fullPath = ElectronService.PATH.join(dir, entry);

            let stat: Stats;
            try {
                stat = ElectronService.FS.lstatSync(fullPath);
            } catch {
                continue; // skip broken symlinks or unreadable entries
            }

            if (stat.isDirectory()) {
                // 🔹 Check exclude list before recursing
                const isExcluded = EXCLUDE_LIST.some(excluded =>
                    fullPath.toLowerCase().includes(excluded.toLowerCase()),
                );
                if (isExcluded) {
                    continue; // skip this folder and its children
                }

                // recurse into subdirectory
                this.findBlendFiles(fullPath, results);
            } else if (stat.isFile() && fullPath.toLowerCase().endsWith(this.fileFilter)) {
                const rawFile: RawFile = {
                    id: crypto.randomUUID(),
                    name: getNameFromFilepath(fullPath),
                    filepath: fullPath,
                };
                results.push(rawFile);
            }
        }

        return results;
    }
}
