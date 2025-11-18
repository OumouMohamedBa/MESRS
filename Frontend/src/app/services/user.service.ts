import { Injectable } from '@angular/core';
import { Role } from './auth.service';

export interface AppUser {
  id: number;
  username: string;
  name: string;
  phone: string;
  password: string;
  photo?: string; 
  role: Role;
  active: boolean;
  validated: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private storageKey = 'app_users';
  private users: AppUser[] = [];
  private seq = 1;

  constructor() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as AppUser[];
      this.users = parsed;
      this.seq = this.users.reduce((m, u) => Math.max(m, u.id), 0) + 1;
    } else {
      this.users = [
        {
          id: 1,
          username: 'inspecteur.general',
          name: 'Inspecteur Général',
          phone: '770000000',
          password: 'admin',
          role: 'INSPECTEUR_GENERAL',
          active: true,
          validated: true,
        },
        {
          id: 2,
          username: 'sous1',
          name: 'Sous Inspecteur 1',
          phone: '771111111',
          password: 'password',
          role: 'SOUS_INSPECTEUR',
          active: true,
          validated: true,
        },
      ];
      this.seq = 3;
      this.persist();
    }
  }

  private persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.users));
  }

  listSousInspecteurs(): AppUser[] {
    return this.users.filter(u => u.role === 'SOUS_INSPECTEUR');
  }

  addSousInspecteur(username: string): AppUser {
    const user: AppUser = {
      id: this.seq++,
      username,
      name: username,
      phone: '',
      password: 'password',
      role: 'SOUS_INSPECTEUR',
      active: true,
      validated: false,
    };
    this.users.push(user);
    this.persist();
    return user;
  }

  deleteSousInspecteur(id: number): void {
    this.users = this.users.filter(u => !(u.role === 'SOUS_INSPECTEUR' && u.id === id));
    this.persist();
  }

  listAll(): AppUser[] {
    return [...this.users];
  }

  addUser(data: Omit<AppUser, 'id'>): AppUser {
    const user: AppUser = { ...data, id: this.seq++ };
    if (!user.username) user.username = data.name || 'user' + user.id;
    this.users.push(user);
    this.persist();
    return user;
  }

  updateUser(id: number, patch: Partial<Omit<AppUser, 'id'>>): AppUser | null {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...patch };
    this.persist();
    return this.users[idx];
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
    this.persist();
  }

  toggleActive(id: number): AppUser | null {
    const u = this.users.find(x => x.id === id);
    if (!u) return null;
    u.active = !u.active;
    this.persist();
    return u;
  }

  validateUser(id: number): AppUser | null {
    const u = this.users.find(x => x.id === id);
    if (!u) return null;
    u.validated = true;
    this.persist();
    return u;
  }
}
