import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  // Données mock pour les statistiques
  getEtablissementsStats() {
    return of({
      total: 45,
      publics: 32,
      prives: 13,
      enAttente: 5
    });
  }

  getInfrastructuresStats() {
    return of({
      total: 128,
      operationnelles: 98,
      enMaintenance: 20,
      enConstruction: 10
    });
  }

  getFormationsStats() {
    return of({
      total: 156,
      licences: 78,
      masters: 52,
      doctorats: 26
    });
  }

  getRessourcesHumainesStats() {
    return of({
      total: 2847,
      enseignants: 1856,
      administratifs: 756,
      techniques: 235
    });
  }

  getFinancesStats() {
    return of({
      budgetTotal: 125000000,
      budgetUtilise: 87500000,
      budgetRestant: 37500000,
      projets: 24
    });
  }

  getRechercheStats() {
    return of({
      projets: 89,
      enCours: 56,
      termines: 28,
      publies: 15
    });
  }

  getInspectionStats() {
    return of({
      total: 12,
      planifiees: 8,
      enCours: 2,
      terminees: 2
    });
  }

  // Données historiques pour les graphiques
  getTextesEvolution() {
    return of({
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
      data: [35, 38, 40, 42, 41, 43, 45, 44, 46, 45, 47, 48]
    });
  }

  getEtablissementsEvolution() {
    return of({
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
      data: [38, 39, 40, 41, 42, 43, 44, 44, 45, 45, 45, 45]
    });
  }

  getFormationsEvolution() {
    return of({
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
      licences: [70, 72, 74, 75, 76, 77, 77, 78, 78, 78, 78, 78],
      masters: [48, 49, 50, 50, 51, 51, 52, 52, 52, 52, 52, 52],
      doctorats: [22, 23, 24, 24, 25, 25, 25, 26, 26, 26, 26, 26]
    });
  }

  getRHEvolution() {
    return of({
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
      enseignants: [1800, 1820, 1835, 1845, 1850, 1853, 1855, 1856, 1856, 1856, 1856, 1856],
      administratifs: [740, 745, 750, 752, 754, 755, 756, 756, 756, 756, 756, 756],
      techniques: [230, 232, 233, 234, 234, 235, 235, 235, 235, 235, 235, 235]
    });
  }

  getBudgetEvolution() {
    return of({
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
      budgetUtilise: [50000000, 55000000, 60000000, 65000000, 70000000, 75000000, 80000000, 82000000, 85000000, 87000000, 87500000, 87500000],
      budgetTotal: 125000000
    });
  }

  getRechercheEvolution() {
    return of({
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
      enCours: [45, 48, 50, 52, 53, 54, 55, 55, 56, 56, 56, 56],
      termines: [20, 22, 24, 25, 26, 27, 27, 28, 28, 28, 28, 28],
      publies: [10, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 15]
    });
  }
}

