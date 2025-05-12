import { Component, OnInit } from '@angular/core';
import { VenteResponseDTO } from '../../../services/models/vente-response.dto';
import { VenteService } from '../../../services/vente.service';
import { VenteRequestDTO } from '../../../services/models/vente-request.dto';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import { ProduitService } from '../../../services/produit.service';
import { FormsModule } from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
  selector: 'app-ventes',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './ventes.component.html',
  styleUrls: ['./ventes.component.css']
})
export class VentesComponent implements OnInit {
  produits: { id: number, nom: string }[] = [];
  ventes: VenteResponseDTO[] = [];
  page: number = 0;
  size: number = 10;
  totalVentes: number = 0;
  filters = {
    nomProduit: '',
    dateDebut: '',
    dateFin: ''
  };

  // Ajout de l'état de chargement et du modèle de la vente
  isLoading: boolean = false;
  isAddLoading: boolean = false;
  newVente: VenteRequestDTO = {
    produitId: 0,
    quantite: 0,
    prixVenteUnitaire: 0
  };

  // État de la modale
  isModalOpen: boolean = false;

  constructor(private venteService: VenteService, private produitService: ProduitService , private toaster : ToastrService) { }

  ngOnInit(): void {
    this.loadVentes(); // Charger les ventes au démarrage
    this.loadProduits(); // Charger les produits au démarrage
  }

  // Charger les produits pour le select
  loadProduits(): void {
    this.produitService.getAllProduitNomId().subscribe((data) => {
      this.produits = data;
    });
  }

  // Charger les ventes avec pagination et filtres
  loadVentes(): void {
    this.isLoading = true;  // Afficher le spinner pendant le chargement des ventes
    this.venteService.getVentes(this.page, this.size, this.filters).subscribe((data) => {
      this.ventes = data.content;
      this.totalVentes = data.totalElements;
      this.isLoading = false;  // Masquer le spinner une fois les données chargées
    }, error => {
      console.error('Erreur lors du chargement des ventes', error);
      this.toaster.error('Erreur lors du chargement des ventes', 'Erreur');
      this.isLoading = false; // Masquer le spinner en cas d'erreur
    });
  }

  // Pagination
  nextPage(): void {
    if ((this.page + 1) * this.size < this.totalVentes) {
      this.page++;
      this.loadVentes();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadVentes();
    }
  }

  // Appliquer les filtres
  applyFilters(): void {
    this.page = 0;  // Revenir à la première page lors de l'application des filtres
    this.loadVentes();  // Recharger les ventes avec les nouveaux filtres
  }

  // Supprimer une vente
  deleteVente(id: number): void {
    this.venteService.deleteVente(id).subscribe(() => {
      this.toaster.success('Vente supprimée avec succès', 'Succès');
      this.loadVentes(); // Recharger les ventes après suppression
    }, error => {
      // console.error('Erreur lors de la suppression de la vente:', error);
      this.toaster.error('Erreur lors de la suppression de la vente', 'Erreur');
    });
  }

  // Ajouter une vente
  addVente(): void {
    this.isAddLoading = true; // Afficher le spinner pendant l'envoi des données
    this.venteService.addVente(this.newVente).subscribe({
      next: (response: VenteResponseDTO) => {
        this.toaster.success('Vente ajoutée avec succès', 'Succès');

        this.isAddLoading = false;
        this.resetForm(); // Réinitialiser le formulaire
        this.closeModal(); // Fermer la modale après l'ajout
        this.loadVentes(); // Recharger les ventes après ajout
      },
      error: (error) => {
        // console.error('Erreur lors de l\'ajout de la vente:', error);
        this.toaster.error('Erreur lors de l\'ajout de la vente :' + error.error, 'Erreur');

        this.isAddLoading = false;
      }
    });
  }

  // Réinitialiser le formulaire après l'ajout d'une vente
  resetForm(): void {
    this.newVente = {
      produitId: 0,
      quantite: 0,
      prixVenteUnitaire: 0
    };

  }

  // Ouvrir la modale pour ajouter une vente
  openModal(): void {
    this.isModalOpen = true;
  }

  // Fermer la modale
  closeModal(): void {
    this.isModalOpen = false;
  }
  resetFilters() {

    this.filters = {
      nomProduit: '',
      dateDebut: '',
      dateFin: ''
    }
    this.loadVentes();
  }
}
