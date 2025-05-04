import { Component, OnInit } from '@angular/core';
import {FournisseurDTO, FournisseurService} from '../../../services/fournisseur.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, CreateFournisseurReq } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fournisseurs',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgForOf,
    NgClass
  ],
  templateUrl: './fournisseurs.component.html',
  styleUrl: './fournisseurs.component.css'
})
export class FournisseursComponent implements OnInit {
  showModal: boolean = false;
  isEditMode: boolean = false;
  fournisseurs: FournisseurDTO[] = [];
  fournisseur: FournisseurDTO = { username: '', email: '', raisonSociale: '', phoneNumber: '' }; // Initialiser avec un objet vide

  nouveauFournisseur: CreateFournisseurReq = {
    username: '',
    email: '',
    password: '',
    raisonSociale: '',
    phoneNumber: '',
    role: 'FOURNISSEUR' // rôle fixé ici
  };

  constructor(
    private fournisseurService: FournisseurService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs() {
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (data) => {
        console.log(data);
        this.fournisseurs = data;
      },
      error: (err) => this.toastr.error('Erreur chargement fournisseurs')
    });
  }

  // Ouvrir le modal en mode édition ou ajout
  openModal(fournisseur?: FournisseurDTO) {
    if (fournisseur) {
      this.isEditMode = true;
      this.fournisseur = { ...fournisseur }; // Cloner l'objet pour ne pas modifier l'original
    } else {
      this.isEditMode = false;
      this.fournisseur = { username: '', email: '', raisonSociale: '', phoneNumber: '' }; // Réinitialiser pour l'ajout
    }
    this.showModal = true;
  }
  // Sauvegarder le fournisseur (ajouter ou modifier)
  saveFournisseur(form: any) {
    if (!form.valid) {
      form.control.markAllAsTouched(); // Pour afficher les erreurs visuellement
      return;
    }
    if (this.isEditMode) {
      this.fournisseurService.updateFournisseur(this.fournisseur.id!, this.fournisseur).subscribe(
        (updatedFournisseur) => {
          this.closeModal();
          this.toastr.success('Fournisseur mis à jour avec succès');
          this.loadFournisseurs();
        },
        () => {
          this.toastr.error('Erreur de mise à jour');
        }
      );
    } else {
      this.fournisseurService.createFournisseur(this.fournisseur).subscribe(
        (newFournisseur) => {
          this.closeModal();
          this.toastr.success('Fournisseur ajouté avec succès');
          this.loadFournisseurs();
        },
        (error) => {
          this.toastr.error('Erreur d\'ajout veuillez essayer plus tard');
        }
      );
    }
  }


  closeModal() {
    this.showModal = false;
    this.resetForm();
  }



  deleteFournisseur(id: number | undefined) {
    if (confirm('Voulez-vous vraiment supprimer ce fournisseur ?')) {
      if (id != null) {
        this.fournisseurService.deleteFournisseur(id).subscribe({
          next: () => {
            this.toastr.success("Le fournisseur a été supprimé avec succès")
            this.loadFournisseurs()
          },
          error: () => this.toastr.error('Erreur suppression fournisseur')
        });
      }
    }
  }

  editFournisseur(fournisseur: FournisseurDTO) {
    this.openModal(fournisseur);
  }

  resetForm() {
    this.nouveauFournisseur = {
      username: '',
      email: '',
      password: '',
      raisonSociale: '',
      phoneNumber: '',
      role: 'FOURNISSEUR' // Ne pas oublier de fixer à nouveau le rôle ici
    };
  }
}
