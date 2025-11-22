import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { TexteService } from './texte.service';
import { Texte, StatutTexte } from './texte.model';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-textes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, SidebarComponent],
  templateUrl: './textes-list.component.html'
})
export class TextesListComponent implements OnInit {

  constructor(private svc: TexteService, private router: Router) {}

  // 🔹 État global UI
  langue = signal<'fr' | 'ar' | 'en'>('fr');
  isDark = signal(false);
  // tu pourras l’utiliser plus tard pour ouvrir/fermer le sidebar en mobile
  isSidebarOpen = signal(true);

  // 🔹 Filtres / pagination
  query = signal('');
  statut = signal<StatutTexte | ''>('');
  date = signal<string>('');
  page = signal(1);
  pageSize = signal(10);

  // 🔹 Données
  all = signal<Texte[]>([]);

  // --- DERIVED ---

  filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    const s = this.statut();
    const d = this.date();

    return this.all().filter(t => {
      const matchQ =
        !q ||
        [t.titre, t.typeDocument, t.referenceOfficielle].some(v =>
          v.toLowerCase().includes(q)
        );

      const matchS = !s || t.statutApplication === s;
      const matchD = !d || t.datePublication === d;

      return matchQ && matchS && matchD;
    });
  });

  paged = computed(() => {
    const p = this.page();
    const size = this.pageSize();
    const start = (p - 1) * size;
    return this.filtered().slice(start, start + size);
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / this.pageSize()))
  );

  displayStart = computed(() =>
    (this.page() - 1) * this.pageSize() + 1
  );

  displayEnd = computed(() => {
    const end = this.page() * this.pageSize();
    return end > this.filtered().length ? this.filtered().length : end;
  });

  // --- ACTIONS LISTE ---

  clearFilters() {
    this.query.set('');
    this.statut.set('');
    this.date.set('');
    this.page.set(1);
  }

  openAddForm() {
    this.router.navigate(['/textes/nouveau']);
  }

  remove(id: string) {
    if (!confirm('Supprimer ce texte ?')) return;
    this.svc.delete(id).subscribe({
      next: () => {
        this.all.update(list => list.filter(t => t.id !== id));
        if (this.page() > this.totalPages()) {
          this.page.set(this.totalPages());
        }
      },
      error: err => {
        console.error('Erreur lors de la suppression du texte', err);
      }
    });
  }

  edit(id: string) {
    this.router.navigate(['/textes', id, 'edit']);
  }

  onQueryInput(v: string) {
    this.query.set(v);
    this.page.set(1);
  }

  onStatutChange(v: string) {
    this.statut.set(v as any);
    this.page.set(1);
  }

  onDateChange(v: string) {
    this.date.set(v);
    this.page.set(1);
  }

  pagePrev() {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
    }
  }

  pageNext() {
    if (this.page() < this.totalPages()) {
      this.page.set(this.page() + 1);
    }
  }

  pageGo(p: number) {
    const max = this.totalPages();
    if (p >= 1 && p <= max) {
      this.page.set(p);
    }
  }

  // --- HANDLERS POUR LE HEADER ---

  onToggleSidebar() {
    // pour l’instant juste toggle une valeur (tu pourras la connecter au <app-sidebar> si besoin)
    this.isSidebarOpen.update(v => !v);
    console.log('Sidebar toggle ->', this.isSidebarOpen());
  }

  onChangeLang(lang: 'fr' | 'ar' | 'en') {
    this.langue.set(lang);
    console.log('Changement de langue ->', lang);
    // ici tu peux aussi propager à un service i18n
  }

  onToggleDark() {
    this.isDark.update(v => !v);

    // Exemple simple : ajouter/enlever la classe 'dark' sur <html>
    const root = document.documentElement;
    if (this.isDark()) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  onOpenNotifications() {
    console.log('Ouvrir les notifications');
    // ouvrir un panneau, un modal… selon ton design
  }

  onLogout() {
    console.log('Déconnexion');
    // ex : this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.svc.list().subscribe({
      next: data => {
        this.all.set(data);
      },
      error: err => {
        console.error('Erreur lors du chargement des textes', err);
      }
    });
  }
}
