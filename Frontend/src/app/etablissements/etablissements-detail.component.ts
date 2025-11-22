import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './etablissements-detail.component.html'
})
export class EtablissementsDetailComponent implements OnInit {
  id!: string;
  etab: Etablissement | null = null;
  textes: Texte[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private etabSvc: EtablissementService,
    private texteSvc: TexteService
  ) {}

  ngOnInit(): void {
    this.id = String(this.route.snapshot.paramMap.get('id'));
    this.etab = this.etabSvc.getById(this.id);
    if (!this.etab) {
      this.router.navigate(['/etablissements']);
      return;
    }
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

  back() {
    this.router.navigate(['/etablissements']);
  }

  edit() {
    this.router.navigate(['/etablissements', this.id, 'edit']);
  }
}
