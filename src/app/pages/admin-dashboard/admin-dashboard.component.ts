import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterLinkActive,
    RouterLink,
    RouterOutlet
  ],
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
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
    this.router.navigate(['dashboard/change-password']);
  }
}
