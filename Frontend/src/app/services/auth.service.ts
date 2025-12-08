import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

export type Role = 'INSPECTEUR_GENERAL' | 'SOUS_INSPECTEUR';

export interface AuthUser {
  username: string;
  role: Role;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageKey = 'auth_user';

  constructor(private router: Router, private http: HttpClient) {}

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

  login(username: string, password: string): Observable<void> {
    return this.http
      .post<{ username: string; role: Role }>('http://localhost:8080/auth/login', {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          const user: AuthUser = { username: res.username, role: res.role };
          localStorage.setItem(this.storageKey, JSON.stringify(user));
        }),
        // on ne renvoie rien au composant, juste la complétion (type void)
        map(() => void 0)
      );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.router.navigateByUrl('/login');
  }
}
