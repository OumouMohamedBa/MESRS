import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FormationService } from './formation.service';
import { Formation } from './formation.model';
import { EtablissementService } from '../etablissements/etablissement.service';

@Component({
  selector: 'app-formations-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './formations-list.component.html'
})
export class FormationsListComponent {
  constructor(
    private svc: FormationService,
    private etabSvc: EtablissementService,
    private router: Router
  ) {
    this.loadFormations();
  }

  private loadFormations() {
    this.svc.list().subscribe({
      next: data => {
        this.all.set(data || []);
      },
      error: err => {
        console.error('Erreur lors du chargement des formations', err);
        this.all.set([]);
      }
    });
  }

  langue = signal<'fr'|'ar'|'en'>('fr');
  isDark = signal(false);

  query = signal('');
  diplome = signal('');
  domaine = signal('');
  etablissementId = signal<string>('');

  page = signal(1);
  pageSize = signal(10);

  all = signal<Formation[]>([]);

  filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    const d = this.diplome();
    const dom = this.domaine().toLowerCase().trim();
    const etab = this.etablissementId();

    return this.all().filter(f => {
      const matchQ = !q || [f.nomFiliere, f.diplomeDelivre].some(v => v.toLowerCase().includes(q));
      const matchDiplome = !d || f.diplomeDelivre === d;
      const matchDomaine = !dom || f.domaine.toLowerCase().includes(dom);
      const matchEtab = !etab || f.etablissementId === etab;
      return matchQ && matchDiplome && matchDomaine && matchEtab;
    });
  });

  paged = computed(() => {
    const p = this.page();
    const size = this.pageSize();
    const start = (p - 1) * size;
    return this.filtered().slice(start, start + size);
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));

  clearFilters() {
    this.query.set('');
    this.diplome.set('');
    this.domaine.set('');
    this.etablissementId.set('');
    this.page.set(1);
  }

  openAddForm() { this.router.navigate(['/formations/nouveau']); }
  edit(id: string) { this.router.navigate(['/formations', id, 'edit']); }
  view(id: string) { this.router.navigate(['/formations', id]); }
  remove(id: string) {
    if (!confirm('Supprimer cette formation ?')) return;
    this.svc.delete(id).subscribe({
      next: () => {
        // recharger la liste
        this.loadFormations();
      },
      error: err => {
        console.error('Erreur lors de la suppression de la formation', err);
      }
    });
  }

  onQueryInput(v: string) { this.query.set(v); this.page.set(1); }
  onDiplomeChange(v: string) { this.diplome.set(v); this.page.set(1); }
  onDomaineInput(v: string) { this.domaine.set(v); this.page.set(1); }
  onEtabChange(v: string) { this.etablissementId.set(v); this.page.set(1); }

  onToggleSidebar() {}
  onChangeLang(lang: 'fr'|'ar'|'en') { this.langue.set(lang); }
  onToggleDark() { this.isDark.update(v => !v); }
  onOpenNotifications() {}
  onLogout() { this.router.navigate(['/login']); }
}
