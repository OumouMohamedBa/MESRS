import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TexteService } from './texte.service';

@Component({
  selector: 'app-textes-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent, SidebarComponent],
  templateUrl: './textes-add.component.html'
})
export class TextesAddComponent {
  form!: FormGroup;
  submitting = false;
  selectedFileName = '';

  // variable pour stocker le titre "pur" (sans préfixe)
  private baseTitle: string = '';

  // flag pour ignorer les valueChanges déclenchés par setValue dans le code
  private isProgrammatic = false;

  constructor(
    private fb: FormBuilder,
    private svc: TexteService,
    private router: Router
  ) {
    this.form = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      reference: ['', Validators.required],
      datePublication: ['', Validators.required],
      statut: ['En vigueur', Validators.required],
      portee: ['Nationale', Validators.required],
      fichierUrl: ['', Validators.required]
    });

    // initialiser baseTitle si titre a déjà une valeur (rare au add, possible si prérempli)
    const initTitre = (this.form.get('titre')!.value || '').toString().trim();
    this.baseTitle = this.stripPrefixes(initTitre);

    // lorsque l'utilisateur modifie manuellement le champ 'titre'
    this.form.get('titre')!.valueChanges.subscribe((val: string) => {
      if (this.isProgrammatic) {
        // ignore les changements causés par setValue() dans le code
        return;
      }
      const cleaned = this.stripPrefixes((val || '').toString().trim());
      this.baseTitle = cleaned; // met à jour le titre de base
    });

    // lorsque le type change : reconstituer le titre à partir de baseTitle
    this.form.get('type')!.valueChanges.subscribe((val: string) => {
      const type = (val || '').toString().trim();
      const titleCtrl = this.form.get('titre')!;

      // compose le nouveau titre sans concaténation
      const newTitle = type ? `${type} - ${this.baseTitle}`.trim() : this.baseTitle;

      // appliquer la valeur de façon programmatique (sans ré-émettre d'événement)
      this.isProgrammatic = true;
      titleCtrl.setValue(newTitle, { emitEvent: false });

      // petite temporisation pour éviter tout conflit synchrone
      setTimeout(() => {
        this.isProgrammatic = false;
      }, 0);
    });
  }

  // utilitaire : supprime tous les préfixes du type "QuelqueChose - " situés au début
  private stripPrefixes(value: string): string {
    if (!value) return '';
    // accepte tout caractère avant " - " (inclut espaces, chiffres, accents)
    // supprime une ou plusieurs occurrences répétées en début de chaîne
    return value.replace(/^(.+? - )+/u, '').trim();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const { titre, type, reference, datePublication, statut, portee, fichierUrl } = this.form.value;

    this.svc.create({
      titre: titre!,
      type: type!,
      reference: reference!,
      datePublication: datePublication!,
      statut: statut as any,
      portee: portee as any,
      fichierUrl: fichierUrl || undefined
    });

    this.router.navigate(['/textes']);
  }

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
}
