import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { EtablissementService } from './etablissement.service';

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
      telephone: [''],
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
    // Service create() est sync (mock). Pas de subscribe nécessaire.
    this.svc.create(this.form.getRawValue() as any);
    this.router.navigate(['/etablissements']);
  }

  cancel() {
    this.router.navigate(['/etablissements']);
  }
}
