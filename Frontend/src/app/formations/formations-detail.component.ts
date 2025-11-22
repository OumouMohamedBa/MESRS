import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FormationService } from './formation.service';
import { Formation, UploadedDoc } from './formation.model';

@Component({
  selector: 'app-formations-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './formations-detail.component.html'
})
export class FormationsDetailComponent implements OnInit {
  data: Formation | null = null;
  constructor(private route: ActivatedRoute, private router: Router, private svc: FormationService) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.data = this.svc.getById(id);
    if (!this.data) this.router.navigate(['/formations']);
    this.initSelections();
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

  onFileSelected(evt: Event) {
    if (!this.data || !this.selectedYear || !this.selectedLevel) return;
    const input = evt.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    // Accepter uniquement xls/xlsx
    const ok = /\.(xlsx?|XLSX?)$/.test(file.name);
    if (!ok) { alert('Veuillez sélectionner un fichier Excel (.xls ou .xlsx).'); return; }

    const doc: UploadedDoc = {
      name: file.name,
      type: file.type || 'application/vnd.ms-excel',
      size: file.size,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file)
    };

    const imports = { ...(this.data.imports || {}) } as Formation['imports'];
    if (!imports![this.selectedYear]) imports![this.selectedYear] = {};
    if (!imports![this.selectedYear][this.selectedLevel]) imports![this.selectedYear][this.selectedLevel] = [];
    imports![this.selectedYear][this.selectedLevel] = [doc, ...imports![this.selectedYear][this.selectedLevel]!];

    this.svc.update(this.data.id, { imports });
    this.data = this.svc.getById(this.data.id);
    (evt.target as HTMLInputElement).value = '';
  }

  get currentDocs(): UploadedDoc[] {
    if (!this.data || !this.selectedYear || !this.selectedLevel) return [];
    return this.data.imports?.[this.selectedYear]?.[this.selectedLevel] || [];
  }

  removeDoc(index: number) {
    if (!this.data || !this.selectedYear || !this.selectedLevel) return;
    const year = this.selectedYear; const level = this.selectedLevel;
    this.removeDocAt(year, level, index);
  }

  removeDocAt(year: string, level: string, index: number) {
    if (!this.data) return;
    const imports = { ...(this.data.imports || {}) } as Formation['imports'];
    const list = [...(imports?.[year]?.[level] || [])];
    list.splice(index, 1);
    if (!imports![year]) imports![year] = {};
    imports![year][level] = list;
    this.svc.update(this.data.id, { imports });
    this.data = this.svc.getById(this.data.id);
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
