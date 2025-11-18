import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService, AppUser } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, SidebarComponent],
  template: `
    <app-sidebar></app-sidebar>

    <!-- Header -->
    <app-header
      [title]="'Gestion des sous-inspecteurs'"
      [withSidebar]="true"
      [langue]="langue"
      (toggleSidebar)="onToggleSidebar()"
      (changeLang)="onChangeLang($event)"
      (toggleDark)="onToggleDark()"
      (openNotifications)="onOpenNotifications()"
      (logout)="onLogout()"
    ></app-header>

    <!-- Contenu principal -->
    <div
      class="lg:ml-80 pt-28 lg:pt-32 px-4 sm:px-6 pb-10 lg:mt-4
             bg-gradient-to-b from-emerald-50/40 via-white to-white min-h-screen">

      <div
        class="bg-white/95 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl
               overflow-hidden transition-all duration-300">

        <!-- 🔹 Barre d’en-tête : recherche + filtres + bouton -->
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6
                 border-b border-gray-100 bg-white/80 backdrop-blur-sm">

          <!-- 🔍 Recherche + Filtres -->
          <div class="flex flex-col lg:flex-row gap-3 lg:items-center w-full flex-wrap">

            <!-- Recherche -->
            <label class="relative w-full lg:w-72">
              <i class="fa-solid fa-magnifying-glass text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm"></i>
              <input
                type="search"
                placeholder="Rechercher par nom / identifiant / téléphone"
                (input)="onSearchChange($any($event.target).value)"
                class="w-full bg-gray-50 border border-gray-200 rounded-full pl-9 pr-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600
                       placeholder:text-gray-400 transition"
              />
            </label>

            <!-- Filtre état actif -->
            <select
              class="bg-white border border-gray-200 rounded-full px-3.5 py-2.5 text-xs sm:text-sm
                     focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-700"
              (change)="onEtatChange($any($event.target).value)">
              <option value="">État : Tous</option>
              <option value="actif">Actifs</option>
              <option value="inactif">Inactifs</option>
            </select>

            <!-- Filtre validation -->
            <select
              class="bg-white border border-gray-200 rounded-full px-3.5 py-2.5 text-xs sm:text-sm
                     focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-700"
              (change)="onValidationChange($any($event.target).value)">
              <option value="">Validation : Tous</option>
              <option value="valide">Validés</option>
              <option value="non_valide">Non validés</option>
            </select>
          </div>

          
        </div>

        <!-- 🧾 Formulaire -->
        <div class="px-5 sm:px-6 pt-4 pb-6 border-b border-gray-100 bg-white/90">
          <h3 class="text-sm font-semibold text-gray-800 mb-3">
            {{ editingId ? 'Modifier un sous-inspecteur' : 'Ajouter un sous-inspecteur' }}
          </h3>

          <form
            [formGroup]="form"
            (ngSubmit)="submit()"
            class="flex flex-col gap-4">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-gray-600">Identifiant (username)</label>
                <input
                  formControlName="username"
                  placeholder="Ex : sinspecteur01"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-gray-600">Nom complet</label>
                <input
                  formControlName="name"
                  placeholder="Nom et prénom"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-gray-600">Téléphone</label>
                <input
                  formControlName="phone"
                  placeholder="Ex : 22 33 44 55"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-gray-600">Mot de passe</label>
                <input
                  type="password"
                  formControlName="password"
                  placeholder="Mot de passe"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                />
              </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
              <div class="flex items-center gap-2">
                <label class="text-xs font-medium text-gray-600">Photo</label>
                <input
                  type="file"
                  (change)="onPhotoSelected($event)"
                  accept="image/*"
                  class="text-xs"
                />
              </div>

              <img
                *ngIf="form.value.photo"
                [src]="form.value.photo"
                class="w-10 h-10 object-cover rounded-full border border-gray-200 shadow-sm"
              />
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                [disabled]="form.invalid"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold
                       text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60
                       shadow-sm hover:shadow transition">
                <i class="fa-solid fa-check"></i>
                <span>{{ editingId ? 'Mettre à jour' : 'Ajouter' }}</span>
              </button>

              <button
                type="button"
                *ngIf="editingId"
                (click)="cancelEdit()"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold
                       text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200
                       shadow-sm hover:shadow transition">
                <i class="fa-solid fa-xmark"></i>
                <span>Annuler</span>
              </button>
            </div>
          </form>
        </div>

        <!-- 📋 Tableau des sous-inspecteurs -->
        <div class="overflow-x-auto bg-white">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-left text-gray-500 border-b border-gray-100 bg-gray-50/80">
                <th class="px-6 py-3 text-[11px] font-semibold tracking-wide uppercase">Sous-inspecteur</th>
                <th class="px-6 py-3 text-[11px] font-semibold tracking-wide uppercase">Téléphone</th>
                <th class="px-6 py-3 text-[11px] font-semibold tracking-wide uppercase">Statut</th>
                <th class="px-6 py-3 text-[11px] font-semibold tracking-wide uppercase text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr
                *ngFor="let u of filteredSousInspecteurs()"
                class="border-b border-gray-50 hover:bg-emerald-50/40 transition">
                <!-- Sous-inspecteur -->
                <td class="px-6 py-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-100
                             flex items-center justify-center overflow-hidden">
                      <img
                        *ngIf="u.photo"
                        [src]="u.photo"
                        class="w-full h-full object-cover"
                      />
                      <span
                        *ngIf="!u.photo"
                        class="text-xs font-semibold text-emerald-700">
                        {{ u.name ? u.name[0] : 'U' }}
                      </span>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">
                        {{ u.name }}
                        <span class="text-gray-500 text-xs">({{ '@' }}{{ u.username }})</span>
                      </div>
                      <div class="text-xs text-gray-500">
                        ID interne : {{ u.id }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Téléphone -->
                <td class="px-6 py-3 text-gray-700">
                  {{ u.phone }}
                </td>

                <!-- Statut -->
                <td class="px-6 py-3">
                  <div class="flex flex-col gap-1">
                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      [ngClass]="u.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'">
                      <span
                        class="w-1.5 h-1.5 rounded-full"
                        [ngClass]="u.active ? 'bg-green-500' : 'bg-red-500'">
                      </span>
                      {{ u.active ? 'Actif' : 'Inactif' }}
                    </span>

                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      [ngClass]="u.validated
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-yellow-50 text-yellow-700'">
                      <i
                        class="fa-solid"
                        [ngClass]="u.validated ? 'fa-circle-check' : 'fa-hourglass-half'">
                      </i>
                      {{ u.validated ? 'Validé' : 'Non validé' }}
                    </span>
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-6 py-3 text-center">
                  <div class="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">

                    <button
                      class="inline-flex items-center justify-center h-8 px-3 rounded-full
                             border border-blue-100 text-blue-700 bg-blue-50/70
                             hover:bg-blue-100 hover:border-blue-200 transition"
                      title="Modifier"
                      type="button"
                      (click)="startEdit(u)">
                      <i class="fa-solid fa-pen-to-square text-xs mr-1"></i>
                      <span class="hidden sm:inline">Modifier</span>
                    </button>

                    <button
                      class="inline-flex items-center justify-center h-8 px-3 rounded-full
                             border text-xs font-medium
                             hover:shadow-sm transition"
                      type="button"
                      [ngClass]="u.active
                        ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'"
                      (click)="toggleActive(u)">
                      <i
                        class="fa-solid text-xs mr-1"
                        [ngClass]="u.active ? 'fa-ban' : 'fa-check'">
                      </i>
                      <span class="hidden sm:inline">
                        {{ u.active ? 'Désactiver' : 'Activer' }}
                      </span>
                    </button>

                    <button
                      class="inline-flex items-center justify-center h-8 px-3 rounded-full
                             border border-emerald-200 bg-emerald-50 text-emerald-700
                             hover:bg-emerald-100 hover:border-emerald-300 transition
                             disabled:opacity-50"
                      type="button"
                      (click)="validate(u)"
                      [disabled]="u.validated">
                      <i class="fa-solid fa-badge-check text-xs mr-1"></i>
                      <span class="hidden sm:inline">Valider</span>
                    </button>

                    <button
                      class="inline-flex items-center justify-center h-8 w-8 rounded-full
                             border border-red-200 text-red-600 bg-red-50
                             hover:bg-red-100 hover:border-red-300 transition"
                      type="button"
                      (click)="delete(u.id)">
                      <i class="fa-regular fa-trash-can text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr *ngIf="filteredSousInspecteurs().length === 0">
                <td colspan="4"
                    class="px-6 py-10 text-center text-gray-500 text-sm">
                  Aucun sous-inspecteur ne correspond aux filtres actuels.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `
})
export class UsersListComponent {
  form!: FormGroup;
  sousInspecteurs: AppUser[] = [];
  editingId: number | null = null;

  // pour le header
  langue: 'fr' | 'ar' | 'en' = 'fr';

  // filtres
  private search = '';
  private etat: '' | 'actif' | 'inactif' = '';
  private validation: '' | 'valide' | 'non_valide' = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      photo: [''],
    });
    this.refresh();
  }

  private refresh() {
    this.sousInspecteurs = this.userService.listSousInspecteurs();
  }

  // 🔎 Filtres

  onSearchChange(v: string) {
    this.search = v.toLowerCase().trim();
  }

  onEtatChange(v: string) {
    this.etat = v as any;
  }

  onValidationChange(v: string) {
    this.validation = v as any;
  }

  filteredSousInspecteurs(): AppUser[] {
    return this.sousInspecteurs.filter(u => {
      const matchSearch =
        !this.search ||
        [u.name, u.username, u.phone]
          .filter(Boolean)
          .some(v => (v || '').toLowerCase().includes(this.search));

      const matchEtat =
        !this.etat ||
        (this.etat === 'actif' && u.active) ||
        (this.etat === 'inactif' && !u.active);

      const matchValidation =
        !this.validation ||
        (this.validation === 'valide' && u.validated) ||
        (this.validation === 'non_valide' && !u.validated);

      return matchSearch && matchEtat && matchValidation;
    });
  }

  // 🔁 CRUD

  delete(id: number) {
    if (!confirm('Supprimer ce sous-inspecteur ?')) return;
    this.userService.deleteUser(id);
    this.refresh();
  }

  startCreate() {
    this.editingId = null;
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) return;
    const { username, name, phone, password, photo } = this.form.value as any;

    if (this.editingId) {
      this.userService.updateUser(this.editingId, { username, name, phone, password, photo });
    } else {
      this.userService.addUser({
        username,
        name,
        phone,
        password,
        photo,
        role: 'SOUS_INSPECTEUR',
        active: true,
        validated: false
      });
    }
    this.cancelEdit();
    this.refresh();
  }

  startEdit(u: AppUser) {
    this.editingId = u.id;
    this.form.patchValue({
      username: u.username,
      name: u.name,
      phone: u.phone,
      password: u.password,
      photo: u.photo || ''
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset();
  }

  toggleActive(u: AppUser) {
    this.userService.toggleActive(u.id);
    this.refresh();
  }

  validate(u: AppUser) {
    this.userService.validateUser(u.id);
    this.refresh();
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.form.patchValue({ photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  // 🔧 handlers pour le header

  onToggleSidebar() {
    // à connecter si tu gères l’ouverture/fermeture du sidebar
  }

  onChangeLang(lang: 'fr' | 'ar' | 'en') {
    this.langue = lang;
  }

  onToggleDark() {
    const root = document.documentElement;
    root.classList.toggle('dark');
  }

  onOpenNotifications() {
    console.log('Notifications ouvertes');
  }

  onLogout() {
    console.log('Déconnexion');
    // ex: this.auth.logout();
  }
}
