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
    console.log('Auth - Raw localStorage data:', raw);
    const parsed = raw ? (JSON.parse(raw) as AuthUser) : null;
    console.log('Auth - Parsed user:', parsed);
    return parsed;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  hasRole(roles: Role[] | Role): boolean {
    const user = this.currentUser;
    if (!user) return false;
    const arr = Array.isArray(roles) ? roles : [roles];
<<<<<<< HEAD
    return arr.some((r) => {
      if (!r) return false;
      if (r.endsWith('*')) {
        const prefix = r.slice(0, -1);
        return user.role?.startsWith(prefix);
      }
      return user.role === r;
    });
=======
    console.log('User role:', user.role, 'Required roles:', arr);
    
    // Vérification plus flexible - inclut les variations possibles
    const userRoleUpper = user.role.toUpperCase();
    const hasAccess = arr.some(role => role.toUpperCase() === userRoleUpper);
    
    console.log('User role (upper):', userRoleUpper, 'Has access:', hasAccess);
    return hasAccess;
>>>>>>> oumou
  }

  login(username: string, password: string): Observable<void> {
    return this.http
<<<<<<< HEAD
<<<<<<< HEAD
      .post<{ username: string; role: Role }>(`${environment.apiUrl}/auth/login`, {
=======
      .post<{ username: string; roleCode: Role }>(`${environment.apiUrl}/auth/login`, {
>>>>>>> 4bd41a85bb56c3d11a6f0f9bb76e2923710d5f64
=======
      .post<{ username: string; roleCode?: Role }>(`${environment.apiUrl}/auth/login`, {
>>>>>>> oumou
        username,
        password,
      })
      .pipe(
        tap((res) => {
          console.log('Auth - Login response:', res);
          
          // Si le backend ne retourne pas le rôle, le récupérer depuis l'API users
          if (!res.roleCode) {
            console.log('Auth - No role in login response, fetching from users API...');
            this.http.get<any[]>(`${environment.apiUrl}/users`).subscribe(users => {
              const currentUser = users.find(u => u.username === username);
              if (currentUser && currentUser.role) {
                const user: AuthUser = { username: res.username, role: currentUser.role };
                console.log('Auth - User object created with role from DB:', user);
                localStorage.setItem(this.storageKey, JSON.stringify(user));
              } else {
                // Fallback : créer un utilisateur sans rôle
                const user: AuthUser = { username: res.username, role: 'INSPECTEUR_GENERAL' };
                console.log('Auth - Fallback - assigned INSPECTEUR_GENERAL role');
                localStorage.setItem(this.storageKey, JSON.stringify(user));
              }
            });
          } else {
            // Cas normal : le backend retourne le rôle
            const user: AuthUser = { username: res.username, role: res.roleCode };
            console.log('Auth - User object created:', user);
            localStorage.setItem(this.storageKey, JSON.stringify(user));
          }
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
