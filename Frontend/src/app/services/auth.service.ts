import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type Role = string;

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
    return arr.some((r) => {
      if (!r) return false;
      if (r.endsWith('*')) {
        const prefix = r.slice(0, -1);
        return user.role?.startsWith(prefix);
      }
      return user.role === r;
    });
  }

  login(username: string, password: string): Observable<void> {
    return this.http
<<<<<<< HEAD
      .post<{ username: string; role: Role }>(`${environment.apiUrl}/auth/login`, {
=======
      .post<{ username: string; roleCode: Role }>(`${environment.apiUrl}/auth/login`, {
>>>>>>> 4bd41a85bb56c3d11a6f0f9bb76e2923710d5f64
        username,
        password,
      })
      .pipe(
        tap((res) => {
          const user: AuthUser = { username: res.username, role: res.roleCode };
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
