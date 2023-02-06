import { Injectable } from '@angular/core';
import { ApiRequestsService } from './api-requests.service';
import { AuthResponse } from './Response';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private _apiservice:ApiRequestsService) { }

  login(email:string, password:string){
    console.log(email);
    console.log(password);
    this._apiservice.postData('/api/login',{email:email, password:password}).subscribe(res =>{
      const parse = <AuthResponse> res;
      localStorage.setItem("auth",parse.auth);
    })
  }
}
