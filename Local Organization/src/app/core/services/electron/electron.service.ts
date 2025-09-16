import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import * as childProcess from 'child_process';
import { ipcRenderer, webFrame } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { from, Observable } from 'rxjs';
import sharp from 'sharp';

export type FSType = typeof fs;
export type PathType = typeof path;
export type ChildProcessType = typeof childProcess;

@Injectable({
    providedIn: 'root',
})
export class ElectronService {
    ipcRenderer!: typeof ipcRenderer;
    webFrame!: typeof webFrame;
    childProcess!: typeof childProcess;
    fs!: typeof fs;
    path!: typeof path;
    sharp!: typeof sharp;

    duringServerKill = false;

    static FS: FSType;
    static PATH: PathType;
    static PROCESS: ChildProcessType;

    constructor() {
        // Conditional imports
        if (this.isElectron) {
            this.ipcRenderer = (window as any).require('electron').ipcRenderer;
            this.webFrame = (window as any).require('electron').webFrame;

            this.fs = (window as any).require('fs');
            ElectronService.FS = this.fs;
            console.log('FS Loaded');
            this.path = (window as any).require('path');
            ElectronService.PATH = this.path;
            console.log('PATH Loaded');
            
            this.sharp = (window as any).require('sharp');

            this.childProcess = (window as any).require('child_process');
            ElectronService.PROCESS = this.childProcess;
            this.childProcess.exec('node -v', (error, stdout, stderr) => {
                if (error) {
                    console.error(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout:\n${stdout}`);
            });

            // Notes :
            // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
            // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
            // because it will loaded at runtime by Electron.
            // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
            // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
            // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

            // If you want to use a NodeJS 3rd party deps in Renderer process,
            // ipcRenderer.invoke can serve many common use cases.
            // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
        }
    }

    getDriveList(): Observable<string[]> {
        return from(
            new Promise((resolve, reject) => {
                this.childProcess.exec('wmic logicaldisk get name', (err, stdout) => {
                    if (err) return reject(err);
                    const drives = stdout
                        .split('\r\n')
                        .filter(line => line.trim().endsWith(':'))
                        .map(line => line.trim());
                    resolve(drives);
                });
            }),
        ) as Observable<string[]>;
    }

    async openFileOrFolderDialog(
        options: Electron.OpenDialogOptions,
    ): Promise<Electron.OpenDialogReturnValue> {
        if (this.isElectron) {
            return await this.ipcRenderer.invoke('open-dialog', options);
        } else {
            throw new Error('Not running in Electron');
        }
    }

    get isElectron(): boolean {
        return !!(window && window.process && window.process.type);
    }

    async runCurl(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.childProcess.exec('curl http://localhost:3000/open-chrome');
        });
    }

    killPids(pids: number[]): Observable<boolean> {
        this.duringServerKill = true;
        return from(
            new Promise<boolean>(resolve => {
                pids.forEach(pid => {
                    const killCmd = `taskkill /PID ${pid} /F`;
                    this.childProcess.exec(killCmd);
                });
                resolve(true);
            }),
        );
    }

    async runScript(
        script: 'server' | 'open-chrome' | 'simple-post' | 'like-post' | 'comment-on-post',
        project: 'simple-post' | 'image-recognition' = 'simple-post',
    ): Promise<string> {
        const scriptPath = this.path.resolve(`../${project}`);

        return new Promise((resolve, reject) => {
            const child = this.childProcess.spawn('node', ['--loader', 'ts-node/esm', `run/${script}.ts`], {
                cwd: scriptPath,
                shell: true,
            });

            let output = '';
            child.stdout.on('data', data => {
                output += data.toString();

                const trimmed = data.toString().trim();
                console.log('SCRIPT:', trimmed);

                if (trimmed === 'FINISHED') {
                    // Remove listeners
                    child.stdout.removeAllListeners();
                    child.stderr.removeAllListeners();
                    child.removeAllListeners('close');

                    // Detach from parent
                    if (!child.killed) {
                        child.unref();
                    }
                    child.kill();
                    resolve('');
                    return;
                }
            });

            child.stderr.on('data', data => {
                console.error('SCRIPT ERROR:', data.toString().trim());
            });

            child.on('close', code => {
                if (code === 0) {
                    console.log('Script finished successfully');
                    resolve(output);
                } else {
                    reject(this.duringServerKill ? undefined : new Error(`Script exited with code ${code}`));
                }
            });
        });
    }

    getPortPIDS(port: number): Observable<number[] | undefined> {
        return from(
            new Promise<number[] | undefined>(resolve => {
                const findCmd = `netstat -ano | findstr :${port} | findstr LISTENING`;
                this.childProcess.exec(findCmd, (error, stdout, stderr) => {
                    if (error || !stdout) {
                        console.log(`✅ No process found on port ${port}`);
                        resolve(undefined);
                        return;
                    }

                    console.log(stdout);

                    // Parse PID from netstat output (last column)
                    const lines = stdout.trim().split('\n');
                    const pids = lines
                        .map(line => line.trim().split(/\s+/).pop())
                        .filter(pid => pid && !isNaN(Number(pid)))
                        .map(pid => Number(pid));

                    if (!pids.length) {
                        console.log(`⚠️ Could not extract PID for port ${port}`);
                        resolve(undefined);
                        return;
                    }

                    resolve(pids);
                });
            }),
        );
    }
}
