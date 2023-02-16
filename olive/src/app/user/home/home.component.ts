import { Component } from '@angular/core';
import { ApiRequestsService } from '../../services/api-requests.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { StatusOnlyRes } from '../../Response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  courses:any;
  authStatus:boolean = false;
  constructor(private _authService:AuthServiceService, private _apiservice:ApiRequestsService){}

  ngOnInit(){
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
    

    this._apiservice.getData('/api/getDashboardCourses').subscribe(res =>{
      this.courses = res;
    })

  
  }
}
