import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { EtablissementService } from './etablissement.service';
import { TexteService } from '../textes/texte.service';
import { Etablissement } from './etablissement.model';
import { Texte } from '../textes/texte.model';

@Component({
  selector: 'app-etablissements-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './etablissements-detail.component.html'
})
export class EtablissementsDetailComponent implements OnInit {
  id!: string;
  etab: Etablissement | null = null;
  textes: Texte[] = [];
  allTextes: Texte[] = [];
  selectedTexteId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private etabSvc: EtablissementService,
    private texteSvc: TexteService
  ) {}

  ngOnInit(): void {
    this.id = String(this.route.snapshot.paramMap.get('id'));
    this.etabSvc.getById(this.id).subscribe({
      next: data => {
        if (!data) {
          this.router.navigate(['/etablissements']);
          return;
        }
        this.etab = data;
      },
      error: err => {
        console.error('Erreur lors du chargement de l\'établissement', err);
        this.router.navigate(['/etablissements']);
      }
    });
    this.reloadTextesForEtab();

    // Charger tous les textes pour pouvoir en associer de nouveaux
    this.texteSvc.list().subscribe({
      next: data => {
        this.allTextes = data || [];
      },
      error: err => {
        console.error('Erreur lors du chargement de tous les textes', err);
        this.allTextes = [];
      }
    });
  }

  private reloadTextesForEtab(): void {
    this.texteSvc.getTextesByEtablissement(this.id).subscribe({
      next: data => {
        this.textes = data;
      },
      error: err => {
        console.error('Erreur lors du chargement des textes de l\'etablissement', err);
        this.textes = [];
      }
    });
  }

  // Textes encore non associés à cet établissement
  get availableTextes(): Texte[] {
    const associatedIds = new Set(this.textes.map(t => t.id));
    return this.allTextes.filter(t => !associatedIds.has(t.id));
  }

  associerTexte(): void {
    if (!this.selectedTexteId) return;
    this.etabSvc.addTexte(this.id, this.selectedTexteId).subscribe({
      next: () => {
        this.selectedTexteId = null;
        this.reloadTextesForEtab();
      },
      error: err => {
        console.error('Erreur lors de l\'association du texte', err);
      }
    });
  }

  retirerTexte(texteId: string): void {
    if (!confirm('Retirer ce texte de l\'établissement ?')) return;
    this.etabSvc.removeTexte(this.id, texteId).subscribe({
      next: () => {
        this.reloadTextesForEtab();
      },
      error: err => {
        console.error('Erreur lors du retrait du texte', err);
      }
    });
  }

  back() {
    this.router.navigate(['/etablissements']);
  }

  edit() {
    this.router.navigate(['/etablissements', this.id, 'edit']);
  }
}
