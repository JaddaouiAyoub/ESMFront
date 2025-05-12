import {Component, OnInit} from '@angular/core';
import {HistoriqueReceptionService} from '../../../services/historique-reception.service';
import {ToastrService} from 'ngx-toastr';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-historique-receptions',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './historique-receptions.component.html',
  styleUrl: './historique-receptions.component.css'
})
export class HistoriqueReceptionsComponent implements OnInit {
  historiqueReceptions: any = { content: [], totalPages: 0 };
  page: number = 0;
  size: number = 10;
  isLoading: boolean = false;
  protected totalPages: any;
  constructor(private receptionService: HistoriqueReceptionService,private toaster:ToastrService) {}

  ngOnInit(): void {
    // this.chargerHistorique();
    this.applyFilters();
  }



  // chargerHistorique() {
  //   this.isLoading = true;
  //   this.receptionService.getHistorique()
  //     .subscribe({
  //       next: data => {
  //         console.log(data);
  //         this.historiqueReceptions = data;
  //         this.isLoading = false;
  //       },
  //       error: () => {
  //         this.isLoading = false;
  //         this.toaster.error('Erreur lors de la récupération des données.', 'Erreur');
  //         // gérer l'erreur ici si nécessaire
  //       }
  //     });
  // }

  changerPage(nouvellePage: number) {
    this.page = nouvellePage;
    this.applyFilters();
  }
  filters = {
    dateDebut: null,
    dateFin: null
  };

  applyFilters() {
    this.isLoading = true;
    const params: any = {};

    if (this.filters.dateDebut) {
      params.dateDebut = this.filters.dateDebut;
    }

    if (this.filters.dateFin) {
      params.dateFin = this.filters.dateFin;
    }

    this.receptionService.getHistorique(params).subscribe(data => {
      this.isLoading = false;
      // this.toaster.success('Historique chargé avec succès', 'Succès');
      this.historiqueReceptions = data.content;
      this.totalPages = data.totalPages;
    },
    error => {
      this.isLoading = false;
      this.toaster.error('Erreur lors de la récupération de l\'historique', 'Erreur');
      // console.error('Erreur de récupération de l\'historique :', error);
    }
      );
  }

  resetFilters() {
    this.filters = { dateDebut: null, dateFin: null };
    this.applyFilters();
  }
}
