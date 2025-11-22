import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FormationService } from './formation.service';
import { Formation, FormationUpdatePayload, UploadedDoc } from './formation.model';

@Component({
  selector: 'app-formations-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './formations-detail.component.html'
})
export class FormationsDetailComponent implements OnInit {
  data: Formation | null = null;
  importsList: any[] = []; // Liste des imports depuis le backend
  
  constructor(private route: ActivatedRoute, private router: Router, private svc: FormationService) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(id).subscribe({
      next: data => {
        if (!data) {
          this.router.navigate(['/formations']);
          return;
        }
        this.data = data;
        this.initSelections();
        // Charger la liste des imports depuis le backend
        this.loadImports(id);
      },
      error: err => {
        console.error('Erreur lors du chargement de la formation', err);
        this.router.navigate(['/formations']);
      }
    });
  }

  back() { this.router.navigate(['/formations']); }
  edit() { if (this.data) this.router.navigate(['/formations', this.data.id, 'edit']); }

  // Import Excel par année et niveau
  years: string[] = [];
  levels: string[] = [];
  selectedYear = '';
  selectedLevel = '';

  private initSelections() {
    const current = new Date().getFullYear();
    // Liste des 6 dernières années académiques
    this.years = Array.from({ length: 6 }, (_, i) => String(current - i));
    // Niveaux dynamiques selon la durée de la formation (L1..Ln ou M1..Mn si voulu)
    const n = this.data?.dureeFormation ?? 3;
    this.levels = Array.from({ length: n }, (_, i) => `L${i + 1}`);
    this.selectedYear = this.years[0] || '';
    this.selectedLevel = this.levels[0] || '';
  }

  onYearChange(v: string) { this.selectedYear = v; }
  onLevelChange(v: string) { this.selectedLevel = v; }

  // Charger les imports depuis le backend
  private loadImports(id: string) {
    this.svc.listImports(id).subscribe({
      next: (imports) => {
        this.importsList = imports || [];
        console.log('Imports chargés:', this.importsList);
      },
      error: err => {
        console.error('Erreur lors du chargement des imports', err);
        this.importsList = [];
      }
    });
  }

  // Recharger les imports après upload/suppression
  private refreshImports() {
    if (this.data) {
      this.loadImports(this.data.id);
    }
  }

  onFileSelected(evt: Event) {
    if (!this.data || !this.selectedYear || !this.selectedLevel) return;
    const input = evt.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    // Accepter uniquement xls/xlsx
    const ok = /\.(xlsx?|XLSX?)$/.test(file.name);
    if (!ok) { alert('Veuillez sélectionner un fichier Excel (.xls ou .xlsx).'); return; }

    // Upload vers le backend
    if (!this.data) return;
    const dataId = this.data.id; // capturer l'ID avant le subscribe
    this.svc.uploadExcel(dataId, this.selectedYear, this.selectedLevel, file).subscribe({
      next: (doc) => {
        console.log('Upload réussi:', doc);
        // Recharger la liste des imports depuis le backend
        this.refreshImports();
        (evt.target as HTMLInputElement).value = '';
      },
      error: err => {
        console.error('Erreur lors de l\'upload du fichier Excel', err);
        if (err.error) {
          console.error('Body erreur upload:', err.error);
        }
        alert('Erreur lors de l\'upload du fichier Excel');
      }
    });
  }

  get currentDocs(): any[] {
    // Filtrer les imports selon l'année et le niveau sélectionnés
    return this.importsList.filter(imp => 
      imp.anneeUniversitaire === this.selectedYear && 
      imp.niveau === this.selectedLevel
    );
  }

  removeDoc(index: number) {
    if (!this.data || !this.selectedYear || !this.selectedLevel) return;
    const year = this.selectedYear; const level = this.selectedLevel;
    this.removeDocAt(year, level, index);
  }

  removeDocAt(year: string, level: string, index: number) {
    if (!this.data) return;
    const docs = this.currentDocs;
    const docToDelete = docs[index];
    if (!docToDelete) return;

    // Supprimer via le backend en utilisant l'ID de l'import
    this.svc.deleteImport(docToDelete.id).subscribe({
      next: () => {
        console.log('Suppression réussie');
        // Recharger la liste des imports
        this.refreshImports();
      },
      error: err => {
        console.error('Erreur lors de la suppression du fichier', err);
        alert('Erreur lors de la suppression du fichier');
      }
    });
  }

  removeDocByRef(year: string, level: string, doc: UploadedDoc) {
    if (!this.data) return;
    const imports = this.data.imports || {};
    const list = imports[year]?.[level] || [];
    const idx = list.findIndex(d => d.name === doc.name && d.uploadedAt === doc.uploadedAt);
    if (idx >= 0) this.removeDocAt(year, level, idx);
  }

  // Agrégation: tous les fichiers (toutes années et niveaux)
  get allDocs(): { year: string; level: string; index: number; doc: UploadedDoc }[] {
    const res: { year: string; level: string; index: number; doc: UploadedDoc }[] = [];
    const imports = this.data?.imports || {};
    for (const year of Object.keys(imports)) {
      const byLevel = imports[year] || {};
      for (const lvl of Object.keys(byLevel)) {
        const arr = byLevel[lvl] || [];
        arr.forEach((d: UploadedDoc, idx: number) => {
          res.push({ year, level: lvl, index: idx, doc: d });
        });
      }
    }
    // Optionnel: trier par année desc puis par niveau
    return res.sort((a, b) => (b.year.localeCompare(a.year)) || a.level.localeCompare(b.level));
  }

  // Aperçu plein écran (note: certains navigateurs ne prévisualisent pas xls/xlsx)
  previewOpen = false;
  previewTitle = '';
  previewUrl: string | undefined;
  openPreview(doc: UploadedDoc, label?: string) {
    this.previewTitle = label ? `${doc.name} • ${label}` : doc.name;
    this.previewUrl = doc.url;
    this.previewOpen = true;
  }
  closePreview() { this.previewOpen = false; this.previewUrl = undefined; }
  
}
