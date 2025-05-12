import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {AuthGuard} from './guards/auth.guard';
import {AdminDashboardComponent} from './pages/admin-dashboard/admin-dashboard.component';
import {UserDashboardComponent} from './pages/user-dashboard/user-dashboard.component';
import {homeGuard} from './guards/home.guard';
import {ChangePasswordComponent} from './pages/change-password/change-password.component';
import {DashboardComponent} from './components/admin/dashboard/dashboard.component';
import {ProduitsComponent} from './components/admin/produits/produits.component';
import {CommandesComponent} from './components/admin/commandes/commandes.component';
import {ClientsComponent} from './components/admin/clients/clients.component';
import {FournisseursComponent} from './components/admin/fournisseurs/fournisseurs.component';
import {ReceptionCommandesComponent} from './components/admin/reception-commandes/reception-commandes.component';
import {HistoriqueReceptionsComponent} from './components/admin/historique-receptions/historique-receptions.component';
import {VentesComponent} from './components/admin/ventes/ventes.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [homeGuard]
  },
  {
    path: 'dashboard/admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'fournisseurs', component: FournisseursComponent },
      { path: 'produits', component: ProduitsComponent },
      { path: 'commandes', component: CommandesComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'reception-commandes', component: ReceptionCommandesComponent },
      { path: 'historique-receptions', component: HistoriqueReceptionsComponent },
      { path: 'ventes' , component:VentesComponent},
    ]
  },
  {
    path: 'dashboard/user',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'USER' }
  },
  { path: 'dashboard/change-password',
    canActivate: [AuthGuard],
    component: ChangePasswordComponent },



];
