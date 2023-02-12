import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { StatusOnlyRes } from '../Response';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService:AuthServiceService, private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    
      if (localStorage.getItem("auth") !== null) {
        let token = localStorage.getItem("auth")!;
        return this.authService.verifyAuthUser(token).pipe(map((response:any) => {
          let parse = <StatusOnlyRes>response;
          
          if (parse.status){
            this.router.navigate(['..']);
            return false;
          }

          return true;
        }));
        
      }else{
        return true;
      }

  }
}
