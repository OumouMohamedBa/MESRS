import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TexteService } from './texte.service';
import { Texte } from './texte.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-textes-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent, SidebarComponent],
  templateUrl: './textes-edit.component.html'
})
export class TextesEditComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  texteId!: string;
  texte!: Texte | null;
  selectedFileName = '';
  private selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: TexteService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      reference: ['', Validators.required],
      datePublication: ['', Validators.required],
      statut: ['En vigueur', Validators.required],
      portee: ['Nationale', Validators.required],
      fichierUrl: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/textes']);
      return;
    }
    this.texteId = idParam;

    this.svc.getById(this.texteId).subscribe({
      next: texte => {
        this.texte = texte;
        this.form.patchValue({
          titre: texte.titre,
          type: texte.typeDocument,
          reference: texte.referenceOfficielle,
          datePublication: texte.datePublication,
          statut: texte.statutApplication,
          portee: texte.portee,
          fichierUrl: texte.url
        });
      },
      error: err => {
        console.error('Erreur lors du chargement du texte', err);
        this.router.navigate(['/textes']);
      }
    });
  }

  // 🧾 Gestion du fichier PDF
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Veuillez sélectionner un fichier PDF.');
      input.value = '';
      return;
    }

    this.selectedFileName = file.name;
    this.selectedFile = file;
    this.form.patchValue({ fichierUrl: file.name });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const { titre, type, reference, datePublication, statut, portee } = this.form.value;

    const partialTexte: Partial<Texte> = {
      titre: titre!,
      typeDocument: type!,
      referenceOfficielle: reference!,
      datePublication: datePublication!,
      statutApplication: statut!,
      portee: portee!,
      url: this.texte?.url || ''
    };

    this.svc.update(this.texteId, partialTexte, this.selectedFile || undefined).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/textes']);
      },
      error: err => {
        this.submitting = false;
        console.error('Erreur lors de la mise a jour du texte', err);
      }
    });
  }

  getPdfUrl(): string {
    return `http://localhost:8080/api/texte/${this.texteId}/fichier`;
  }
}
