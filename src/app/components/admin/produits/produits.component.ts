import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ProduitDTO, ProduitService} from '../../../services/produit.service';
import {FournisseurDTO, FournisseurService} from '../../../services/fournisseur.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {data} from 'autoprefixer';
import {id} from '@swimlane/ngx-charts';

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

export class ProduitsComponent implements OnInit , AfterViewInit {
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
  page: number = 0;
  size: number = 5;
  totalPages: number = 0;
  fournisseurNomId: { id: number, nom: string }[] = [];

  produit: ProduitDTO = {
    nom: '',
    quantiteStock: 0,
    quantiteVendu: 0,
    stockInitiale: 0,
    leadTime:0,
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
    this.applyFilters();
  }

  getProduits() {
    this.isLoading=true;
    this.produitService.getProduits(this.page, this.size).subscribe({
      next: (res) => {
        this.produits = res.content;
        this.totalPages = res.totalPages;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Erreur lors de la récupération des produits', 'Erreur');
      }
    });
  }
  changePage(newPage: number) {
    this.page = newPage;
    this.getProduits();
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
        quantiteStock: null,
        quantiteVendu: null,
        stockInitiale:null,
        leadTime:null,
        reorderPoint: 0,
        prix: null,
        fournisseurId: 0,
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

  isBelowReorderPoint(p: ProduitDTO): boolean {
    return (
      p.quantiteStock != null &&
      p.reorderPoint != null &&
      p.quantiteStock < p.reorderPoint
    );
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
        this.closeFournisseurModal(); // Fermer le modal
        this.toastr.success('Fournisseur affecté avec succès');
        this.getProduits(); // Recharger les produits
      }
      , (error) => {
        this.isApplying=false;
        this.toastr.error('Erreur lors de l\'affectation du fournisseur');
        });
    }
  }
  filters = {
    nom: '',
    sousSeuil: null as boolean | null | undefined ,
    fournisseurId: null as number | null | undefined
  };

  applyFilters() {
    const { nom, sousSeuil, fournisseurId } = this.filters;
    this.produitService.getProduitsFiltres(0, 10, nom, sousSeuil, fournisseurId).subscribe(res => {
      this.produits = res.content;
      this.totalPages = res.totalPages;
    });
  }

  resetFilters() {
    this.filters = {
      nom: '',
      sousSeuil: null,
      fournisseurId: null
    };
    this.applyFilters();
  }
  loadFournisseurs() {
    this.fournisseurService.getAllFournisseurNomId().subscribe(data => {
      this.fournisseurNomId = data;
    });
  }

  ngAfterViewInit(): void {
    this.loadFournisseurs()
    this.getFournisseurs();
  }

}
