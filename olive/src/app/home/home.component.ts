import { Component } from '@angular/core';
import { ApiRequestsService } from '../api-requests.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  courses:any;
  constructor(private _apiservice:ApiRequestsService){}

  ngOnInit(){
    this._apiservice.getData('/api/getDashboardCourses').subscribe(res =>{
      this.courses = res;
      console.log(this.courses)
    })
  }
}
