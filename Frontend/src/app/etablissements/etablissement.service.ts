// src/app/etablissements/etablissement-http.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etablissement } from './etablissement.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EtablissementService {

  private readonly apiUrl = `${environment.apiUrl}/api/etablissements`;

  constructor(private http: HttpClient) {}

  // 🔹 Lister tous les établissements
  list(): Observable<Etablissement[]> {
    return this.http.get<Etablissement[]>(this.apiUrl);
  }

  // 🔹 Recherche (backend: /api/etablissements/search?q=...)
  search(q: string): Observable<Etablissement[]> {
    return this.http.get<Etablissement[]>(`${this.apiUrl}/search`, {
      params: { q }
    });
  }

  // 🔹 Récupérer un établissement par ID
  getById(id: string): Observable<Etablissement> {
    return this.http.get<Etablissement>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Créer un établissement
  create(data: Omit<Etablissement, 'id'>): Observable<Etablissement> {
    return this.http.post<Etablissement>(this.apiUrl, data);
  }

  // 🔹 Mettre à jour un établissement
  update(id: string, patch: Partial<Etablissement>): Observable<Etablissement> {
    return this.http.put<Etablissement>(`${this.apiUrl}/${id}`, patch);
  }

  // 🔹 Supprimer un établissement
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ========== RELATION ETABLISSEMENT <-> TEXTES ==========

  // 🔁 Associer un texte à un établissement
  addTexte(idEtab: string, idTexte: string): Observable<Etablissement> {
    return this.http.post<Etablissement>(
      `${this.apiUrl}/${idEtab}/textes/${idTexte}`,
      {}
    );
  }

  // ❌ Retirer un texte d’un établissement
  removeTexte(idEtab: string, idTexte: string): Observable<Etablissement> {
    return this.http.delete<Etablissement>(
      `${this.apiUrl}/${idEtab}/textes/${idTexte}`
    );
  }

  // 🔄 Remplacer la liste complète des textes liés à un établissement
  // body attendu par le backend : ["T1", "T2", "T3"]
  setTextes(idEtab: string, texteIds: string[]): Observable<Etablissement> {
    return this.http.put<Etablissement>(
      `${this.apiUrl}/${idEtab}/textes`,
      texteIds
    );
  }
}
