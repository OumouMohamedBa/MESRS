import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { EtablissementService } from './etablissement.service';
import { Etablissement } from './etablissement.model';

@Component({
  selector: 'app-etablissements-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './etablissements-list.component.html'
})
export class EtablissementsListComponent implements OnInit {

  constructor(
    private svc: EtablissementService,
    private router: Router
  ) {}

  // 🔹 État global UI (comme pour TextesListComponent)
  langue = signal<'fr' | 'ar' | 'en'>('fr');
  isDark = signal(false);
  isSidebarOpen = signal(true);

  // 🔹 Filtres / pagination
  query = signal('');
  statut = signal<string>('');        // Public / Privé / Autonome / ''
  locFilter = signal<string>('');     // filtre localisation
  page = signal(1);                   // ✅ existe bien
  pageSize = signal(10);

  // 🔹 Données
  all = signal<Etablissement[]>([]);

  showDeleteConfirm = signal(false);
  pendingDeleteEtab = signal<Etablissement | null>(null);
  deleting = signal(false);

  ngOnInit(): void {
    this.reload();
  }

  private reload() {
    this.svc.list().subscribe(list => {
      this.all.set(list || []);
      this.page.set(1);
    });
  }

  // --- DERIVED ---

  filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    const s = this.statut();
    const loc = this.locFilter().toLowerCase().trim();

    return this.all().filter(e => {
      const matchQ =
        !q ||
        [e.nom, e.type, e.statutJuridique, e.localisation]
          .filter(Boolean as any)
          .some(v => ('' + v).toLowerCase().includes(q));

      const matchS = !s || e.statutJuridique === s;
      const matchLoc = !loc || (e.localisation || '').toLowerCase().includes(loc);

      return matchQ && matchS && matchLoc;
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
    this.filtered().length === 0 ? 0 : (this.page() - 1) * this.pageSize() + 1
  );

  displayEnd = computed(() => {
    const end = this.page() * this.pageSize();
    return end > this.filtered().length ? this.filtered().length : end;
  });

  // --- ACTIONS LISTE ---

  clearFilters() {
    this.query.set('');
    this.statut.set('');
    this.locFilter.set('');
    this.page.set(1);
  }

  openAddForm() {
    this.router.navigate(['/etablissements/nouveau']);
  }

  remove(id: string) {
    // Appel HTTP asynchrone pour supprimer, puis recharger la liste
    this.svc.delete(id).subscribe({
      next: () => {
        this.reload();
      },
      error: err => {
        console.error('Erreur lors de la suppression de l\'établissement', err);
      }
    });
  }

  requestDelete(e: Etablissement): void {
    this.pendingDeleteEtab.set(e);
    this.showDeleteConfirm.set(true);
    document.body.style.overflow = 'hidden';
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.pendingDeleteEtab.set(null);
    this.deleting.set(false);
    document.body.style.overflow = 'auto';
  }

  confirmDelete(): void {
    const e = this.pendingDeleteEtab();
    if (!e || this.deleting()) {
      return;
    }
    this.deleting.set(true);

    this.svc.delete(e.id).subscribe({
      next: () => {
        this.reload();
        this.cancelDelete();
      },
      error: err => {
        console.error('Erreur lors de la suppression de l\'établissement', err);
        this.deleting.set(false);
      }
    });
  }

  edit(id: string) {
    this.router.navigate(['/etablissements', id, 'edit']);
  }

  onQueryInput(v: string) {
    this.query.set(v);
    this.page.set(1);
  }

  onStatutChange(v: string) {
    this.statut.set(v);
    this.page.set(1);
  }

  onLocalisationInput(v: string) {
    this.locFilter.set(v);
    this.page.set(1);
  }

  pagePrev() {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
    }
  }

  pageNext() {
    if (this.page() < this.totalPages()) {
      this.page.set(this.totalPages());
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
    this.isSidebarOpen.update(v => !v);
  }

  onChangeLang(lang: 'fr' | 'ar' | 'en') {
    this.langue.set(lang);
  }

  onToggleDark() {
    this.isDark.update(v => !v);

    const root = document.documentElement;
    if (this.isDark()) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  onOpenNotifications() {
    console.log('Ouvrir les notifications');
  }

  onLogout() {
    console.log('Déconnexion');
    // this.router.navigate(['/login']);
  }
}
