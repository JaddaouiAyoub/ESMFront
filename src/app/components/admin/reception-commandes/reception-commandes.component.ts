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
  constructor(private commandeService: CommandeService,private toaster:ToastrService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.commandeService.getCommandesConfirmees().subscribe({

      next: (data) => {
        this.isLoading = false;
        this.commandes = data
      },
      error: (err) => {
        this.isLoading = false;
        this.toaster.error('Erreur chargement commandes confirmées')
      }
    });
  }
  ligneSelectionnee: LigneCommande | null = null;
  quantiteRecue: number = 0;
  dateReception: string = '';

  ouvrirReceptionModal(ligne: LigneCommande) {
    this.ligneSelectionnee = ligne;
    this.quantiteRecue = 0; // valeur par défaut
    this.dateReception = new Date().toISOString().split('T')[0]; // aujourd'hui
  }

  validerReception() {
    this.isValidating= true;
    if (!this.ligneSelectionnee) return;

    this.commandeService.receptionnerLigne(
      this.ligneSelectionnee.id,
      this.quantiteRecue,
      this.dateReception
    ).subscribe({
      next: () => {
        this.isValidating = false;
        this.toaster.success("Réception enregistrée !");
        this.fermerModal();
        this.ngOnInit(); // pour rafraîchir la liste
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
}
