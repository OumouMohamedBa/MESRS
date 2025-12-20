import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DashboardService } from './dashboard.service';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { TexteService } from '../textes/texte.service';
import { Texte } from '../textes/texte.model';
import { UserDto, UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, ChatbotComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  currentDate = new Date(); // Date actuelle pour l'affichage

  activeTab: 'textes' | 'etablissements' | 'formations' | 'utilisateurs' = 'textes';
  
  stats = {
    textes: {
      total: 0,
      enVigueur: 0,
      abroges: 0,
      projet: 0
    },
    etablissements: {
      total: 0
    },
    formations: {
      total: 0
    },
    utilisateurs: {
      total: 0,
      active: 0,
      validated: 0
    }
  };

  // Données pour les graphiques
  chartData = {
    textes: { labels: [] as string[], data: [] as number[] },
    etablissements: { labels: [] as string[], data: [] as number[] },
    formations: { labels: [] as string[], data: [] as number[] },
    utilisateurs: { labels: [] as string[], data: [] as number[] }
  };

  etablissementsTop: Array<{ label: string; count: number; percent: number }> = [];
  formationsTop: Array<{ label: string; count: number; percent: number }> = [];
  utilisateursTop: Array<{ label: string; count: number; percent: number }> = [];

  topCategories: Array<{
    label: string;
    percent: number;
    badgeClass: string;
    barClass: string;
  }> = [];

  recentTextes: Texte[] = [];

  constructor(
    private dashboardService: DashboardService,
    private texteService: TexteService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadAllStats();
    this.loadTextesInsights();
  }

  setTab(tab: 'textes' | 'etablissements' | 'formations' | 'utilisateurs'): void {
    this.activeTab = tab;
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

    this.dashboardService.getEtablissementStats().subscribe({
      next: stats => {
        this.stats.etablissements.total = stats.total;
        const byStatut = this.recordToSortedArray(stats.parStatut);
        this.chartData.etablissements.labels = byStatut.map(x => x.label);
        this.chartData.etablissements.data = byStatut.map(x => x.count);
        this.etablissementsTop = byStatut
          .slice(0, 5)
          .map(x => ({ ...x, percent: this.toPercent(x.count, stats.total) }));
      },
      error: err => {
        console.error('Erreur lors du chargement des stats établissements', err);
        this.stats.etablissements.total = 0;
        this.chartData.etablissements.labels = [];
        this.chartData.etablissements.data = [];
        this.etablissementsTop = [];
      }
    });

    this.dashboardService.getFormationStats().subscribe({
      next: stats => {
        this.stats.formations.total = stats.total;
        const byDiplome = this.recordToSortedArray(stats.parDiplome);
        this.chartData.formations.labels = byDiplome.map(x => x.label);
        this.chartData.formations.data = byDiplome.map(x => x.count);
        this.formationsTop = byDiplome
          .slice(0, 5)
          .map(x => ({ ...x, percent: this.toPercent(x.count, stats.total) }));
      },
      error: err => {
        console.error('Erreur lors du chargement des stats formations', err);
        this.stats.formations.total = 0;
        this.chartData.formations.labels = [];
        this.chartData.formations.data = [];
        this.formationsTop = [];
      }
    });

    this.userService.getAll().subscribe({
      next: users => {
        const list = users || [];
        this.stats.utilisateurs.total = list.length;
        this.stats.utilisateurs.active = list.filter(u => !!u.active).length;
        this.stats.utilisateurs.validated = list.filter(u => !!u.validated).length;

        const byRole = this.countByRole(list);
        const roleArr = this.recordToSortedArray(byRole);
        this.chartData.utilisateurs.labels = roleArr.map(x => x.label);
        this.chartData.utilisateurs.data = roleArr.map(x => x.count);
        this.utilisateursTop = roleArr
          .slice(0, 5)
          .map(x => ({ ...x, percent: this.toPercent(x.count, this.stats.utilisateurs.total) }));
      },
      error: err => {
        console.error('Erreur lors du chargement des stats utilisateurs', err);
        this.stats.utilisateurs.total = 0;
        this.stats.utilisateurs.active = 0;
        this.stats.utilisateurs.validated = 0;
        this.chartData.utilisateurs.labels = [];
        this.chartData.utilisateurs.data = [];
        this.utilisateursTop = [];
      }
    });
  }

  private loadTextesInsights(): void {
    this.texteService.list().subscribe({
      next: textes => {
        const list = textes || [];
        this.recentTextes = [...list]
          .sort((a, b) => this.toTimestamp(b.datePublication) - this.toTimestamp(a.datePublication))
          .slice(0, 3);

        const total = list.length;
        const loisDecrets = this.countByTypeGroup(list, 'lois_decrets');
        const arretes = this.countByTypeGroup(list, 'arretes');
        const circulaires = this.countByTypeGroup(list, 'circulaires');

        this.topCategories = [
          {
            label: 'Lois et décrets',
            percent: this.toPercent(loisDecrets, total),
            badgeClass: 'text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full',
            barClass: 'bg-gradient-to-r from-blue-500 to-blue-400'
          },
          {
            label: 'Arrêtés ministériels',
            percent: this.toPercent(arretes, total),
            badgeClass: 'text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full',
            barClass: 'bg-gradient-to-r from-emerald-500 to-emerald-400'
          },
          {
            label: 'Circulaires et notes',
            percent: this.toPercent(circulaires, total),
            badgeClass: 'text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full',
            barClass: 'bg-gradient-to-r from-amber-500 to-amber-400'
          }
        ];
      },
      error: err => {
        console.error('Erreur lors du chargement des textes pour le dashboard', err);
        this.recentTextes = [];
        this.topCategories = [];
      }
    });
  }

  private toPercent(value: number, total: number): number {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  }

  private toTimestamp(dateStr: string | undefined | null): number {
    if (!dateStr) return 0;
    const t = new Date(dateStr).getTime();
    return Number.isFinite(t) ? t : 0;
  }

  private countByTypeGroup(list: Texte[], group: 'lois_decrets' | 'arretes' | 'circulaires'): number {
    return list.filter(t => this.getTypeGroup(t.typeDocument) === group).length;
  }

  private getTypeGroup(typeDocument: string | undefined | null): 'lois_decrets' | 'arretes' | 'circulaires' | 'autres' {
    const v = (typeDocument || '').toLowerCase();
    if (v.includes('loi') || v.includes('décret') || v.includes('decret')) return 'lois_decrets';
    if (v.includes('arrêt') || v.includes('arrete')) return 'arretes';
    if (v.includes('circulaire') || v.includes('note')) return 'circulaires';
    return 'autres';
  }

  getRecentBadgeClass(t: Texte): string {
    const s = (t.statutApplication || '').toLowerCase();
    if (s.includes('vigueur')) return 'text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full';
    if (s.includes('projet')) return 'text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full';
    if (s.includes('abrog')) return 'text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full';
    return 'text-xs font-semibold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full';
  }

  getRecentBadgeLabel(t: Texte): string {
    const s = (t.statutApplication || '').toLowerCase();
    if (s.includes('vigueur')) return 'Mis à jour';
    if (s.includes('projet')) return 'Révision';
    if (s.includes('abrog')) return 'Consulté';
    return 'Mis à jour';
  }

  private recordToSortedArray(record: Record<string, number> | undefined | null): Array<{ label: string; count: number }> {
    const entries = Object.entries(record || {})
      .map(([label, count]) => ({ label: label || '—', count: Number(count) || 0 }))
      .filter(x => x.count > 0)
      .sort((a, b) => b.count - a.count);
    return entries;
  }

  private countByRole(users: UserDto[]): Record<string, number> {
    const out: Record<string, number> = {};
    users.forEach(u => {
      const role = (u.role || '—').toString();
      out[role] = (out[role] || 0) + 1;
    });
    return out;
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

