import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
interface AuthRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  email: string;
  role: string;
  // ajoute les autres champs si nécessaires
}

export interface CreateFournisseurReq {
  username: string;
  email: string;
  password: string;
  raisonSociale: string;
  phoneNumber: string;
  role: string;  // Peut être "FOURNISSEUR" ou autre rôle
  code?: string; // Code seulement pour les Fournisseurs
}

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private apiUrl = 'https://esmback-production.up.railway.app/api/v1/auth';

  constructor(private http: HttpClient,private router:Router) {}

  login(data: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  getUserRole(): string | null {
    return localStorage.getItem('role');

  }
  getUserEmail(): string | null {
    return localStorage.getItem('email');

  }

  changePassword(email: string | null, oldPassword: string, newPassword: string) {
    return this.http.post<any>(`${this.apiUrl}/change-password`, {
      email,
      oldPassword,
      newPassword
    });
  }
  // Méthode signup pour créer un User ou Fournisseur
  signup(request: CreateFournisseurReq): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, request, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('email');
    this.router.navigate(['/']);
  }
}
