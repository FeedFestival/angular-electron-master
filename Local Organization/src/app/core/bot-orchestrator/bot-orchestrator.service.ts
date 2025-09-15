import { Injectable } from '@angular/core';
import { ElectronService } from '../services';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BotOrchestratorService {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly electronService: ElectronService
    ) {}

    openChrome(): Observable<unknown> {
        return this.httpClient.get('http://localhost:3000/open-chrome');
    }

    // async runCurl(): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         this.childProcess.exec('curl http://localhost:3000/open-chrome');
    //     });
    // }
}
