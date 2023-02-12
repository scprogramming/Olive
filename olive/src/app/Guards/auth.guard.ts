import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { StatusOnlyRes } from '../Response';
import { AuthServiceService } from '../services/auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private authService:AuthServiceService, private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    
      if (localStorage.getItem("auth") !== null) {
        let token = localStorage.getItem("auth")!;
        return this.authService.verifyAuthAdmin(token).pipe(map((response:any) => {
          let parse = <StatusOnlyRes>response;
          
          if (!parse.status){
            this.router.navigate(['/login']);
          }

          return parse.status;
        }));
        
      }else{
        this.router.navigate(['/login']);
        return false;
      }

  }
  
}
