import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCourseListComponent } from './dashboard-course-list.component';

describe('DashboardCourseListComponent', () => {
  let component: DashboardCourseListComponent;
  let fixture: ComponentFixture<DashboardCourseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCourseListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
