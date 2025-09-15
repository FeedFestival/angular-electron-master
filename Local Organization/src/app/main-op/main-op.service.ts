import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, shareReplay, Subject, switchMap, tap } from 'rxjs';
import { AppService, SUCCESS } from '../app.service';
import { ItemDef, ItemInfo, ItemsRevision } from './main-op.models';
import { ElectronService } from '../core/services';
import { DB } from '../shared/model/DB';

@Injectable({ providedIn: 'root' })
export class MainOpService {
    constructor(private readonly appService: AppService) {}

    writeUsers(): Observable<string> {
        /* use the decoded one and modify it */
        const db = {
            t3ddy_b34rs: { /* PASTE t3ddy_b34rs.json */ },
        };
        console.log('db: ', db);
        const base64 = btoa(JSON.stringify(db, null, 2));
        console.log('base64: ', base64);
        return this.saveDb(base64);
    }

    getDeviceName(): Observable<string> {
        return new Observable<string>(subscriber => {
            // spawn cmd.exe with echo command
            const child = ElectronService.PROCESS.spawn('cmd', ['/c', 'echo %COMPUTERNAME%'], {
                windowsHide: true,
            });

            let output = '';

            child.stdout.on('data', (data: Buffer) => {
                output += data.toString();
            });

            child.stderr.on('data', (err: Buffer) => {
                subscriber.error(err.toString());
            });

            child.on('close', () => {
                const result = output.trim();
                subscriber.next(result);
                subscriber.complete();
            });

            child.on('error', (err: Error) => {
                subscriber.error(err);
            });
        });
    }

    private saveDb(dbstring: string): Observable<string> {
        const relativeProjectPath = './content/legacy/_USERS/DB/';
        const postingfile = `export const db = {
    m4m4_b34r: "${dbstring}",
    t3ddy_b34rs: {
        danceim: {
            email: '...',
        },
    },
};
`;
        const absolutePath = ElectronService.PATH.resolve(relativeProjectPath);
        return this.appService.saveFile(postingfile, absolutePath, 'db', 'ts');
    }
}
