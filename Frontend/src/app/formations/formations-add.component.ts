import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FormationService } from './formation.service';
import { EtablissementService } from '../etablissements/etablissement.service';
import { UploadedDoc } from './formation.model';

@Component({
  selector: 'app-formations-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './formations-add.component.html'
})
export class FormationsAddComponent implements OnInit {
  form!: FormGroup;
  constructor(private fb: FormBuilder, private svc: FormationService, private etabSvc: EtablissementService, private router: Router) {
    this.form = this.fb.group({
      nomFiliere: ['', [Validators.required, Validators.minLength(2)]],
      diplomeDelivre: ['', Validators.required],
      domaine: [''],
      doubleDiplome: [false],
      dureeFormation: [1, [Validators.min(1)]],
      etatAccreditation: ['Accréditée'],
      dateCreation: ['', Validators.required],
      dateOuverture: ['', Validators.required],
      nombreDiplomesN1: [0, [Validators.min(0)]],
      nombreEnseignants: [0, [Validators.min(0)]],
      nombreInscrits: [0, [Validators.min(0)]],
      revisionsRecentes: [''],
      etablissementId: ['', Validators.required]
    });
  }

  get etablissements() { return this.etabSvc.snapshot; }

  // Import Excel par année et niveau (temporaire avant enregistrement)
  years: string[] = [];
  levels: string[] = [];
  selectedYear = '';
  selectedLevel = '';
  imports: { [annee: string]: { [niveau: string]: UploadedDoc[] } } = {};

  ngOnInit(): void {
    this.initSelections();
    // Adapter dynamiquement les niveaux selon la durée
    this.form.get('dureeFormation')?.valueChanges.subscribe((v: number) => {
      const n = Math.max(1, Number(v) || 1);
      this.levels = Array.from({ length: n }, (_, i) => `L${i + 1}`);
      if (!this.levels.includes(this.selectedLevel)) this.selectedLevel = this.levels[0] || '';
    });
  }

  private initSelections() {
    const current = new Date().getFullYear();
    this.years = Array.from({ length: 6 }, (_, i) => String(current - i));
    const n = Math.max(1, Number(this.form.get('dureeFormation')?.value) || 1);
    this.levels = Array.from({ length: n }, (_, i) => `L${i + 1}`);
    this.selectedYear = this.years[0] || '';
    this.selectedLevel = this.levels[0] || '';
  }

  onYearChange(v: string) { this.selectedYear = v; }
  onLevelChange(v: string) { this.selectedLevel = v; }

  onFileSelected(evt: Event) {
    if (!this.selectedYear || !this.selectedLevel) return;
    const input = evt.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    const ok = /\.(xlsx?|XLSX?)$/.test(file.name);
    if (!ok) { alert('Veuillez sélectionner un fichier Excel (.xls ou .xlsx).'); return; }

    const doc: UploadedDoc = {
      name: file.name,
      type: file.type || 'application/vnd.ms-excel',
      size: file.size,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file)
    };

    if (!this.imports[this.selectedYear]) this.imports[this.selectedYear] = {};
    if (!this.imports[this.selectedYear][this.selectedLevel]) this.imports[this.selectedYear][this.selectedLevel] = [];
    this.imports[this.selectedYear][this.selectedLevel] = [doc, ...this.imports[this.selectedYear][this.selectedLevel]];
    (evt.target as HTMLInputElement).value = '';
  }

  get currentDocs(): UploadedDoc[] {
    if (!this.selectedYear || !this.selectedLevel) return [];
    return this.imports[this.selectedYear]?.[this.selectedLevel] || [];
  }

  removeDoc(index: number) {
    if (!this.selectedYear || !this.selectedLevel) return;
    const list = [...(this.imports[this.selectedYear]?.[this.selectedLevel] || [])];
    list.splice(index, 1);
    if (!this.imports[this.selectedYear]) this.imports[this.selectedYear] = {};
    this.imports[this.selectedYear][this.selectedLevel] = list;
  }

  // Aperçu plein écran (sans parsing Excel pour l'instant)
  previewOpen = false;
  previewTitle = '';
  previewUrl: string | undefined;
  openPreview(doc: UploadedDoc) {
    this.previewTitle = doc.name + ` • ${this.selectedYear} ${this.selectedLevel}`;
    this.previewUrl = doc.url;
    this.previewOpen = true;
  }
  closePreview() { this.previewOpen = false; this.previewUrl = undefined; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.svc.create({ ...this.form.getRawValue(), imports: this.imports });
    this.router.navigate(['/formations']);
  }
  cancel() { this.router.navigate(['/formations']); }
}
