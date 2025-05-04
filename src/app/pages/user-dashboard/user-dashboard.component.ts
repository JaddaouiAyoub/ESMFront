import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  standalone: true,
  imports: [
    NgIf
  ],
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  showMenu = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  changePassword() {
    this.router.navigate(['/dashboard/change-password']);
  }
}
