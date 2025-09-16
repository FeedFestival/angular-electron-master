import { Injectable } from '@angular/core';
import { ElectronService } from '../../core/services';
import { map, Observable } from 'rxjs';
import { AppService } from '../../app.service';
import { DriveFile } from '../../shared/model/DriveFile';

export const BLENDER_FILES_DRIVE_FILE = 'blender-files-local-org';

@Injectable({ providedIn: 'root' })
export class BlenderFilesService {
    constructor(private readonly electron: ElectronService) {}

    createDefaultDriveFile(driveLocation: string): Observable<DriveFile> {
        const defaultDriveFile: DriveFile = {
            lastCheckupDate: new Date().toISOString(),
            files: [],
        };
        return AppService.saveFile(
            JSON.stringify(defaultDriveFile, null, 2),
            driveLocation,
            BLENDER_FILES_DRIVE_FILE,
        ).pipe(map(() => defaultDriveFile));
    }
}
