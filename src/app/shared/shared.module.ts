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

const primeng = [TableModule, ButtonModule, InputTextModule];

const material = [MatButtonModule, MatCardModule];

@NgModule({
    declarations: [PageNotFoundComponent, WebviewDirective],
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
})
export class SharedModule {}
