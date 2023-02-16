import { Component } from '@angular/core';
import { ApiRequestsService } from 'src/app/services/api-requests.service';
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-course-list',
  templateUrl: './dashboard-course-list.component.html',
  styleUrls: ['./dashboard-course-list.component.css']
})
export class DashboardCourseListComponent {

  courses:any;
  constructor(private _apiservice:ApiRequestsService){}
  faEdit = faEdit;
  faTrash = faTrash;

  ngOnInit(){

    this._apiservice.getData('/api/getDashboardCourses').subscribe(res =>{
      this.courses = res;
    })
  }

}
