import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainOpComponent } from './main-op.component';
import { TranslateModule } from '@ngx-translate/core';

import { RouterTestingModule } from '@angular/router/testing';

describe('MainOpComponent', () => {
    let component: MainOpComponent;
    let fixture: ComponentFixture<MainOpComponent>;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            declarations: [MainOpComponent],
            imports: [TranslateModule.forRoot(), RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(MainOpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render title in a h1 tag', waitForAsync(() => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('PAGES.DETAIL.TITLE');
    }));
});
