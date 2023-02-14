import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './user/home/home.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { CourseViewComponent } from './user/course-view/course-view.component';
import { DashboardHomeComponent } from './admin/dashboard-home/dashboard-home.component';
import { AdminAuthGuard } from './Guards/auth.guard';
import { LoginGuard } from './Guards/login.guard';
import { DashboardCourseListComponent } from './admin/dashboard-course-list/dashboard-course-list.component';
import { AddCourseComponent } from './admin/add-course/add-course.component';
import { EditCourseComponent } from './admin/edit-course/edit-course.component';

const routes: Routes = [
  {path: 'login', component:LoginComponent, canActivate:[LoginGuard]},
  {path: 'register', component:RegisterComponent, canActivate:[LoginGuard]},
  {path: '', redirectTo:'/home', pathMatch: 'full'},
  {path: 'home', component:HomeComponent},
  {path: 'courses/:id', component:CourseViewComponent},
  {path: 'dashboard',component:DashboardHomeComponent, canActivate:[AdminAuthGuard]},
  {path: 'dashboard/courses',component:DashboardCourseListComponent, canActivate:[AdminAuthGuard]},
  {path: 'dashboard/addCourse', component:AddCourseComponent, canActivate:[AdminAuthGuard]},
  {path: 'dashboard/editCourse/:id', component:EditCourseComponent, canActivate:[AdminAuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
