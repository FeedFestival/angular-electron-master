import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderFieldComponent } from './folder-field.component';

describe('FolderFieldComponent', () => {
  let component: FolderFieldComponent;
  let fixture: ComponentFixture<FolderFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FolderFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
