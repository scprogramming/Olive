import { Component } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import {Router} from '@angular/router';
import { AuthResponse } from '../Response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email="";
  password=""

  constructor(private _authService:AuthServiceService, private router:Router){}

  login(): void{
    //Todo: Handle error case + invalid login case
    this._authService.login(this.email,this.password).subscribe(res =>{
      const parse = <AuthResponse> res;
      localStorage.setItem("auth",parse.auth);
      this.router.navigate(['/home'])
    })
  }
}
