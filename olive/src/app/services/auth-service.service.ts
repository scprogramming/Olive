import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestsService } from './api-requests.service';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private _apiservice:ApiRequestsService) { }

  login(email:string, password:string){
    return this._apiservice.postData('/api/login',{email:email, password:password})
  }

  verifyAuthUser(token:string){
    return this._apiservice.postData('/api/verifyAuthUser', {authToken:token})
  }

  verifyAuthAdmin(token:string):Observable<any>{
    return this._apiservice.postData('/api/verifyAuthAdmin', {authToken:token})
  }

  register(email:string,password:string, verifyPassword:string){
    return this._apiservice.postData('/api/register',{email:email, password:password, confirmPassword:verifyPassword})
  }

  logout():void{

    if (localStorage.getItem("auth") !== null) {
      let token = localStorage.getItem("auth");
      localStorage.removeItem("auth");
      this._apiservice.postData('/api/logout', {authToken:token})
    }
  }
}
