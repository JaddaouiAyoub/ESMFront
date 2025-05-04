import { Component } from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {Router, RouterOutlet} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf,
    RouterOutlet,
    FormsModule,
    NgClass
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showLogin = false;
  email = '';
  password = '';
  emailTouched = false;
  emailValid = false;
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValid = emailRegex.test(this.email);
  }

  login() {
    this.loading = true;
    this.errorMessage = '';

    const username = this.email; // car backend attend un `username`
    this.authService.login({ username, password: this.password }).subscribe({
      next: (res) => {
        console.log(res)
        this.loading = false;
        localStorage.setItem('token', res.token);
        localStorage.setItem('refresh_token', res.refreshToken);
        localStorage.setItem('email', res.email); // il faut que le backend renvoie l'email ici
        localStorage.setItem('role', res.role); // il faut que le backend renvoie le rôle ici

        if (res.role === 'ADMIN') {
          this.router.navigate(['/dashboard/admin']);
        } else if (res.role === 'USER') {
          this.router.navigate(['/dashboard/user']);
        } else {
          this.errorMessage = "Rôle inconnu. Contactez l'administrateur.";
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Email ou mot de passe incorrect.';
      }
    });
  }
}
