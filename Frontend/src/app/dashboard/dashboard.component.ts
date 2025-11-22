import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  stats = {
    textes: {
      total: 0,
      enVigueur: 0,
      abroges: 0,
      projet: 0
    }
  };

  // Données pour les graphiques
  chartData = {
    textes: { labels: [] as string[], data: [] as number[] }
  };

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadAllStats();
  }

  loadAllStats(): void {
    // Textes réglementaires (stats depuis le backend)
    this.dashboardService.getTextesStats().subscribe(stats => {
      this.stats.textes.total = stats.total;
      this.stats.textes.enVigueur = stats.enVigueur;
      this.stats.textes.abroges = stats.abroges;
      this.stats.textes.projet = stats.projet;

      // Mettre a jour les donnees du graphique a partir des stats
      this.chartData.textes.labels = ['En vigueur', 'Abrogés', 'Projet'];
      this.chartData.textes.data = [
        stats.enVigueur,
        stats.abroges,
        stats.projet
      ];
    });
  }

  // Méthodes pour générer les points SVG des graphiques
  generateLinePath(data: number[], width: number, height: number): string {
    if (data.length === 0) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    const points = data.map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });
    return 'M ' + points.join(' L ');
  }

  getMaxValue(data: number[]): number {
    return Math.max(...data, 1);
  }

  // Méthodes pour le graphique circulaire
  getCircumference(): number {
    return 2 * Math.PI * 15.9155; // r = 15.9155
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }

  getDashArray(value: number, total: number): string {
    const circumference = this.getCircumference();
    const percentage = this.getPercentage(value, total);
    const dashLength = (percentage / 100) * circumference;
    return `${dashLength}, ${circumference}`;
  }

  getDashOffset(index: number): number {
    const circumference = this.getCircumference();
    let offset = circumference * 0.25; // Commencer à 25% (haut du cercle)
    
    if (index === 0) {
      // Premier segment (En vigueur)
      return offset;
    } else if (index === 1) {
      // Deuxième segment (Abrogés) - après En vigueur
      const enVigueurPercent = this.getPercentage(this.stats.textes.enVigueur, this.stats.textes.total);
      offset -= (enVigueurPercent / 100) * circumference;
      return offset;
    } else {
      // Troisième segment (Projets) - après En vigueur et Abrogés
      const enVigueurPercent = this.getPercentage(this.stats.textes.enVigueur, this.stats.textes.total);
      const abrogesPercent = this.getPercentage(this.stats.textes.abroges, this.stats.textes.total);
      offset -= ((enVigueurPercent + abrogesPercent) / 100) * circumference;
      return offset;
    }
  }
}

