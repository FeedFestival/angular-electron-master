import { Component, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: "see-image",
    templateUrl: "see-image.component.html",
})
export class SeeImageComponent {
    constructor(
        public dialogRef: MatDialogRef<SeeImageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {

        console.log('data', data);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
