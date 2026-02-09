import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ModalComponent } from '../shared/modal/modal.component';

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
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent, ModalComponent],
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


  // options de rôle – chargées depuis le backend (/roles)
  roleOptions: RoleOption[] = [
    { id: 1, code: 'INSPECTEUR_GENERAL', label: 'Inspecteur général' },
    { id: 2, code: 'SOUS_INSPECTEUR', label: 'Sous-inspecteur' },
  ];

  loadingRoles = false;

  loading = false;

  // contrôle de l'affichage du formulaire de création
  showForm = false;

  // confirmation de suppression
  showDeleteConfirm = false;
  pendingDeleteUser: UserDto | null = null;
  deleting = false;

  // id de l'utilisateur en cours d'édition (null = création)
  editingUserId: number | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  // --------- helpers ---------

  getRoleLabel(code: string): string {
    const found = this.roleOptions.find((r) => r.code === code);
    return found ? found.label : code;
  }

  openForm(): void {
    this.editingUserId = null;
    this.formModel = this.getEmptyForm();
    if (this.roleOptions.length === 0 && !this.loadingRoles) {
      this.loadRoles();
    }
    this.showForm = true;
    this.lockBodyScroll();
  }

  closeForm(form?: NgForm): void {
    if (form) {
      form.resetForm(this.getEmptyForm());
    }
    this.showForm = false;
    this.editingUserId = null;
    this.unlockBodyScrollIfNoModal();
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

  private lockBodyScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  private unlockBodyScrollIfNoModal(): void {
    if (!this.showForm && !this.showDeleteConfirm) {
      document.body.style.overflow = 'auto';
    }
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

  loadRoles(): void {
    this.loadingRoles = true;
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roleOptions = (roles || []).map((r) => ({
          id: r.id,
          code: r.code,
          label: r.label
        }));
        this.loadingRoles = false;
      },
      error: (err) => {
        console.error('Erreur chargement rôles', err);
        this.roleOptions = [];
        this.loadingRoles = false;
        this.notification.error('Impossible de charger les rôles');
      }
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


    const trimmedPassword = (this.formModel.password || '').trim();
    if (!this.editingUserId && trimmedPassword.length === 0) {
      this.notification.warning('Merci de saisir un mot de passe');
      return;
    }


    if (!this.formModel.roleCode) {
      this.notification.warning('Merci de choisir un rôle');
      return;
    }

    const payload: UserPayload = {
      fullname: this.formModel.name,
      username: this.formModel.username,
      phone: (this.formModel.phone || null) as any,
      photo: this.formModel.photo,
      active: this.formModel.active,
      validated: this.formModel.validated,
      role: this.formModel.roleCode!, // Non-null assertion car on vérifie au-dessus
    };

    // Ne pas envoyer password si vide (important en update)
    if (trimmedPassword.length > 0) {
      payload.password = trimmedPassword;
    }

    // Ne pas envoyer id en création (certains backends plantent si id=null)
    if (this.editingUserId) {
      payload.id = this.editingUserId;
    }

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
        const wasEditing = this.editingUserId;
        this.closeForm(form);
        this.notification.success(wasEditing ? 'Utilisateur mis à jour avec succès' : 'Utilisateur créé avec succès');

        if (!wasEditing) {
          const canBeAssigned = (user.role || '').startsWith('SOUS_INSPECTEUR');
          if (canBeAssigned) {
            const ok = window.confirm(
              `Utilisateur créé. Voulez-vous l'affecter maintenant à une inspection ?\n\nInspecteur: ${user.fullname} (${user.username})`
            );
            if (ok) {
              this.router.navigate(['/inspection'], {
                queryParams: { assignedTo: user.username }
              });
            }
          }
        }
      },
      error: (err) => {
        console.error('Erreur sauvegarde utilisateur', err);
        const serverMsg = err?.error;
        const detail =
          typeof serverMsg === 'string'
            ? serverMsg
            : serverMsg?.message || serverMsg?.error || serverMsg?.title || '';
        this.notification.error(
          detail
            ? `Erreur lors de la sauvegarde de l'utilisateur : ${detail}`
            : "Erreur lors de la sauvegarde de l'utilisateur"
        );
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
    if (this.roleOptions.length === 0 && !this.loadingRoles) {
      this.loadRoles();
    }
    this.showForm = true;
    this.lockBodyScroll();
  }

  requestDelete(user: UserDto): void {
    console.log('[Users] requestDelete', user);
    this.pendingDeleteUser = user;
    this.showDeleteConfirm = true;
    this.lockBodyScroll();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.pendingDeleteUser = null;
    this.deleting = false;
    this.unlockBodyScrollIfNoModal();
  }

  confirmDelete(): void {
    if (!this.pendingDeleteUser || this.deleting) {
      return;
    }

    const user = this.pendingDeleteUser;
    this.deleting = true;

    this.userService.delete(user.id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== user.id);
        this.notification.success('Utilisateur supprimé');
        this.cancelDelete();
      },
      error: (err) => {
        console.error('Erreur suppression utilisateur', err);
        this.notification.error('Impossible de supprimer l\'utilisateur');
        this.deleting = false;
      },
    });
  }
}