import {Component, OnInit} from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { ToastrService } from 'ngx-toastr';
import {DashboardStats} from './dashboard-stats.model';
import {DashboardService} from '../../../services/dashboard.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgxChartsModule,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  statutChartData: any[] = [];
  fournisseurChartData: any[] = [];
  topProduitsChartData: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;

        this.statutChartData = this.toChartData(data.commandesParStatut);
        this.fournisseurChartData = this.toChartData(data.commandesParFournisseur);
        this.topProduitsChartData = this.toChartData(data.topProduitsCommandes);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du dashboard :', err);
      }
    });
  }

  private toChartData(obj: Record<string, number>): any[] {
    return Object.entries(obj).map(([name, value]) => ({ name, value }));
  }
}
