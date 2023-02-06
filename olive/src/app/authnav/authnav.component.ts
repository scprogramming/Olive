import { Component } from '@angular/core';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-authnav',
  templateUrl: './authnav.component.html',
  styleUrls: ['./authnav.component.css']
})
export class AuthnavComponent {
  faSearch = faMagnifyingGlass;
}
