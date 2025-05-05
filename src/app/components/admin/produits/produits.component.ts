import {Component, OnInit} from '@angular/core';
import {ProduitDTO, ProduitService} from '../../../services/produit.service';
import {FournisseurDTO, FournisseurService} from '../../../services/fournisseur.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    NgClass,
  ],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.css'
})

export class ProduitsComponent implements OnInit {
  produits: ProduitDTO[] = [];
  fournisseurs: FournisseurDTO[] = [];
  showModal = false;
  showFournisseurPopup = false;
  isEditMode = false;
  selectedFournisseur: FournisseurDTO | null = null;
  showFournisseurModal: boolean = false;
  produitToAffecter: ProduitDTO | null = null; // produit à affecter au fournisseur
  selectedProduitIdForAffectation: number | null = null;
  isLoading=false;
  isApplying = false;
  loading: boolean = false;

  produit: ProduitDTO = {
    nom: '',
    quantiteStock: 0,
    quantiteVendu: 0,
    reorderPoint: 0,
    prix: 0,
    fournisseurId: undefined,
  } as ProduitDTO;

  constructor(
    private produitService: ProduitService,
    private fournisseurService: FournisseurService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getProduits();
    this.getFournisseurs();
  }

  getProduits() {
    this.isLoading=true;
    this.produitService.getAllProduits().subscribe((data) => {
      this.isLoading=false;
      this.produits = data;
    },(error) => {
      this.isLoading=false;
      this.toastr.error('Erreur de chargement des produits');
    });
  }

  getFournisseurs() {
    this.fournisseurService.getAllFournisseurs().subscribe((data) => {
      this.fournisseurs = data;
    });
  }

  openModal(produit?: ProduitDTO) {

    if (produit) {
      this.isEditMode = true;
      this.produit = { ...produit };
    } else {
      this.isEditMode = false;
      this.produit = {
        nom: '',
        quantiteStock: 0,
        quantiteVendu: 0,
        reorderPoint: 0,
        prix: 0,
        fournisseurId: undefined,
      }as ProduitDTO;
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveProduit() {
    this.loading = true;
    if (this.isEditMode && this.produit.id) {
      this.produitService.updateProduit(this.produit.id, this.produit).subscribe(() => {
        this.toastr.success('Produit mis à jour avec succès');
        this.loading = false;
        this.getProduits();
        this.closeModal();
      },()=>{
        this.loading = false;
        this.toastr.error('Erreur de mise à jour du produit');
      });
    } else {
      this.produitService.createProduit(this.produit).subscribe(() => {
        this.loading = false;
        this.toastr.success('Produit ajouté avec succès');
          this.closeModal();
        this.getProduits();
      },
      () => {
        this.loading = false;
        this.toastr.error('Erreur d\'ajout du produit');
      }
      );
    }
  }

  deleteProduit(id: number) {
    this.produitService.deleteProduit(id).subscribe(() => {
      this.getProduits();
      this.toastr.success("Le produit a été supprimé avec succès")
    },
      ()=>{
      this.toastr.error("Erreur de suppression du produit")
      });
  }

  openAffectationPopup(produitId: number) {
    this.selectedProduitIdForAffectation = produitId;
    this.showFournisseurPopup = true;
  }

  affecterFournisseur(fournisseurId: number) {
    if (this.selectedProduitIdForAffectation != null) {
      this.produitService
        .affecterProduitAFournisseur(this.selectedProduitIdForAffectation, fournisseurId)
        .subscribe(() => {
          this.getProduits();
          this.showFournisseurPopup = false;
          this.selectedProduitIdForAffectation = null;
        });
    }
  }
  getNomFournisseur(fournisseurId: number | undefined): string {
    if (!fournisseurId) return 'Aucun';
    const fournisseur = this.fournisseurs.find(f => f.id === fournisseurId);
    return fournisseur ? fournisseur.username : 'Aucun';
  }

  // Ouvrir le modal pour affecter un fournisseur
  openFournisseurModal(produit: ProduitDTO): void {
    this.produitToAffecter = produit; // On garde en mémoire le produit à affecter
    this.showFournisseurModal = true;
  }
  // Fermer le modal sans appliquer la sélection
  closeFournisseurModal(): void {
    this.showFournisseurModal = false;
    this.selectedFournisseur = null;
  }
  // Sélectionner un fournisseur
  selectFournisseur(fournisseur: FournisseurDTO): void {
    this.selectedFournisseur = fournisseur;
  }
  // Appliquer la sélection du fournisseur au produit

  applyFournisseurSelection(): void {
    this.isApplying = true;
    if (this.produitToAffecter && this.selectedFournisseur) {
      this.produitService.affecterProduitAFournisseur(this.produitToAffecter.id!, this.selectedFournisseur.id!).subscribe(() => {
        // Fermer le modal après avoir affecté le fournisseur
        this.isApplying=false;
        this.getProduits(); // Recharger les produits
        this.closeFournisseurModal(); // Fermer le modal
      }
      , (error) => {
        this.isApplying=false;
        this.toastr.error('Erreur lors de l\'affectation du fournisseur');
        });
    }
  }
}
