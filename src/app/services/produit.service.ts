import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

export interface ProduitDTO {
  id?: number;
  nom: string;
  quantiteStock: number | null;
  quantiteVendu: number  | null;
  stockInitiale: number | null;
  leadTime: number |null;
  reorderPoint: number|null;
  prix : number | null;
  fournisseurId?: number;
}

interface ProduitNomId {
  id: number;
  nom: string;
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
  getProduits(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?page=${page}&size=${size}`);
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

  // Méthode pour récupérer les produits avec leur nom et id
  getAllProduitNomId(): Observable<ProduitNomId[]> {
    return this.http.get<ProduitNomId[]>(`${this.baseUrl}/nom-id`);
  }

  getProduitsFiltres(
    page: number,
    size: number,
    nom?: string,
    sousSeuil?: boolean | null | undefined,
    fournisseurId?: number | null | undefined
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (nom) {
      params = params.set('nom', nom);
    }
    if (sousSeuil !== null && sousSeuil !== undefined) {
      params = params.set('sousSeuil', sousSeuil.toString());
    }
    if (fournisseurId) {
      params = params.set('fournisseurId', fournisseurId.toString());
    }

    return this.http.get<ProduitDTO>(`${this.baseUrl}`, { params });
  }

}
