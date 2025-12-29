import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EtablissementService } from '../etablissements/etablissement.service';
import { FormationService } from '../formations/formation.service';
import { environment } from '../../environments/environment';

export interface TextesStats {
  totalTextes: number;
  textesEnVigueur: number;
  textesAbroges: number;
  textesProjet: number;
}

export interface EtablissementStats {
  total: number;
  parType: Record<string, number>;
  parStatut: Record<string, number>;
}

export interface FormationStats {
  total: number;
  parEtablissement: Record<string, number>;
  parDomaine: Record<string, number>;
  parDiplome: Record<string, number>;
}

export interface ChatbotResponse {
  type: 'text' | 'stats' | 'report';
  message: string;
  data?: any;
  reportData?: any;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = 'http://localhost:8080/api/texte/stats';

  constructor(
    private http: HttpClient,
    private etablissementService: EtablissementService,
    private formationService: FormationService
  ) {}

  getTextesStats(): Observable<TextesStats> {
    return this.http.get<TextesStats>(`${this.apiUrl}`);
  }

  // Statistiques des établissements
  getEtablissementStats(): Observable<EtablissementStats> {
    return this.etablissementService.list().pipe(
      map(etablissements => {
        const stats: EtablissementStats = {
          total: etablissements.length,
          parType: {},
          parStatut: {}
        };

        etablissements.forEach(etab => {
          stats.parType[etab.type] = (stats.parType[etab.type] || 0) + 1;
          stats.parStatut[etab.statutJuridique] = (stats.parStatut[etab.statutJuridique] || 0) + 1;
        });

        return stats;
      })
    );
  }

  // Statistiques des formations
  getFormationStats(): Observable<FormationStats> {
    return this.formationService.list().pipe(
      map(formations => {
        const stats: FormationStats = {
          total: formations.length,
          parEtablissement: {},
          parDomaine: {},
          parDiplome: {}
        };

        formations.forEach(formation => {
          if (formation.etablissementId) {
            stats.parEtablissement[formation.etablissementId] = (stats.parEtablissement[formation.etablissementId] || 0) + 1;
          }
          if (formation.domaine) {
            stats.parDomaine[formation.domaine] = (stats.parDomaine[formation.domaine] || 0) + 1;
          }
          if (formation.diplomeDelivre) {
            stats.parDiplome[formation.diplomeDelivre] = (stats.parDiplome[formation.diplomeDelivre] || 0) + 1;
          }
        });

        return stats;
      })
    );
  }

  // Obtenir les textes pour un établissement spécifique
  getTextesForEtablissement(etablissementId: string): Observable<number> {
    // Mock pour l'instant - à adapter selon votre API
    return of(Math.floor(Math.random() * 50) + 10);
  }

  // Obtenir les formations pour un établissement spécifique
  getFormationsForEtablissement(etablissementId: string): Observable<number> {
    return this.formationService.list().pipe(
      map(formations => formations.filter(f => f.etablissementId === etablissementId).length)
    );
  }

  // Logique du chatbot
  processChatbotQuery(query: string): Observable<ChatbotResponse> {
    const lowerQuery = query.toLowerCase();
    console.log('Processing chatbot query:', lowerQuery);
    
    // Compter le nombre d'établissements
    if (lowerQuery.includes('combien') && lowerQuery.includes('établissement')) {
      console.log('Detected établissements count query');
      return this.getEtablissementStats().pipe(
        map(stats => {
          console.log('Etablissement stats received:', stats);
          return {
            type: 'stats' as const,
            message: `Il y a actuellement ${stats.total} établissements répartis comme suit:`,
            data: stats
          };
        }),
        catchError(error => {
          console.error('Error getting établissement stats:', error);
          return of({
            type: 'text' as const,
            message: 'Erreur lors de la récupération des statistiques des établissements.'
          });
        })
      );
    }

    // Compter les textes pour un établissement spécifique
    const matchEtablissement = lowerQuery.match(/textes? pour l?é?tablissement\s*(e?\d+)/i);
    if (matchEtablissement) {
      const etablissementId = matchEtablissement[1].toUpperCase();
      return this.getTextesForEtablissement(etablissementId).pipe(
        map(count => ({
          type: 'stats' as const,
          message: `L'établissement ${etablissementId} a ${count} texte(s) réglementaire(s).`,
          data: { etablissementId, count }
        }))
      );
    }

    // Compter les formations pour un établissement spécifique
    const matchFormation = lowerQuery.match(/formations? pour\s*(e?\d+)/i);
    if (matchFormation) {
      const etablissementId = matchFormation[1].toUpperCase();
      return this.getFormationsForEtablissement(etablissementId).pipe(
        map(count => ({
          type: 'stats' as const,
          message: `L'établissement ${etablissementId} propose ${count} formation(s).`,
          data: { etablissementId, count }
        }))
      );
    }

    // Générer un rapport
    if (lowerQuery.includes('rapport') || lowerQuery.includes('générer')) {
      return this.generateReport().pipe(
        map(reportData => ({
          type: 'report' as const,
          message: 'Voici le rapport demandé:',
          reportData
        }))
      );
    }

    // Réponse par défaut
    return of({
      type: 'text' as const,
      message: 'Je peux vous aider avec les statistiques des établissements, des formations et des textes. Essayez de demander: "Combien d\'établissements ?", "Combien de textes pour l\'établissement E2 ?", ou "Générer un rapport".'
    });
  }

  // Générer un rapport complet
  generateReport(): Observable<any> {
    return new Observable(observer => {
      // Récupérer toutes les statistiques
      this.getTextesStats().subscribe(textesStats => {
        this.getEtablissementStats().subscribe(etabStats => {
          this.getFormationStats().subscribe(formStats => {
            const reportData = {
              date: new Date().toLocaleDateString('fr-FR'),
              textes: textesStats,
              etablissements: etabStats,
              formations: formStats,
              resume: {
                totalTextes: textesStats.totalTextes,
                totalEtablissements: etabStats.total,
                totalFormations: formStats.total
              }
            };
            observer.next(reportData);
            observer.complete();
          });
        });
      });
    });
  }
}