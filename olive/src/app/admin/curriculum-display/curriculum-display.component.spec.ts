import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumDisplayComponent } from './curriculum-display.component';

describe('CurriculumDisplayComponent', () => {
  let component: CurriculumDisplayComponent;
  let fixture: ComponentFixture<CurriculumDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurriculumDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
