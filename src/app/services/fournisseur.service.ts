import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

export interface FournisseurDTO {
  id?: number;
  username: string;
  email: string;
  raisonSociale: string;
  // lastName: string;
  phoneNumber: string;
  code?: string; // généré automatiquement
}

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  private baseUrl = environment.apiUrl+'/api/fournisseurs'; // ➔ adapte si nécessaire !

  constructor(private http: HttpClient) {}

  // ➤ Créer un fournisseur
  createFournisseur(fournisseur: FournisseurDTO): Observable<FournisseurDTO> {
    return this.http.post<FournisseurDTO>(`${this.baseUrl}`, fournisseur);
  }

  // ➤ Récupérer tous les fournisseurs
  getAllFournisseurs(): Observable<FournisseurDTO[]> {
    return this.http.get<FournisseurDTO[]>(`${this.baseUrl}`);
  }

  // ➤ Récupérer un fournisseur par ID
  getFournisseurById(id: number): Observable<FournisseurDTO> {
    return this.http.get<FournisseurDTO>(`${this.baseUrl}/${id}`);
  }
  // Méthode pour mettre à jour un fournisseur
  updateFournisseur(id: number, fournisseurDTO: FournisseurDTO): Observable<FournisseurDTO> {
    return this.http.put<FournisseurDTO>(`${this.baseUrl}/${id}`, fournisseurDTO);
  }

  // ➤ Supprimer un fournisseur
  deleteFournisseur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
