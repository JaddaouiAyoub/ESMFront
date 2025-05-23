export interface DashboardStats {
  totalCommandes: number;
  commandesEnCours: number;
  commandesPartiellementRecues: number;
  commandesRecues: number;
  commandesConfirmees: number;
  commandesEnRetard: number;
  montantTotalCommandes: number;
  montantTotalVentes:number; // <-- AJOUT ICI

  produitsSousSeuil: number;
  commandesParStatut: { [statut: string]: number };
  commandesParFournisseur: { [codeFournisseur: string]: number };
  topProduitsCommandes: { [nomProduit: string]: number };
}
