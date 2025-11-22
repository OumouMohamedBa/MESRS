import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { EtablissementService } from './etablissement.service';
import { Etablissement } from './etablissement.model';

@Component({
  selector: 'app-etablissements-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './etablissements-edit.component.html'
})
export class EtablissementsEditComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  id!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: EtablissementService
  ) {}

  ngOnInit(): void {
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

    this.id = String(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(this.id).subscribe({
      next: data => {
        if (!data) {
          this.router.navigate(['/etablissements']);
          return;
        }
        this.form.patchValue(data as any);
      },
      error: err => {
        console.error('Erreur lors du chargement de l\'établissement', err);
        this.router.navigate(['/etablissements']);
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const patch = this.form.getRawValue() as Partial<Etablissement>;
    this.svc.update(this.id, patch).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/etablissements']);
      },
      error: err => {
        console.error('Erreur lors de la mise à jour de l\'établissement', err);
        this.submitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/etablissements']);
  }
}
