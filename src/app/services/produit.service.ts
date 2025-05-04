import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

export interface ProduitDTO {
  id?: number;
  nom: string;
  quantiteStock: number;
  quantiteVendu: number;
  reorderPoint: number;
  prix: number;
  fournisseurId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private baseUrl = environment.apiUrl+'/api/produits'; // à adapter si besoin

  constructor(private http: HttpClient) {}

  getAllProduits(): Observable<ProduitDTO[]> {
    return this.http.get<ProduitDTO[]>(this.baseUrl);
  }

  getProduitById(id: number): Observable<ProduitDTO> {
    return this.http.get<ProduitDTO>(`${this.baseUrl}/${id}`);
  }

  createProduit(produit: ProduitDTO): Observable<ProduitDTO> {
    return this.http.post<ProduitDTO>(this.baseUrl, produit);
  }

  updateProduit(id: number, produit: ProduitDTO): Observable<ProduitDTO> {
    return this.http.put<ProduitDTO>(`${this.baseUrl}/${id}`, produit);
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ➤ Affecter un produit à un fournisseur
  affecterProduitAFournisseur(produitId: number, fournisseurId: number): Observable<ProduitDTO> {
    return this.http.put<ProduitDTO>(`${this.baseUrl}/${produitId}/fournisseur/${fournisseurId}`, {});
  }
}
