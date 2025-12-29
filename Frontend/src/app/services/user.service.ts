// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// === modèles alignés avec ton backend Java ===
export interface RoleRef {
  id: number;
  code: string;
  label: string;
}

export interface UserDto {
  id: number;
  username: string;
  fullname: string;
  phone: string | null;
  password?: string | null;
  photo: string | null;
  role: string; // "INSPECTEUR_GENERAL" etc.
  active: boolean;
  validated: boolean;
}

export interface UserPayload {
  id?: number | null;
  fullname: string;
  username: string;
  phone: string | null;
  password?: string;
  photo?: string | null;
  role: string;
  active: boolean;
  validated?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = `${environment.apiUrl}/users`;
  private rolesApi = `${environment.apiUrl}/api/roles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.api);
  }

  create(payload: UserPayload): Observable<UserDto> {
    console.log('POST /users payload =>', payload);
    return this.http.post<UserDto>(this.api, payload);
  }

  update(id: number, payload: UserPayload): Observable<UserDto> {
    console.log('PUT /users/' + id + ' payload =>', payload);
    return this.http.put<UserDto>(`${this.api}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  getRoles(): Observable<RoleRef[]> {
    return this.http.get<RoleRef[]>(this.rolesApi);
  }
}
