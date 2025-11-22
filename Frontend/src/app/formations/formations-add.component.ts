import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FormationService } from './formation.service';
import { EtablissementService } from '../etablissements/etablissement.service';
import { UploadedDoc, Formation, FormationBackendPayload } from './formation.model';

@Component({
  selector: 'app-formations-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './formations-add.component.html'
})
export class FormationsAddComponent implements OnInit {
  form!: FormGroup;
  // Liste des établissements chargée depuis le backend
  etablissements: any[] = [];
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

  // Import Excel par année et niveau (temporaire avant enregistrement)
  years: string[] = [];
  levels: string[] = [];
  selectedYear = '';
  selectedLevel = '';
  imports: { [annee: string]: { [niveau: string]: UploadedDoc[] } } = {};

  ngOnInit(): void {
    // Charger la liste des établissements pour le select
    this.etabSvc.list().subscribe({
      next: data => {
        this.etablissements = data || [];
      },
      error: err => {
        console.error('Erreur lors du chargement des établissements', err);
        this.etablissements = [];
      }
    });

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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    // Mapping vers le backend
    const payload: FormationBackendPayload = {
      nomFiliere: raw.nomFiliere,
      domaine: raw.domaine,
      diplomeDelivre: raw.diplomeDelivre,
      dureeFormation: String(raw.dureeFormation), // backend attend string
      dateCreation: raw.dateCreation, // déjà format yyyy-mm-dd
      dateOuverture: raw.dateOuverture, // déjà format yyyy-mm-dd
      etatAccreditation: raw.etatAccreditation,
      nombreEnseignants: raw.nombreEnseignants,
      nombreInscrits: raw.nombreInscrits,
      nombreDiplomesN1: raw.nombreDiplomesN1,
      doubleDiplome: raw.doubleDiplome,
      revisionsRecentes: raw.revisionsRecentes,
      etablissementId: raw.etablissementId // indispensable pour la relation
    };
    console.log('Payload envoyé au backend:', payload);
    this.svc.create(payload).subscribe({
      next: () => {
        this.router.navigate(['/formations']);
      },
      error: err => {
        console.error('Erreur lors de la création de la formation', err);
        if (err.error) {
          console.error('Détail backend:', err.error);
          // Afficher le contenu de l'erreur en format JSON lisible
          try {
            console.error('Backend error JSON:', JSON.stringify(err.error, null, 2));
          } catch (e) {
            console.error('Impossible de sérialiser l’erreur backend');
          }
        }
      }
    });
  }
  cancel() { this.router.navigate(['/formations']); }
}
