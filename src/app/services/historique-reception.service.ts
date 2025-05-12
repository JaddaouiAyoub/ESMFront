import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueReceptionService {

  private apiUrl = `${environment.apiUrl}/api/historique-receptions`;

  constructor(private http: HttpClient) {}

  // getHistorique(page: number, size: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`);
  // }
  getHistorique(params: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, { params });
  }
}
