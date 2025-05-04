import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError, of } from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const authInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
  const excludedUrls = [
    '/api/v1/auth/login',
    '/api/v1/auth/signup',
    '/api/v1/auth/forgot-password',
    '/api/v1/auth/refresh'
  ];
  const router = inject(Router); // 👈 Injection de Router
  const authService = inject(AuthService); // 👈 Injection de AuthService

  const isExcluded = excludedUrls.some(url => req.url.includes(url));
  const token = localStorage.getItem('token');

  if (isExcluded) {
    return next(req);
  }

  const http = inject(HttpClient);

  const authReq = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expiré, tentative de refresh
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          console.warn('Aucun refresh token trouvé.');
          return throwError(() => error);
        }

        return http.post<any>('http://localhost:8080/api/v1/auth/refresh', { 'token':refreshToken }).pipe(
          switchMap((res) => {
            const newToken = res.token; // Adapte selon ta réponse
            localStorage.setItem('token', newToken);
            localStorage.setItem('refresh_token',res.refreshToken)

            const retryReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newToken}`)
            });

            return next(retryReq);
          }),
          catchError((refreshErr) => {
            console.error('Erreur de refresh token', refreshErr);
            authService.logout(); // Déconnexion de l'utilisateur
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
