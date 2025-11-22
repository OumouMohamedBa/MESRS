import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { EtablissementService } from './etablissement.service';
import { Etablissement } from './etablissement.model';

@Component({
  selector: 'app-etablissements-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './etablissements-add.component.html'
})
export class EtablissementsAddComponent {
  form!: FormGroup;
  constructor(private fb: FormBuilder, private svc: EtablissementService, private router: Router) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', Validators.required],
      statutJuridique: ['', Validators.required],
      localisation: [''],
      dateCreation: ['', Validators.required],
      dateOuverture: ['', Validators.required],
      contacts: [''],
      conseilAdministration: [false],
      conseilScientifique: [false]
    });
  }

  submitting = false;

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const { id, ...rest } = this.form.getRawValue();
    const payload = rest as Omit<Etablissement, 'id'>;
    this.svc.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/etablissements']);
      },
      error: err => {
        console.error('Erreur lors de la création de l\'établissement', err);
        this.submitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/etablissements']);
  }
}
