import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse } from 'src/app/Response';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email="";
  password="";
  verifyPassword="";
  message="";

  constructor(private _authService:AuthServiceService, private router:Router){}

  register(): void{
    this._authService.register(this.email,this.password, this.verifyPassword).subscribe(res =>{
      const parse = <AuthResponse> res;
      if (parse.code === 1){
        this.message="";
        localStorage.setItem("auth",parse.auth);
        this.router.navigate(['/home'])
      }else{
        this.message = "Invalid username or password!";
      }
      
    })
  }
}
