import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TexteService } from './texte.service';
import { Texte } from './texte.model';

@Component({
  selector: 'app-textes-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, SidebarComponent, DatePipe],
  templateUrl: './textes-detail.component.html'
})
export class TextesDetailComponent implements OnInit {
  texte: Texte | null = null;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: TexteService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = Number(idParam);
    if (!this.id) {
      this.router.navigate(['/textes']);
      return;
    }
    this.texte = this.svc.getById(this.id);
    if (!this.texte) {
      this.router.navigate(['/textes']);
    }
  }

  getFileName(): string {
    if (!this.texte) return 'document.pdf';
    // Nettoyer le titre pour en faire un nom de fichier valide
    const cleanTitle = this.texte.titre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
      .trim();
    return `${cleanTitle}.pdf`;
  }
}
