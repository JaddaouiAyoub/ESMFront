import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      // Redirection conditionnelle selon rôle
      if (role === 'ADMIN' || role === 'USER') {
        return true;
      }
    }

    this.router.navigate(['/']); // Redirige vers login
    return false;
  }
}
