// texte.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Texte } from './texte.model';

@Injectable({ providedIn: 'root' })
export class TexteService {

  // adapte selon ton backend (host/port/contexte)
  private readonly apiUrl = 'http://localhost:8080/api/texte';

  constructor(private http: HttpClient) {}

  // ---- CRUD de base ----

  list(): Observable<Texte[]> {
    return this.http.get<Texte[]>(this.apiUrl);
  }

  search(q: string): Observable<Texte[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<Texte[]>(`${this.apiUrl}/search`, { params });
  }

  getById(id: string): Observable<Texte> {
    return this.http.get<Texte>(`${this.apiUrl}/${id}`);
  }

  create(data: Texte, file: File): Observable<Texte> {
    const formData = new FormData();

    formData.append('id', data.id);
    formData.append('titre', data.titre);
    formData.append('typeDocument', data.typeDocument);
    if (data.objet) {
      formData.append('objet', data.objet);
    }
    formData.append('datePublication', data.datePublication);
    formData.append('referenceOfficielle', data.referenceOfficielle);
    formData.append('portee', data.portee);
    if (data.resumeContenu) {
      formData.append('resumeContenu', data.resumeContenu);
    }
    formData.append('statutApplication', data.statutApplication);
    formData.append('file', file);

    return this.http.post<Texte>(this.apiUrl, formData);
  }

  update(id: string, data: Partial<Texte>, file?: File): Observable<Texte> {
    const formData = new FormData();

    if (data.titre) {
      formData.append('titre', data.titre);
    }
    if (data.typeDocument) {
      formData.append('typeDocument', data.typeDocument);
    }
    if (data.objet !== undefined) {
      formData.append('objet', data.objet);
    }
    if (data.datePublication) {
      formData.append('datePublication', data.datePublication);
    }
    if (data.referenceOfficielle) {
      formData.append('referenceOfficielle', data.referenceOfficielle);
    }
    if (data.portee) {
      formData.append('portee', data.portee);
    }
    if (data.resumeContenu !== undefined) {
      formData.append('resumeContenu', data.resumeContenu);
    }
    if (data.statutApplication) {
      formData.append('statutApplication', data.statutApplication);
    }
    if (file) {
      formData.append('file', file);
    }

    return this.http.put<Texte>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ---- Gestion de la relation Texte <-> Établissements ----

  addEtablissements(idTexte: string, etabIds: string[]): Observable<Texte> {
    return this.http.post<Texte>(
      `${this.apiUrl}/${idTexte}/etablissements`,
      etabIds
    );
  }

  getTextesByEtablissement(idEtab: string): Observable<Texte[]> {
    const params = new HttpParams().set('etablissementId', idEtab);
    return this.http.get<Texte[]>(`${this.apiUrl}/by-etablissement`, { params });
  }
}
