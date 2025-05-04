// commande.component.ts
import { Component, OnInit } from '@angular/core';
import {Commande, CommandeService} from '../../../services/commande.service';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgForOf,
    DatePipe,
    FormsModule
  ],
  templateUrl: './commandes.component.html',
  styleUrl: './commandes.component.css'
})
export class CommandesComponent implements OnInit {

  commandes: Commande[] = [];
  selectedType: 'CREEE' | 'EN_COURS' = 'CREEE';
  selectedCommande: Commande | null = null;
  showModal: boolean = false;
  isLoading = false;
  constructor(private commandeService: CommandeService  ,   private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.chargerCommandes('CREEE');
  }

  chargerCommandes(type: 'CREEE' | 'EN_COURS') {
    this.isLoading = true;
    // console.log(`Chargement des commandes de type: ${type}`);
    this.selectedType = type;
    if (type === 'CREEE') {
      this.commandeService.getCommandesCreees().subscribe(data => {
        this.isLoading = false;
        this.commandes = data
      },()=>{
        this.isLoading = false;
        this.toastr.error("Erreur de chargement des commandes");
        }
      );
      // console.log('Commandes créées:', this.commandes);
    } else {
      this.commandeService.getCommandesEnCours().subscribe(data => {
        this.isLoading = false;
        this.commandes = data
      },()=>{
        this.isLoading = false;
        this.toastr.error("Erreur de chargement des commandes");
      });
      // console.log('Commandes en cours:', this.commandes);
    }
  }

  openModification(cmd: Commande) {
    this.selectedCommande = JSON.parse(JSON.stringify(cmd)); // clone pour édition
    this.showModal = true;
  }

  fermerModal() {
    this.selectedCommande = null;
    this.showModal = false;
  }

  validerModification() {
    if (!this.selectedCommande) return;
    this.isLoading= true;

    const lignes = this.selectedCommande.lignes.map(l => ({
      id: l['id'],
      quantiteCommandee: l.quantiteCommandee,
      dateLivraisonPrevue: this.formatDate(l.dateLivraisonPrevue),
      prixUnitaire: l.prixUnitaire,
      dateDexpeditionConfirmee: this.formatDate(l.dateDexpeditionConfirmee)
    }));

    this.commandeService.modifierCommande(this.selectedCommande.id, lignes)
      .subscribe({
        next: (message) => {
          this.isLoading= false;
          this.toastr.success(message, 'Succès');
          this.fermerModal();
          this.chargerCommandes(this.selectedType);
        },
        error: (err) => {
          this.isLoading= false;
          console.log(err)
          const msg = err?.error ?? 'Une erreur est survenue';
          this.toastr.error(msg, 'Erreur');
        }
      });
  }


  formatDate(date: any): string {
    if (!date) return ''; // retourne une chaîne vide si la date est null/undefined/''

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.warn('Date invalide détectée:', date);
      return '';
    }

    return d.toISOString().split('T')[0]; // "YYYY-MM-DD"
  }

}
