import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import {Router} from '@angular/router';
import { AuthResponse } from '../../Response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email="";
  password="";
  message="";

  constructor(private _authService:AuthServiceService, private router:Router){}

  login(): void{
    this._authService.login(this.email,this.password).subscribe(res =>{
      const parse = <AuthResponse> res;
      if (parse.code === 1){
        this.message="";
        localStorage.setItem("auth",parse.auth);
        this.router.navigate(['..'])
      }else{
        this.message = "Invalid username or password!";
      }
      
    })
  }
}
