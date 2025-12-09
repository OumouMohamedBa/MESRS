
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { UserService, UserDto, UserPayload } from '../services/user.service';
import { NotificationService } from '../services/notification.service';

export interface RoleOption {
  id: number;
  code: string;
  label: string;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './users-list.component.html',
  
})
export class UsersListComponent implements OnInit {
  // liste d’utilisateurs affichée dans le tableau
  users: UserDto[] = [];

  // simple formulaire "flat"
  formModel: {
    id: number | null;
    name: string;
    username: string;
    phone: string;
    password: string;
    photo: string | null;
    roleCode: string | null;
    active: boolean;
    validated: boolean;
  } = this.getEmptyForm();

  // options de rôle – adapte les id pour coller à ta base
  roleOptions: RoleOption[] = [
    { id: 1, code: 'INSPECTEUR_GENERAL',       label: 'Inspecteur général' },
    { id: 2, code: 'SOUS_INSPECTEUR_TEXTES',   label: 'Sous-inspecteur des textes' },
    { id: 3, code: 'SOUS_INSPECTEUR_FINANCES', label: 'Sous-inspecteur des finances' },
  ];

  loading = false;

  // contrôle de l'affichage du formulaire de création
  showForm = false;

  // id de l'utilisateur en cours d'édition (null = création)
  editingUserId: number | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // --------- helpers ---------

  getRoleLabel(code: string): string {
    const found = this.roleOptions.find((r) => r.code === code);
    return found ? found.label : code;
  }

  openForm(): void {
    this.editingUserId = null;
    this.formModel = this.getEmptyForm();
    this.showForm = true;
  }

  closeForm(form?: NgForm): void {
    if (form) {
      form.resetForm(this.getEmptyForm());
    }
    this.showForm = false;
    this.editingUserId = null;
  }

  private getEmptyForm() {
    return {
      id: null,
      name: '',
      username: '',
      phone: '',
      password: '',
      photo: null,
      roleCode: null,
      active: true,
      validated: true,
    };
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (dtos) => {
        this.users = dtos;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement users', err);
        this.loading = false;
        this.notification.error('Impossible de charger les utilisateurs');
      },
    });
  }

  // fichier choisi → on garde juste le nom dans `photo`
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.formModel.photo = file ? file.name : null;
  }

  // --------- création / édition ---------

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.notification.warning('Merci de remplir les champs obligatoires');
      return;
    }
    if (!this.formModel.roleCode) {
      this.notification.warning('Merci de choisir un rôle');
      return;
    }

    const payload: UserPayload = {
      id: this.formModel.id,
      fullname: this.formModel.name,
      username: this.formModel.username,
      phone: this.formModel.phone,
      password: this.formModel.password,
      active: this.formModel.active,
      role: this.formModel.roleCode,
    };

    // création ou mise à jour selon editingUserId
    const request$ = this.editingUserId
      ? this.userService.update(this.editingUserId, payload)
      : this.userService.create(payload);

    request$.subscribe({
      next: (user) => {
        if (this.editingUserId) {
          // remplacement dans la liste
          this.users = this.users.map((u) => (u.id === user.id ? user : u));
        } else {
          this.users.push(user);
        }
        this.formModel = this.getEmptyForm();
        form.resetForm(this.formModel);
        this.showForm = false;
        const wasEditing = this.editingUserId;
        this.editingUserId = null;
        this.notification.success(wasEditing ? 'Utilisateur mis à jour avec succès' : 'Utilisateur créé avec succès');
      },
      error: (err) => {
        console.error('Erreur sauvegarde utilisateur', err);
        this.notification.error('Erreur lors de la sauvegarde de l\'utilisateur');
      },
    });
  }

  onEdit(user: UserDto): void {
    this.editingUserId = user.id;
    this.formModel = {
      id: user.id,
      name: user.fullname,
      username: user.username,
      phone: user.phone || '',
      password: '', // On laisse vide pour ne pas écraser s'il ne change pas
      photo: user.photo || null,
      roleCode: user.role || null,
      active: user.active,
      validated: user.validated,
    };
    this.showForm = true;
  }

  onDelete(user: UserDto): void {
    if (!confirm(`Supprimer l'utilisateur ${user.username} ?`)) {
      return;
    }

    this.userService.delete(user.id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== user.id);
      },
      error: (err) => {
        console.error('Erreur suppression utilisateur', err);
        this.notification.error('Impossible de supprimer l\'utilisateur');
      },
    });
  }
}