import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  email: string | null = '';
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {
    this.email = this.authService.getUserEmail();
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = "Les mots de passe ne correspondent pas.";
      this.message = '';
      return;
    }

    this.authService.changePassword(this.email, this.oldPassword, this.newPassword)
      .subscribe({
        next: (res) => {
          this.message = res.message;
          this.error = '';
          alert("✅ " + this.message);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = err.error.message || "Une erreur s'est produite.";
          this.message = '';
        }
      });
  }
}
