import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { AppSettings } from '../AppSettings';
import { AuthResponse } from '../Response';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestsService {

  constructor(private _http:HttpClient) { }

  getData(endpoint:string){
    return this._http.get(AppSettings.API_URL + endpoint)
  }

  postData(endpoint:string,reqBody:any){

    const body = JSON.stringify(reqBody);

    return this._http.post(AppSettings.API_URL + endpoint,body, {'headers':{'content-type':'application/json'}})
  }

  postFormData(endpoint:string, formData:FormData){
    return this._http.post(AppSettings.API_URL + endpoint, formData);
  }
}
