import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FormationService } from './formation.service';
import { EtablissementService } from '../etablissements/etablissement.service';
import { Formation } from './formation.model';

@Component({
  selector: 'app-formations-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './formations-edit.component.html'
})
export class FormationsEditComponent implements OnInit {
  form!: FormGroup;
  id!: string;

  // ✅ on garde ton constructeur
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: FormationService,
    private etabSvc: EtablissementService
  ) {}

  get etablissements() { return this.etabSvc.snapshot; }

  // 🔹 on garde ta méthode ngOnInit et on l’enrichit
  data!: Formation;         // ⬅️ on mémorise la formation complète

  // 🔹 état pour les imports Excel
  years: string[] = [];
  levels: string[] = [];
  selectedYear = '';
  selectedLevel = '';

  ngOnInit(): void {
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

    this.id = String(this.route.snapshot.paramMap.get('id'));
    const data = this.svc.getById(this.id);
    if (!data) { this.router.navigate(['/formations']); return; }

    this.data = data; // ✅ on garde la référence
    this.form.patchValue(data as any);

    this.initImportsUI();   // ✅ initialisation années/niveaux
  }

  // 🔹 initialisation année / niveau pour les fichiers Excel
  private initImportsUI() {
    const current = new Date().getFullYear();
    this.years = Array.from({ length: 6 }, (_, i) => String(current - i));

    const duree = this.data?.dureeFormation || 3;
    // Ici j’utilise L1..Ln, adapte si tu veux M1/M2 etc.
    this.levels = Array.from({ length: duree }, (_, i) => `L${i + 1}`);

    this.selectedYear = this.years[0] || '';
    this.selectedLevel = this.levels[0] || '';
  }

  onYearChange(value: string) {
    this.selectedYear = value;
  }

  onLevelChange(value: string) {
    this.selectedLevel = value;
  }

  // 🔹 getter pour afficher les fichiers de l'année/niveau sélectionnés
  get currentDocs() {
    if (!this.data || !this.selectedYear || !this.selectedLevel) return [];
    return this.data.imports?.[this.selectedYear]?.[this.selectedLevel] || [];
  }

  // 🔹 upload / ajout d’un fichier Excel pour l’année + niveau sélectionnés
  onFileSelected(evt: Event) {
    if (!this.data || !this.selectedYear || !this.selectedLevel) return;

    const input = evt.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    const ok = /\.(xlsx?|XLSX?)$/.test(file.name);
    if (!ok) {
      alert('Veuillez sélectionner un fichier Excel (.xls ou .xlsx).');
      input.value = '';
      return;
    }

    // ⚠️ suppose que tu as bien une méthode uploadExcel dans FormationService
    this.svc.uploadExcel(this.data.id, this.selectedYear, this.selectedLevel, file)
      .subscribe(doc => {
        const imports = { ...(this.data.imports || {}) };

        if (!imports[this.selectedYear]) {
          imports[this.selectedYear] = {};
        }
        if (!imports[this.selectedYear][this.selectedLevel]) {
          imports[this.selectedYear][this.selectedLevel] = [];
        }

        // on ajoute le nouveau doc au début
        imports[this.selectedYear][this.selectedLevel] = [doc, ...imports[this.selectedYear][this.selectedLevel]];

        this.data.imports = imports;
        this.svc.update(this.data.id, { imports }); // si ton service persiste côté front/mock

        input.value = '';
      });
  }

  // 🔹 supprimer un fichier pour l’année/niveau
  removeDoc(index: number) {
    if (!this.data || !this.selectedYear || !this.selectedLevel) return;

    const imports = { ...(this.data.imports || {}) };
    const list = imports[this.selectedYear]?.[this.selectedLevel] || [];
    list.splice(index, 1);
    imports[this.selectedYear][this.selectedLevel] = list;
    this.data.imports = imports;

    this.svc.update(this.data.id, { imports });
  }

  // 🔹 ouvrir le viewer Excel sur ce fichier
  openViewer(docIndex: number) {
    this.router.navigate(
      ['/formations', this.data.id, 'xls'],
      { queryParams: { year: this.selectedYear, level: this.selectedLevel, index: docIndex } }
    );
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.svc.update(this.id, this.form.getRawValue() as Partial<Formation>);
    this.router.navigate(['/formations']);
  }

  cancel() { this.router.navigate(['/formations']); }
}
