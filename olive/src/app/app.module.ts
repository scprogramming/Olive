import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './user/home/home.component';
import { UnauthnavComponent } from './user/unauthnav/unauthnav.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthnavComponent } from './user/authnav/authnav.component';
import { RegisterComponent } from './user/register/register.component';
import { CourseViewComponent } from './user/course-view/course-view.component';
import { DashboardHomeComponent } from './admin/dashboard-home/dashboard-home.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { DashboardCourseListComponent } from './admin/dashboard-course-list/dashboard-course-list.component';
import { AddCourseComponent } from './admin/add-course/add-course.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UnauthnavComponent,
    AuthnavComponent,
    RegisterComponent,
    CourseViewComponent,
    DashboardHomeComponent,
    SidebarComponent,
    DashboardCourseListComponent,
    AddCourseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
