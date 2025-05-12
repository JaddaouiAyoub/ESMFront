import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VenteResponseDTO } from './models/vente-response.dto';
import { VenteRequestDTO } from './models/vente-request.dto';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VenteService {

  private apiUrl = `${environment.apiUrl}/api/ventes`;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les ventes avec pagination et filtres
  getVentes(page: number, size: number, filters: any): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (filters.nomProduit) {
      params = params.set('nomProduit', filters.nomProduit);
    }
    if (filters.dateDebut) {
      params = params.set('dateDebut', filters.dateDebut);
    }
    if (filters.dateFin) {
      params = params.set('dateFin', filters.dateFin);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  // Ajouter une vente
  addVente(vente: VenteRequestDTO): Observable<VenteResponseDTO> {
    return this.http.post<VenteResponseDTO>(this.apiUrl, vente);
  }

  // Supprimer une vente
  deleteVente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupérer une vente par ID
  getVente(id: number): Observable<VenteResponseDTO> {
    return this.http.get<VenteResponseDTO>(`${this.apiUrl}/${id}`);
  }
  getTopProduitsVendus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-produits-vendus`);
  }
}
