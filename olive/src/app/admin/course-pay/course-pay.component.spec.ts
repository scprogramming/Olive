import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePayComponent } from './course-pay.component';

describe('CoursePayComponent', () => {
  let component: CoursePayComponent;
  let fixture: ComponentFixture<CoursePayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursePayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursePayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
