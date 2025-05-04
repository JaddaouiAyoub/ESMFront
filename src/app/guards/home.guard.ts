import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';

export const homeGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const role = authService.getUserRole();
    if (role === 'ADMIN') {
      router.navigate(['dashboard/admin']);
    } else {
      router.navigate(['/dashboard/user']);
    }
    return false; // bloquer l'accès à la page d'accueil
  }

  return true; // laisser passer si non authentifié};
}
