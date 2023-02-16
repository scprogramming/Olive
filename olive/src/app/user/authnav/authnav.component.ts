import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-authnav',
  templateUrl: './authnav.component.html',
  styleUrls: ['./authnav.component.css']
})
export class AuthnavComponent {

  constructor(private _authService:AuthServiceService, private router:Router){}
  faSearch = faMagnifyingGlass;

  logout(): void{
    this._authService.logout();
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    })
  }
}
