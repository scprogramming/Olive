import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatusOnlyRes } from 'src/app/Response';
import { ApiRequestsService } from 'src/app/services/api-requests.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['./course-view.component.css']
})
export class CourseViewComponent {

  id:string = "";
  authStatus:boolean = false;
  courses:any;

  constructor (private route: ActivatedRoute, private _authService:AuthServiceService, private _apiservice:ApiRequestsService){}

  toggle(toggleOn: HTMLElement) {
    toggleOn.classList.toggle('hidden');
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);

      if (localStorage.getItem("auth") !== null) {
        let token:string = localStorage.getItem('auth')!;
        this._authService.verifyAuthUser(token).subscribe(res => {
          const parse = <StatusOnlyRes> res
          this.authStatus = parse.status;
          console.log(this.authStatus)
        })
      }else{
        this.authStatus = false
        console.log(this.authStatus);
      }
      
  
      this._apiservice.getData('/api/courseData/' + this.id).subscribe(res =>{
        this.courses = res;
        console.log(this.courses);
      })
    })
  }

}
