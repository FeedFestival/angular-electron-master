import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { FieldsetModule } from 'primeng/fieldset';
import { ListboxModule } from 'primeng/listbox';
import { LabelValue } from '../../model';

@Component({
    selector: 'app-field-listbox',
    standalone: true,
    imports: [CommonModule, FieldsetModule, ListboxModule, BadgeModule, ReactiveFormsModule],
    templateUrl: './field-listbox.component.html',
    styleUrl: './field-listbox.component.scss',
})
export class FieldListboxComponent {
    @Input() label!: string;
    @Input() options: LabelValue<any>[] = [];
    @Input() control!: FormControl;
}
