import { Injectable } from '@angular/core';
import { Role } from './auth.service';

export interface AppUser {
  id: number;
  username: string;
  role: Role;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: AppUser[] = [
    { id: 1, username: 'inspecteur.general', role: 'INSPECTEUR_GENERAL' },
    { id: 2, username: 'sous1', role: 'SOUS_INSPECTEUR' },
  ];
  private seq = 3;

  listSousInspecteurs(): AppUser[] {
    return this.users.filter(u => u.role === 'SOUS_INSPECTEUR');
  }

  addSousInspecteur(username: string): AppUser {
    const user: AppUser = { id: this.seq++, username, role: 'SOUS_INSPECTEUR' };
    this.users.push(user);
    return user;
  }

  deleteSousInspecteur(id: number): void {
    this.users = this.users.filter(u => !(u.role === 'SOUS_INSPECTEUR' && u.id === id));
  }
}
