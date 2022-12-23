import { Component, OnInit, ViewChild } from "@angular/core";
import { ElectronService } from "../core/services";
import {
    blenderFilesCols,
    BLENDER_DIRS,
    FILTER_TYPE,
} from "./blender-files.constants";

@Component({
    selector: "app-blender-files",
    templateUrl: "./blender-files.component.html",
    styleUrls: ["./blender-files.component.scss"],
})
export class BlenderFilesComponent implements OnInit {
    fs: any;
    fse: any;
    path: any;
    openLib: any;
    //
    files: any[];
    name: any;

    FILTER_TYPE = FILTER_TYPE;
    cols = blenderFilesCols;

    @ViewChild("tableRef") tableRef: any;

    constructor(private _electronService: ElectronService) {}

    ngOnInit() {
        this.fs = this._electronService.remote.require("fs");
        this.fse = this._electronService.remote.require("fs-extra");
        this.path = this._electronService.remote.require("path");
        this.openLib = this._electronService.remote.require("open");

        if (!this.fs.existsSync(BLENDER_DIRS.SAVE)) {
            return;
        }

        this.load();
    }

    load() {
        this.fs.readFile(
            BLENDER_DIRS.SAVE + "/" + BLENDER_DIRS.SAVE_FILE,
            (err, data) => {
                if (err) return console.log(err);

                const jsonData = JSON.parse(data);
                this.files = jsonData.files;

                this.files.forEach(f => {
                    f.fileLocation = f.filename;

                    const foldersTo = f.filename.split("\\");
                    const name = foldersTo[foldersTo.length - 1];
                    f.fileLocation = f.fileLocation.replace(name, '');
                });

                this.recheckImages();
            }
        );
    }

    recheck() {
        this.files = [];
        BLENDER_DIRS.CHECK.forEach((checkFolder) => {
            this.fromDir(checkFolder, ".blend");
        });

        if (!this.fs.existsSync(BLENDER_DIRS.SAVE)) {
            this.fs.mkdirSync(BLENDER_DIRS.SAVE);
        }

        const filesJson = {
            lastCheck: new Date().getMilliseconds(),
            files: this.files,
        };

        this.fs.writeFileSync(
            BLENDER_DIRS.SAVE + "/" + BLENDER_DIRS.SAVE_FILE,
            JSON.stringify(filesJson),
            (err) => {
                if (err) return console.log(err);
            }
        );
    }

    clear() {
        this.tableRef.reset();
    }

    onPage($event) {
        console.log("$event: ", $event);
    }

    recheckImages() {
        this.files.forEach((f) => {
            f.picUrl = f.filename + ".JPG";
            this.fs.access(f.picUrl, this.fs.F_OK, (err) => {
                if (err) {
                    f.hasPic = false;
                    return;
                }
                f.hasPic = true;
            });
        });
    }

    fromDir(startPath, filter) {
        if (!this.fs.existsSync(startPath)) {
            console.log("no dir ", startPath);
            return;
        }

        var files = this.fs.readdirSync(startPath);
        for (var i = 0; i < files.length; i++) {
            var filename = this.path.join(startPath, files[i]);
            var stat = this.fs.lstatSync(filename);
            if (stat.isDirectory()) {
                this.fromDir(filename, filter);
            } else if (filename.indexOf(filter) >= 0) {
                const stats = this.fs.statSync(filename);

                const birth = this.toDateString(stats.birthtime);
                const foldersTo = filename.split("\\");
                this.name = foldersTo[foldersTo.length - 1];
                const ext = this.name.split(".")[this.name.lenght - 1];
                if (ext !== "blend") {
                    const existsAllready = this.files.some(
                        (f) =>
                            f.filename ===
                            filename.substring(0, filename.length - 1)
                    );
                    if (existsAllready) {
                        continue;
                    }
                }

                const file = {
                    name: this.name,
                    filename: filename,
                    birth: birth,
                };

                this.files.push(file);
            }
        }
    }

    openFileLocation(file) {
        this.openLib(file.fileLocation);
    }

    openFile(file) {
        this.openLib(file.filename);
    }

    openPic(file) {
        this.openLib(file.picUrl);
    }

    private toDateString(date: Date) {
        let dateString = "yyyy-mm-dd";

        dateString = dateString.replace(
            "yyyy",
            this.pad(date.getFullYear(), 2).toString()
        );
        dateString = dateString.replace(
            "mm",
            this.pad(date.getMonth(), 2).toString()
        );
        dateString = dateString.replace(
            "dd",
            this.pad(date.getDate(), 2).toString()
        );

        return dateString;
    }

    private pad(n, width, z?) {
        z = z || "0";
        n = n + "";
        return n.length >= width
            ? n
            : new Array(width - n.length + 1).join(z) + n;
    }
}
