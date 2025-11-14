import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService, AppUser } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="p-4">
    <h2>Gestion des Sous-Inspecteurs</h2>

    <form [formGroup]="form" (ngSubmit)="add()" class="flex gap-2 mt-3">
      <input formControlName="username" placeholder="Nom d'utilisateur" />
      <button type="submit" [disabled]="form.invalid">Ajouter</button>
    </form>

    <ul class="mt-4">
      <li *ngFor="let u of sousInspecteurs">
        {{u.username}}
        <button (click)="delete(u.id)">Supprimer</button>
      </li>
    </ul>
  </div>
  `
})
export class UsersListComponent {
  form!: FormGroup;
  sousInspecteurs: AppUser[] = [];

  constructor(private fb: FormBuilder, private userService: UserService, private auth: AuthService) {
    this.form = this.fb.group({ username: ['', Validators.required] });
    this.sousInspecteurs = this.userService.listSousInspecteurs();
  }

  add() {
    if (this.form.invalid) return;
    const username = this.form.value.username as string;
    this.userService.addSousInspecteur(username);
    this.sousInspecteurs = this.userService.listSousInspecteurs();
    this.form.reset();
  }

  delete(id: number) {
    this.userService.deleteSousInspecteur(id);
    this.sousInspecteurs = this.userService.listSousInspecteurs();
  }
}
