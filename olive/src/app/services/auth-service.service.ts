import { Injectable } from '@angular/core';
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
}
