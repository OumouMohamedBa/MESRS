import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TexteService } from './texte.service';
import { Texte } from './texte.model';

@Component({
  selector: 'app-textes-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent, SidebarComponent],
  templateUrl: './textes-edit.component.html'
})
export class TextesEditComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  texteId!: number;
  texte!: Texte | null;
  selectedFileName = '';

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
    this.texteId = Number(idParam);
    if (!this.texteId) {
      this.router.navigate(['/textes']);
      return;
    }

    this.texte = this.svc.getById(this.texteId);
    if (!this.texte) {
      this.router.navigate(['/textes']);
      return;
    }

    this.form.patchValue(this.texte);
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
    const blobUrl = URL.createObjectURL(file);
    this.form.patchValue({ fichierUrl: blobUrl });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.svc.update(this.texteId, this.form.value);
    this.router.navigate(['/textes']);
  }
}
