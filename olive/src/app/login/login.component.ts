import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email="";
  password=""

  constructor(private _authService:AuthServiceService){}

  login(): void{
    this._authService.login(this.email,this.password);
  }
}
