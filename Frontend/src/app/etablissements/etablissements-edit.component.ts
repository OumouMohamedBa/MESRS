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
      telephone: [''],
      conseilAdministration: [false],
      conseilScientifique: [false]
    });

    this.id = String(this.route.snapshot.paramMap.get('id'));
    const data = this.svc.getById(this.id);
    if (!data) {
      this.router.navigate(['/etablissements']);
      return;
    }
    this.form.patchValue(data as any);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.svc.update(this.id, this.form.getRawValue() as Partial<Etablissement>);
    this.router.navigate(['/etablissements']);
  }

  cancel() {
    this.router.navigate(['/etablissements']);
  }
}
