import { Component, } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AddonsComponent } from '../addons/addons.component';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, AddonsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent { }
