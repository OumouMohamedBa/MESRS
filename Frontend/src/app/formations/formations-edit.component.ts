import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FormationService } from './formation.service';
import { EtablissementService } from '../etablissements/etablissement.service';
import { Formation, FormationBackendPayload, FormationUpdatePayload } from './formation.model';

@Component({
  selector: 'app-formations-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './formations-edit.component.html'
})
export class FormationsEditComponent implements OnInit {
  form!: FormGroup;
  id!: string;

  // Liste des établissements chargée depuis le backend
  etablissements: any[] = [];

  // 🔹 on garde ta méthode ngOnInit et on l’enrichit
  data!: Formation;         // ⬅️ on mémorise la formation complète
  importsList: any[] = []; // Liste des imports depuis le backend

  // 🔹 état pour les imports Excel
  years: string[] = [];
  levels: string[] = [];
  selectedYear = '';
  selectedLevel = '';

  // ✅ constructeur
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: FormationService,
    private etabSvc: EtablissementService
  ) {}

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

    this.id = String(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(this.id).subscribe({
      next: data => {
        if (!data) {
          this.router.navigate(['/formations']);
          return;
        }
        this.data = data; // ✅ on garde la référence
        this.form.patchValue(data as any);
        this.initImportsUI();   // ✅ initialisation années/niveaux
        // Charger la liste des imports depuis le backend
        this.loadImports(this.id);
      },
      error: err => {
        console.error('Erreur lors du chargement de la formation', err);
        this.router.navigate(['/formations']);
      }
    });
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

  // Charger les imports depuis le backend
  private loadImports(id: string) {
    this.svc.listImports(id).subscribe({
      next: (imports) => {
        this.importsList = imports || [];
        console.log('Imports chargés dans edit:', this.importsList);
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

  // 🔹 getter pour afficher les fichiers de l'année/niveau sélectionnés
  get currentDocs() {
    // Filtrer les imports selon l'année et le niveau sélectionnés
    return this.importsList.filter(imp => 
      imp.anneeUniversitaire === this.selectedYear && 
      imp.niveau === this.selectedLevel
    );
  }

  // 🔹 upload / ajout d’un fichier Excel pour l’année + niveau sélectionnés
  onFileSelected(evt: Event) {
    if (!this.data || !this.selectedYear || !this.selectedLevel) return;
    const input = evt.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    const ok = /\.(xlsx?|XLSX?)$/.test(file.name);
    if (!ok) { alert('Veuillez sélectionner un fichier Excel (.xls ou .xlsx).'); return; }

    // Upload vers le backend
    const dataId = this.data.id; // capturer l'ID avant le subscribe
    this.svc.uploadExcel(dataId, this.selectedYear, this.selectedLevel, file).subscribe({
      next: (doc) => {
        console.log('Upload réussi dans edit:', doc);
        // Recharger la liste des imports depuis le backend
        this.refreshImports();
        input.value = '';
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

  // 🔹 supprimer un fichier pour l'année/niveau
  removeDoc(index: number) {
    if (!this.data || !this.selectedYear || !this.selectedLevel) return;
    const docs = this.currentDocs;
    const docToDelete = docs[index];
    if (!docToDelete) return;

    // Supprimer via le backend en utilisant l'ID de l'import
    this.svc.deleteImport(docToDelete.id).subscribe({
      next: () => {
        console.log('Suppression réussie dans edit');
        // Recharger la liste des imports
        this.refreshImports();
      },
      error: err => {
        console.error('Erreur lors de la suppression du fichier', err);
        alert('Erreur lors de la suppression du fichier');
      }
    });
  }

  // 🔹 ouvrir le viewer Excel ou XSL sur ce fichier
  openViewer(docIndex: number) {
    const docs = this.currentDocs;
    const doc = docs[docIndex];
    if (!doc) return;
    
    const route = this.isXslFile(doc.name) ? 'xsl' : 'xls';
    this.router.navigate(
      ['/formations', this.data.id, route],
      { queryParams: { year: this.selectedYear, level: this.selectedLevel, index: docIndex } }
    );
  }

  // Déterminer si un fichier est XSL
  isXslFile(fileName: string): boolean {
    return /\.(xsl|xslt|XSL|XSLT)$/i.test(fileName);
  }

  // Obtenir la route appropriée selon le type de fichier (toujours xls car le composant gère les deux)
  getViewerRoute(fileName: string): string {
    return 'xls'; // Le composant Excel gère maintenant aussi les fichiers XSL
  }

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
      dateCreation: raw.dateCreation,
      dateOuverture: raw.dateOuverture,
      etatAccreditation: raw.etatAccreditation,
      nombreEnseignants: raw.nombreEnseignants,
      nombreInscrits: raw.nombreInscrits,
      nombreDiplomesN1: raw.nombreDiplomesN1,
      doubleDiplome: raw.doubleDiplome,
      revisionsRecentes: raw.revisionsRecentes,
      etablissementId: raw.etablissementId
    };
    this.svc.update(this.id, payload).subscribe({
      next: () => {
        this.router.navigate(['/formations']);
      },
      error: err => {
        console.error('Erreur lors de la mise à jour de la formation', err);
        if (err.error) {
          console.error('Détail backend:', err.error);
        }
      }
    });
  }

  cancel() { this.router.navigate(['/formations']); }
}
