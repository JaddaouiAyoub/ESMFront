import {Component, OnInit} from '@angular/core';
import {Commande, CommandeService, LigneCommande} from '../../../services/commande.service';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-reception-commandes',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './reception-commandes.component.html',
  styleUrl: './reception-commandes.component.css'
})
export class ReceptionCommandesComponent implements OnInit {
  commandes: Commande[] = [];
  isLoading = false;
  isValidating = false;
  // typeVue: 'confirmees' | 'partielles' = 'confirmees';

  constructor(private commandeService: CommandeService,private toaster:ToastrService) {}

  ngOnInit(): void {
    this.chargerCommandesConfirmees();

  }
  ligneSelectionnee: LigneCommande | null = null;
  quantiteRecue: number = 0;
  dateReception: string = '';


  chargerCommandesConfirmees() {
    this.isLoading = true;
    this.commandeService.getCommandesConfirmees().subscribe({
      next: (data) => {
        this.commandes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement confirmées:', err);
        this.isLoading = false;
      }
    });
  }

  chargerCommandesPartielles() {
    this.isLoading = true;
    this.commandeService.getCommandesPartiellementRecues().subscribe({
      next: (data) => {
        this.commandes = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toaster.error('Erreur chargement des commandes partielles:');
        this.isLoading = false;
      }
    });
  }
  ouvrirReceptionModal(ligne: LigneCommande) {
    this.ligneSelectionnee = ligne;
    this.quantiteRecue = 0; // valeur par défaut
    this.dateReception = new Date().toISOString().split('T')[0]; // aujourd'hui
  }
  private _typeVue: 'confirmees' | 'partielles' = 'confirmees';
  set typeVue(val: 'confirmees' | 'partielles') {
    this._typeVue = val;
    if (val === 'confirmees') {
      this.chargerCommandesConfirmees();
    } else {
      this.chargerCommandesPartielles();
    }
  }
  get typeVue() {
    return this._typeVue;
  }

  validerReception() {
    this.isValidating= true;
    if (!this.ligneSelectionnee) return;

    const quantiteCommandee = this.ligneSelectionnee.quantiteCommandee || 0;
    const quantiteDejaRecue = this.ligneSelectionnee.sousLignes?.reduce((total: number, sous: any) => {
      return total + (sous.quantiteRecue || 0);
    }, 0) || 0;

    const quantiteTotaleApresSaisie = quantiteDejaRecue + this.quantiteRecue;

    if (quantiteTotaleApresSaisie > quantiteCommandee) {
      this.isValidating = false;
      this.toaster.error("La quantité reçue dépasse la quantité commandée.");
      return;
    }

    this.commandeService.receptionnerLigne(
      this.ligneSelectionnee.id,
      this.quantiteRecue,
      this.dateReception
    ).subscribe({
      next: () => {
        this.isValidating = false;
        this.toaster.success("Réception enregistrée !");
        this.fermerModal();
        if(this.typeVue === 'confirmees') {
          this.chargerCommandesConfirmees(); // pour rafraîchir la liste
        }else{
          this.chargerCommandesPartielles(); // pour rafraîchir la liste
        }
      },
      error: err => {
        this.isValidating = false;
        this.toaster.error("Erreur lors de la réception : " + err.error?.message || "inconnue");
      }
    });
  }


  fermerModal() {
    this.ligneSelectionnee = null;
    this.quantiteRecue = 0;
    this.dateReception = '';
  }
  getQuantiteRestante(): number {
    if (!this.ligneSelectionnee) return 0;

    const quantiteCommandee = this.ligneSelectionnee.quantiteCommandee || 0;
    const quantiteDejaRecue = this.ligneSelectionnee.sousLignes?.reduce((total: number, sous: any) => {
      return total + (sous.quantiteRecue || 0);
    }, 0) || 0;

    return quantiteCommandee - quantiteDejaRecue;
  }
}
