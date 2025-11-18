import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type Role = 'INSPECTEUR_GENERAL' | 'SOUS_INSPECTEUR';

export interface AuthUser {
  username: string;
  role: Role;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageKey = 'auth_user';

  constructor(private router: Router) {}

  get currentUser(): AuthUser | null {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  hasRole(roles: Role[] | Role): boolean {
    const user = this.currentUser;
    if (!user) return false;
    const arr = Array.isArray(roles) ? roles : [roles];
    return arr.includes(user.role);
  }

  login(username: string, password: string): boolean {
    // Demo/in-memory: choose role by username convention.
    // In a real app, call backend and receive a token + role.
    const role: Role = username.toLowerCase().includes('general')
      ? 'INSPECTEUR_GENERAL'
      : 'SOUS_INSPECTEUR';

    const user: AuthUser = { username, role };
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.router.navigateByUrl('/login');
  }
}
