import {Component, OnInit} from '@angular/core';
import {CommandeConfirmeeDTO} from '../../../services/models/commande-confirmee.model';
import {CommandeService, LigneCommande} from '../../../services/commande.service';
import {NgForOf, NgIf} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-commandes-confirmees',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './commandes-confirmees.component.html',
  styleUrl: './commandes-confirmees.component.css'
})
export class CommandesConfirmeesComponent implements OnInit {
  commandes: CommandeConfirmeeDTO[] = [];
  ligneSelectionnee: LigneCommande | null = null;
  quantiteRecue: number = 0;
  dateReception: string = '';
  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.commandeService.getCommandesConfirmees().subscribe(data => {
      console.log('Commandes confirmées:', data);
      this.commandes = data;
    });
  }
  ouvrirReceptionModal(ligne: LigneCommande) {
    this.ligneSelectionnee = ligne;
    this.quantiteRecue = 0; // valeur par défaut
    this.dateReception = new Date().toISOString().split('T')[0]; // aujourd'hui
  }
}
