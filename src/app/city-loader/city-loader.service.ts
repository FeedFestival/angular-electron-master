import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({ providedIn: 'root' })
export class CityLoaderService {
	//
	private subject: Subject<any> = new Subject();
	workBook!: XLSX.WorkBook;

	private checkFirstRow = true;
	private _attributesMapping!: any;

	constructor(private http: HttpClient) {}

	getLocalSheets(name: string) {
		const filename = 'http://localhost:4200' + '/assets/docs/' + name;
		this.http
			.get(filename, { responseType: 'blob' })
			.subscribe((file: any) => {
				let fileReader = new FileReader();
				fileReader.onload = (e: any) => {
					const data = new Uint8Array((fileReader.result as any));
					const arr = new Array();
					for (var i = 0; i != data.length; ++i)
						arr[i] = String.fromCharCode(data[i]);
					var bstr = arr.join('');
					this.workBook = XLSX.read(bstr, { type: 'binary' });
					//
					this.subject.next(this.workBook.SheetNames);
					this.subject.complete();
				};
				fileReader.readAsArrayBuffer(file);
			});
		return this.subject.asObservable();
	}

	getSheetContent(worksheetId: string, attributesMapping: any) {

		const worksheet = this.workBook.Sheets[worksheetId];
		const jsonWorksheet = XLSX.utils.sheet_to_json(worksheet, {
			raw: true,
		});
		this._attributesMapping = attributesMapping;
		const items: any[] = [];
		jsonWorksheet.forEach((entry: any) => {
			const obj: any = {};
			this._attributesMapping.forEach((attr: any) => {
				obj[attr.model] = entry[attr.sheet];
			});
			items.push(obj);
		});
		return items;
	}
}
