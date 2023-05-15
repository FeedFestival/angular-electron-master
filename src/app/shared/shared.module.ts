import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TranslateModule } from "@ngx-translate/core";

import { PageNotFoundComponent } from "./components/";
import { WebviewDirective } from "./directives/";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDialogModule } from "@angular/material/dialog";
import { SeeImageComponent } from "./components/see-image/see-image.component";

const entry = [SeeImageComponent];
const primeng = [TableModule, ButtonModule, InputTextModule];
const material = [
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatDialogModule,
];

@NgModule({
    declarations: [PageNotFoundComponent, WebviewDirective, entry],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        ...material,
        ...primeng,
    ],
    exports: [
        TranslateModule,
        WebviewDirective,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        ...material,
        ...primeng,
    ],
    entryComponents: [...entry],
})
export class SharedModule {}
