import { Component } from '@angular/core';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-unauthnav',
  templateUrl: './unauthnav.component.html',
  styleUrls: ['./unauthnav.component.css']
})
export class UnauthnavComponent {
  faSearch = faMagnifyingGlass;
}
