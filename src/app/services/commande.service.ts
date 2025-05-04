import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modèles à adapter selon tes interfaces réelles
export interface LigneCommande {
  id: number;
  nomProduit: string;
  quantiteCommandee: number;
  prixUnitaire: number;
  dateDexpeditionConfirmee: string; // format ISO: "2025-05-01"
  dateLivraisonPrevue: string; // format ISO: "2025-05-01"
}
export interface Fournisseur {
  id: number;
  code: string;
  raisonSociale: string;
}
export interface Commande {
  id: number;
  codeCommande: string;
  dateCreation: string;
  statut: string;
  montantTotal: number;
  // lignesCommande: LigneCommande[];
  fournisseur: Fournisseur;
  lignes: LigneCommande[]; // ✅ ajouter cette ligne
}

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private apiUrl = 'https://esmback-production.up.railway.app/api/commandes'; // adapte si besoin

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les commandes au statut CREEE
   */
  getCommandesCreees(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/creees`);
  }
  // commandes.service.ts
  getCommandesConfirmees(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/confirmees`);
  }
  receptionnerLigne(id: number, quantiteRecue: number, dateReception: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/lignes/${id}/reception`, {
      quantiteRecue,
      dateReception
    });
  }

  /**
   * Récupère toutes les commandes au statut EN_COURS
   */
  getCommandesEnCours(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/encours`);
  }

  /**
   * Modifie une commande en envoyant les lignes modifiées
   */
  modifierCommande(commandeId: number, lignesModifiees: {
    dateLivraisonPrevue: string;
    id: number;
    quantiteCommandee: number,
    prixUnitaire: number,
    dateDexpeditionConfirmee: string;
  }[]): Observable<string> {
    return this.http.put(`${this.apiUrl}/${commandeId}/modifier`, lignesModifiees,{
      responseType: 'text' // pour recevoir un message texte
    });
  }
}
