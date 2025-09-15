import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldListboxComponent } from './field-listbox.component';

describe('FieldListboxComponent', () => {
  let component: FieldListboxComponent;
  let fixture: ComponentFixture<FieldListboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldListboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FieldListboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
