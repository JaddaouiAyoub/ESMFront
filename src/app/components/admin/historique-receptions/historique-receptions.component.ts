import {Component, OnInit} from '@angular/core';
import {HistoriqueReceptionService} from '../../../services/historique-reception.service';
import {ToastrService} from 'ngx-toastr';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-historique-receptions',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './historique-receptions.component.html',
  styleUrl: './historique-receptions.component.css'
})
export class HistoriqueReceptionsComponent implements OnInit {
  historiqueReceptions: any = { content: [], totalPages: 0 };
  page: number = 0;
  size: number = 10;
  isLoading: boolean = false;
  constructor(private receptionService: HistoriqueReceptionService,private toaster:ToastrService) {}

  ngOnInit(): void {
    this.chargerHistorique();
  }



  chargerHistorique() {
    this.isLoading = true;
    this.receptionService.getHistorique(this.page, this.size)
      .subscribe({
        next: data => {
          console.log(data);
          this.historiqueReceptions = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.toaster.error('Erreur lors de la récupération des données.', 'Erreur');
          // gérer l'erreur ici si nécessaire
        }
      });
  }

  changerPage(nouvellePage: number) {
    this.page = nouvellePage;
    this.chargerHistorique();
  }
}
